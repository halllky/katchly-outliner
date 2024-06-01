import { UUID } from 'uuidjs'
import * as Util from './__autoGenerated/util'

const _rowObjectIdSymbol: unique symbol = Symbol()
const _rowTypeIdSymbol: unique symbol = Symbol()
const _ColumnIdSymbol: unique symbol = Symbol()
export type RowObjectId = string & { [_rowObjectIdSymbol]: never }
export type RowTypeId = string & { [_rowTypeIdSymbol]: never }
export type ColumnId = string & { [_ColumnIdSymbol]: never }

export type RowObject = {
  id: RowObjectId
  parent?: RowObjectId
  text: string
  type: RowTypeId
  attrs: { [key: ColumnId]: string }
}
export type RowType = {
  id: RowTypeId
  name?: string
  columns: { id: ColumnId, name?: string }[]
}

// --------------------------------------

export type GridRow = {
  type: 'row'
  indent: number
  item: RowObject
} | {
  type: 'rowType'
  indent: number
  rowTypeId: RowTypeId
}

/** Rowを行順に並べ、RowTypeが変わったタイミングでその行の型を表す行を挿入する */
export const toGridRows = (rowData: RowObject[]): GridRow[] => {
  // orderを記憶
  const rowOrder = new Map(rowData.map((row, i) => [row.id, i]))

  // インデント計算のためにツリー構造にする
  const tree = Util.toTree(rowData, {
    getId: row => row.id,
    getParent: row => row.parent,
  })
  const flattenTree = Util.flatten(tree)

  // GridRowを組み立てる
  const gridRows: GridRow[] = []
  for (let i = 0; i < flattenTree.length; i++) {
    const currentRow = flattenTree[i]
    const previousRow = i === 0 ? undefined : flattenTree[i - 1]

    // RowTypeを表す行を挿入する
    if (previousRow === undefined || currentRow.item.type !== previousRow.item.type) {
      gridRows.push({
        type: 'rowType',
        indent: currentRow.depth,
        rowTypeId: currentRow.item.type,
      })
    }

    // Rowを挿入する
    gridRows.push({
      type: 'row',
      indent: currentRow.depth,
      item: currentRow.item,
    })
  }
  return gridRows
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
    return gridRow.item.attrs[colTypeId]

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
      gridRow.item.attrs[columnId] = value
    }

  } else {
    columns[colIndex].name = value
  }

  return newColumnsAreCreated || gridRow.type === 'rowType'
    ? { updatedRowType: { ...rowType, columns } }
    : {}
}
