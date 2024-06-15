import { UUID } from 'uuidjs'
import dayjs from 'dayjs'
import * as Util from './__autoGenerated/util'
import { useCallback, useReducer } from 'react'
import { useFieldArray } from 'react-hook-form'

const _rowObjectIdSymbol: unique symbol = Symbol()
const _rowTypeIdSymbol: unique symbol = Symbol()
const _ColumnIdSymbol: unique symbol = Symbol()
export type RowObjectId = string & { [_rowObjectIdSymbol]: never }
export type RowTypeId = string & { [_rowTypeIdSymbol]: never }
export type ColumnId = string & { [_ColumnIdSymbol]: never }

export type EditableObject = {
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
}
export type RowObject = EditableObject & {
  id: RowObjectId
  text: string
  type: RowTypeId
  attrs: { [key: ColumnId]: RowObjectAttr }
  indent: number
  createdOn: string
  comments: Comment[]
}
export type RowObjectAttr = {
  value: string
  updatedOn: string
  comments: Comment[]
}
export type RowType = EditableObject & {
  id: RowTypeId
  name?: string
  columns: { id: ColumnId, name?: string }[]
  comments: Comment[]
}

export type GridRow = GridRowOfRowObject | GridRowOfRowType
export type GridRowOfRowObject = {
  type: 'row'
  item: RowObject
}
export type GridRowOfRowType = {
  type: 'rowType'
  rowTypeId: RowTypeId
}

// ---------------------------------------------------

export const ROWTYPE_STYLE = 'text-neutral-500 bg-neutral-500/10'

export type PageFormState = {
  gridRows: GridRow[]
}

const rowTypeMapReducer = Util.defineReducer((state: {
  rowTypeMap: Map<RowTypeId, RowType>
}) => ({
  init: (rowTypes: RowType[]) => ({
    rowTypeMap: new Map(rowTypes.map(t => [t.id, t])),
  }),
  set: (rowType: RowType) => {
    const rowTypeMap = new Map(state.rowTypeMap)
    rowTypeMap.set(rowType.id, rowType)
    return { rowTypeMap }
  },
}))
export const useRowTypeMap = () => {
  return useReducer(rowTypeMapReducer, undefined, () => ({ rowTypeMap: new Map() }))
}
export type RowTypeMapDispatcher = ReturnType<typeof useRowTypeMap>['1']

// ---------------------------------------------------
/** Rowを行順に並べ、RowTypeが変わったタイミングでその行の型を表す行を挿入する */
export const toGridRows = (rowData: RowObject[]): GridRow[] => {
  const gridRows: GridRow[] = []
  for (let i = 0; i < rowData.length; i++) {
    const currentRow = rowData[i]
    const previousRow = i === 0 ? undefined : rowData[i - 1]

    // 行の型が変わったタイミングでRowTypeを表す行を挿入する
    if (previousRow === undefined || currentRow.type !== previousRow.type) {
      gridRows.push({
        type: 'rowType',
        rowTypeId: currentRow.type,
      })
    }

    gridRows.push({
      type: 'row',
      item: currentRow,
    })
  }
  return gridRows
}

// -----------------------------------------
/** 行範囲編集 */
export const useEditRowObject = (
  fields: UseFieldArrayReturnType['fields'],
  insert: UseFieldArrayReturnType['insert'],
  update: UseFieldArrayReturnType['update'],
  remove: UseFieldArrayReturnType['remove'],
) => {
  return useCallback((range: [number, number], editFunction: (rows: GridRowOfRowObject[]) => GridRowOfRowObject[]) => {
    // 指定範囲の行オブジェクトを編集
    const min = Math.max(Math.min(range[0], range[1]), 0)
    const max = Math.min(Math.max(range[0], range[1]), fields.length - 1)
    const sliced = fields.slice(min, max + 1)
    const onlyRowObject = sliced.filter(r => r.type === 'row') as GridRowOfRowObject[]
    const editedRowObjects = editFunction(onlyRowObject)

    // 指定範囲の1つ外側の行オブジェクトを含める
    const recalculateRange = editedRowObjects
    const above = getAboveRowObjectIndex(min, fields)
    const below = getBelowRowObjectIndex(max, fields)
    if (above !== undefined) recalculateRange.unshift(fields[above] as GridRowOfRowObject)
    if (below !== undefined) recalculateRange.push(fields[below] as GridRowOfRowObject)

    // 編集範囲に表の先頭の行型が含まれる場合
    const udpateFirstRowType = above === undefined

    // 行型を再計算
    const withRowType: GridRow[] = []
    for (let i = 0; i < recalculateRange.length; i++) {
      const currentRow = recalculateRange[i]

      // 行型が変化したタイミングで行型を表すデータを挿入する
      if (i >= 1) {
        const aboveRow = recalculateRange[i - 1]
        if (aboveRow.item.type !== currentRow.item.type) {
          withRowType.push({ type: 'rowType', rowTypeId: currentRow.item.type })
        }
      } else if (udpateFirstRowType) {
        withRowType.push({ type: 'rowType', rowTypeId: currentRow.item.type })
      }

      withRowType.push(currentRow)
    }

    // fieldsを更新
    const updateRangeStartIndex = above ?? 0
    const updateRangeEndIndex = below ?? fields.length - 1
    const itemCountBeforeUpdate = updateRangeEndIndex - updateRangeStartIndex + 1
    const itemCountAfterUpdate = withRowType.length
    const loopEnd = Math.max(itemCountBeforeUpdate, itemCountAfterUpdate)

    for (let i = 0; i < loopEnd; i++) {
      if (i >= itemCountBeforeUpdate) {
        insert(updateRangeStartIndex + i, withRowType.slice(i))
        break

      } else if (i >= itemCountAfterUpdate) {
        const removedIndexes = Array
          .from({ length: loopEnd - i })
          .map((_, j) => i + j + updateRangeStartIndex)
        remove(removedIndexes)
        break

      } else {
        update(updateRangeStartIndex + i, { ...withRowType[i] })
      }
    }
  }, [fields, insert, update, remove])
}

export type UseFieldArrayReturnType = ReturnType<typeof useFieldArray<PageFormState, 'gridRows'>>

export const getAboveRowObjectIndex = (currentIndex: number, all: GridRow[]): number | undefined => {
  while (currentIndex >= 0) {
    currentIndex--
    if (all[currentIndex]?.type === 'row') return currentIndex
  }
  return undefined
}
export const getBelowRowObjectIndex = (currentIndex: number, all: GridRow[]): number | undefined => {
  while (currentIndex <= all.length - 1) {
    currentIndex++
    if (all[currentIndex]?.type === 'row') return currentIndex
  }
  return undefined
}

export const moveArrayItem = <T>(arr: T[], { from, to }: { from: number, to: number }): T[] => {
  const clone = [...arr]
  const movedItem = clone.splice(from, 1)[0]
  clone.splice(to, 0, movedItem)
  return clone
}
// -----------------------------------------

export const createNewRowType = (name?: string, columnNames?: string[]): RowType => ({
  id: UUID.generate() as RowTypeId,
  name,
  columns: columnNames?.map(colName => ({
    id: UUID.generate() as ColumnId,
    name: colName
  })) ?? [],
  comments: [],
  existsInRemoteRepository: false,
  willBeChanged: true,
  willBeDeleted: false,
})

export const insertNewRow = (aboveRow: GridRow | undefined): { newRow: GridRowOfRowObject, newRowType: RowType | undefined } => {
  let newRowType: RowType | undefined = undefined
  let type: RowTypeId
  if (aboveRow?.type === 'row') {
    type = aboveRow.item.type

  } else if (aboveRow?.type === 'rowType') {
    type = aboveRow.rowTypeId

  } else {
    // 上の行が無い場合（グリッドが空の場合の新規作成など）は行型もこのタイミングで一緒に作成する
    newRowType = createNewRowType()
    type = newRowType.id
  }

  const newRow: GridRowOfRowObject = {
    type: 'row',
    item: {
      id: UUID.generate() as RowObjectId,
      text: '',
      type,
      attrs: {},
      indent: aboveRow?.type === 'row'
        ? aboveRow.item.indent
        : 0,
      createdOn: '', // どのみちサーバー側で自動設定されるので空文字で初期化する
      existsInRemoteRepository: false,
      willBeChanged: true,
      willBeDeleted: false,
      comments: [],
    },
  }

  return { newRow, newRowType }
}

/** 行の編集状態取得 */
export const getRowEditState = (gridRow: GridRow, rowTypeMap: Map<RowTypeId, RowType>): Util.LocalRepositoryState => {
  if (gridRow.type === 'row') {
    return Util.getLocalRepositoryState(gridRow.item)
  } else {
    const rowType = rowTypeMap.get(gridRow.rowTypeId)
    return rowType ? Util.getLocalRepositoryState(rowType) : ''
  }
}

/** ラベル列のセルの値取得 */
export const getLabelCellValue = (gridRow: GridRow, rowTypeMap: Map<RowTypeId, RowType>): string | undefined => {
  if (gridRow.type === 'row') {
    return gridRow.item.text
  } else {
    return rowTypeMap.get(gridRow.rowTypeId)?.name
  }
}

/** ラベル列のセルの値設定 */
export const setLabelCellValue = (gridRow: GridRow, rowTypeMap: Map<RowTypeId, RowType>, value: string | undefined): { updatedRowType?: RowType } => {
  if (gridRow.type === 'row') {
    gridRow.item.text = value ?? ''
  } else {
    const rowType = rowTypeMap.get(gridRow.rowTypeId)
    if (rowType) {
      rowType.name = value
      return { updatedRowType: rowType }
    }
  }
  return {}
}

/** Attr列のセルの値取得 */
export const getAttrCellValue = (gridRow: GridRow, rowTypeMap: Map<RowTypeId, RowType>, colIndex: number): string | undefined => {
  if (gridRow.type === 'row') {
    const rowType = rowTypeMap.get(gridRow.item.type)
    if (rowType === undefined) return undefined
    const colTypeId = rowType.columns[colIndex]?.id
    if (colTypeId === undefined) return undefined
    return gridRow.item.attrs[colTypeId]?.value

  } else {
    const rowType = rowTypeMap.get(gridRow.rowTypeId)
    if (rowType === undefined) return undefined
    return rowType.columns[colIndex]?.name
  }
}

/** Attr列のセルの値設定 */
export const setAttrCellValue = (
  gridRow: GridRow,
  rowTypeMap: Map<RowTypeId, RowType>,
  colIndex: number,
  value: string | undefined
): ({ updatedRowType?: RowType }) => {

  const rowTypeId = gridRow.type === 'row'
    ? gridRow.item.type
    : gridRow.rowTypeId
  const rowType = rowTypeMap.get(rowTypeId)
  if (rowType === undefined) throw new Error(`Row type not found: '${rowTypeId}'`)

  // その列の属性が存在しない場合は新規作成
  const columns = [...rowType.columns]
  let newColumnsAreCreated = false
  while (columns.length - 1 < colIndex) {
    columns.push({ id: UUID.generate() as ColumnId })
    newColumnsAreCreated = true
  }

  if (gridRow.type === 'row') {
    // 保存容量の削減のため、空文字の場合は属性自体を削除する
    const columnId = columns[colIndex].id
    if (value === undefined || value === '') {
      delete gridRow.item.attrs[columnId]
    } else {
      const currentValue = gridRow.item.attrs[columnId]
      gridRow.item.attrs[columnId] = {
        value,
        updatedOn: currentValue?.updatedOn ?? '',
        comments: [],
      }
    }

  } else {
    columns[colIndex].name = value
  }

  return newColumnsAreCreated || gridRow.type === 'rowType'
    ? { updatedRowType: { ...rowType, columns } }
    : {}
}

// -------------------------------------------
// コメント

const _commentIdSymbol: unique symbol = Symbol()
export type CommentId = string & { [_commentIdSymbol]: never }

export type Comment = EditableObject & {
  id: CommentId
  text: string
  author: string
  indent: number
  createdOn: string
  updatedOn: string
}

export const createNewComment = (author: string): Comment => {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return {
    id: UUID.generate() as CommentId,
    text: '',
    author,
    indent: 0,
    createdOn: now,
    updatedOn: now,
    existsInRemoteRepository: false,
    willBeChanged: true,
    willBeDeleted: false,
  }
}
