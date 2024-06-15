import { useCallback } from 'react'
import * as AggregateType from './__autoGenerated/autogenerated-types'
import * as Util from './__autoGenerated/util'
import { ColumnId, Comment, CommentId, RowObject, RowObjectId, RowType, RowTypeId, createNewComment } from './Types'
import { useAppSettings } from './AppSettings'

export const useKatchlyRepository = () => {
  const { get, post, httpDelete } = Util.useHttpRequest()
  const { data: { userName } } = useAppSettings()

  /** 保存 */
  const saveAll = useCallback(async ({ rows, rowTypes }: { rows: RowObject[], rowTypes: RowType[] }): Promise<void> => {
    // サーバーAPI型に変換する
    const rowObjectSaveCommands = rows.map((rowObject, ix) => {
      const [state, row, rowOrder] = RowObjectConverter.toServerApiType(rowObject, ix)
      return { state, row, rowOrder }
    })
    const rowTypeSaveCommands = rowTypes.map(rowTypeClient => {
      const [state, rowType] = RowTypeConverter.toServerApiType(rowTypeClient)
      return { state, rowType }
    })
    const commentSaveCommands = [
      ...rows.flatMap(CommentConverter.toServerApiTypeFromRow),
      ...rowTypes.flatMap(CommentConverter.toServerApiTypeFromRowType),
    ]

    // 依存関係に注意しつつデータ1件ずつサーバーAPIを呼ぶ
    // RowType: create, update
    for (const { state, rowType } of rowTypeSaveCommands.filter(x => x.state === '+' || x.state === '*')) {
      if (state === '+') {
        rowType.CreateUser = userName
        rowType.UpdateUser = userName
        await post<AggregateType.RowTypeDisplayData>(`/api/RowType/create`, rowType)

      } else if (state === '*') {
        rowType.UpdateUser = userName
        await post<AggregateType.RowTypeDisplayData>(`/api/RowType/update`, rowType)
      }
    }
    // Row: create, update
    for (const { state, row, rowOrder } of rowObjectSaveCommands.filter(x => x.state === '+' || x.state === '*')) {
      if (state === '+') {
        row.CreateUser = userName
        row.UpdateUser = userName
        await post<AggregateType.RowDisplayData>(`/api/Row/create`, row)
        await post<AggregateType.RowOrderDisplayData>(`/api/RowOrder/create`, rowOrder)

      } else if (state === '*') {
        row.UpdateUser = userName
        await post<AggregateType.RowDisplayData>(`/api/Row/update`, row)
        await post<AggregateType.RowOrderDisplayData>(`/api/RowOrder/update`, rowOrder)
      }
    }
    // Comment: create, update
    for (const [state, comment] of commentSaveCommands) {
      if (state === '+') {
        // AuthorはReactコンポーネント中で指定済みのためここでは何もしない
        await post<AggregateType.CommentDisplayData>(`/api/Comment/create`, comment)
      } else if (state === '*') {
        await post<AggregateType.CommentDisplayData>(`/api/Comment/update`, comment)
      }
    }
    // Comment: delete
    for (const [, comment] of commentSaveCommands.filter(([state,]) => state === '-')) {
      await httpDelete(`/api/Comment/delete`, comment)
    }
    // Row: delete
    for (const { row, rowOrder } of rowObjectSaveCommands.filter(x => x.state === '-')) {
      await httpDelete(`/api/RowOrder/delete`, rowOrder)
      await httpDelete(`/api/Row/delete`, row)
    }
    // RowType: delete
    for (const { rowType } of rowTypeSaveCommands.filter(x => x.state === '-')) {
      await httpDelete(`/api/RowType/delete`, rowType)
    }
  }, [get, post, httpDelete, userName])

  /** 読み込み */
  const loadAll = useCallback(async (): Promise<{ rows: RowObject[], rowTypes: RowType[] }> => {
    // Comment
    const res1 = await post<AggregateType.CommentDisplayData[]>(`/api/Comment/load`, {})
    const cache: LoadedCommentsCache = { toRowType: new Map(), toRow: new Map(), toCol: new Map(), toCell: new Map() }
    if (res1.ok) {
      for (const commentApiResponse of res1.data) {
        if (commentApiResponse.own_members.TargetRowType?.ID) {
          const rowTypeId = commentApiResponse.own_members.TargetRowType.ID as RowTypeId
          let arr = cache.toRowType.get(rowTypeId)
          if (!arr) { arr = []; cache.toRowType.set(rowTypeId, arr) }
          arr.push(commentApiResponse)

        } else if (commentApiResponse.own_members.TargetRow?.ID) {
          const rowId = commentApiResponse.own_members.TargetRow.ID as RowObjectId
          let arr = cache.toRow.get(rowId)
          if (!arr) { arr = []; cache.toRow.set(rowId, arr) }
          arr.push(commentApiResponse)

        } else if (commentApiResponse.own_members.TargetColumn?.ColumnId) {
          const columnId = commentApiResponse.own_members.TargetColumn.ColumnId as ColumnId
          let arr = cache.toCol.get(columnId)
          if (!arr) { arr = []; cache.toCol.set(columnId, arr) }
          arr.push(commentApiResponse)

        } else if (commentApiResponse.own_members.TargetCell) {
          const rowId = commentApiResponse.own_members.TargetCell.Parent?.ID as RowObjectId
          const colId = commentApiResponse.own_members.TargetCell.ColType?.ColumnId as ColumnId
          const map = cache.toCell.get(rowId)
          if (!map) {
            cache.toCell.set(rowId, new Map([[colId, [commentApiResponse]]]))
          } else {
            let arr = map.get(colId)
            if (!arr) { arr = []; cache.toCol.set(colId, arr) }
            arr.push(commentApiResponse)
          }
        }
      }
    }

    // Row
    const res2 = await post<AggregateType.RowDisplayData[]>(`/api/Row/load`, {})
    const rows: RowObject[] = []
    if (res2.ok) {
      const sorted = Array.from(res2.data)
      sorted.sort((a, b) => {
        const orderA = a.ref_from_Row_RowOrder?.own_members.Order ?? 0
        const orderB = b.ref_from_Row_RowOrder?.own_members.Order ?? 0
        return orderA - orderB
      })
      rows.push(...sorted.map(row => RowObjectConverter.fromServerApiType(row, cache)))
    }

    // RowType
    const res3 = await post<AggregateType.RowTypeDisplayData[]>(`/api/RowType/load`, {})
    const rowTypes = res3.ok ? Array.from(res3.data).map(rowType => RowTypeConverter.fromServerApiType(rowType, cache)) : []

    return { rows, rowTypes }
  }, [get, post, httpDelete])

  return { saveAll, loadAll }
}

type LoadedCommentsCache = {
  toRowType: Map<RowTypeId, AggregateType.CommentDisplayData[]>
  toRow: Map<RowObjectId, AggregateType.CommentDisplayData[]>
  toCol: Map<ColumnId, AggregateType.CommentDisplayData[]>
  toCell: Map<RowObjectId, Map<ColumnId, AggregateType.CommentDisplayData[]>>
}

/** 行データとサーバーAPIの型との変換 */
const RowObjectConverter = {
  toServerApiType: (rowObject: RowObject, order: number): [Util.LocalRepositoryState, AggregateType.RowSaveCommand, AggregateType.RowOrderSaveCommand] => [
    Util.getLocalRepositoryState(rowObject),
    {
      ID: rowObject.id,
      Text: rowObject.text,
      Indent: rowObject.indent,
      RowType: `["${rowObject.type}"]` as Util.ItemKey,
      Attrs: Object.entries(rowObject.attrs).map<AggregateType.AttrsSaveCommand>(([colId, attr]) => ({
        ColType: colId as Util.ItemKey,
        Value: attr?.value,
        UpdatedOn: attr?.updatedOn,
      })),
    },
    {
      Row: `["${rowObject.id}"]` as Util.ItemKey,
      Order: order,
    }
  ],
  fromServerApiType: (displayData: AggregateType.RowDisplayData, loadedComments: LoadedCommentsCache): RowObject => {
    const commentsToCell = loadedComments.toCell.get(displayData.own_members.ID as RowObjectId)
    return {
      id: displayData.own_members.ID as RowObjectId,
      indent: displayData.own_members.Indent!,
      text: displayData.own_members.Text!,
      type: displayData.own_members.RowType!.ID as RowTypeId,
      attrs: displayData.child_Attrs?.reduce((result, attr) => {
        const columnId = attr.own_members.ColType?.__instanceKey as string as ColumnId
        result[columnId] = {
          value: attr.own_members.Value ?? '',
          updatedOn: attr.own_members.UpdatedOn ?? '',
          comments: CommentConverter.fromServerApiType(commentsToCell?.get(columnId)),
        }
        return result
      }, {} as RowObject['attrs']) ?? {},
      comments: CommentConverter.fromServerApiType(loadedComments.toRow.get(displayData.own_members.ID as RowObjectId)),
      createdOn: displayData.own_members.CreatedOn ?? '',
      existsInRemoteRepository: true,
      willBeChanged: false,
      willBeDeleted: false,
    }
  },
}

/** 行型データとサーバーAPIの型との変換 */
const RowTypeConverter = {
  toServerApiType: (rowType: RowType): [Util.LocalRepositoryState, AggregateType.RowTypeSaveCommand] => [
    Util.getLocalRepositoryState(rowType),
    {
      ID: rowType.id,
      RowTypeName: rowType.name,
      Columns: rowType.columns.map(col => ({
        ColumnId: (JSON.parse(col.id) as [RowTypeId, string])[1],
        ColumnName: col.name,
      })),
    }
  ],
  fromServerApiType: (displayData: AggregateType.RowTypeDisplayData, loadedComments: LoadedCommentsCache): RowType => ({
    id: displayData.own_members.ID as RowTypeId,
    name: displayData.own_members.RowTypeName,
    columns: displayData.child_Columns?.map<RowType['columns']['0']>(col => ({
      id: col.localRepositoryItemKey as string as ColumnId,
      name: col.own_members.ColumnName,
      comments: CommentConverter.fromServerApiType(loadedComments.toCol.get(col.own_members.ColumnId as ColumnId)),
    })) ?? [],
    comments: CommentConverter.fromServerApiType(loadedComments.toRowType.get(displayData.own_members.ID as RowTypeId)),
    existsInRemoteRepository: true,
    willBeChanged: false,
    willBeDeleted: false,
  }),
}

/** コメントデータとサーバーAPIの型との変換 */
const CommentConverter = {
  toServerApiTypeWithoutTarget: (comment: Comment, order: number): AggregateType.CommentSaveCommand => ({
    ID: comment.id,
    Text: comment.text,
    Author: comment.author,
    Indent: comment.indent,
    Order: order,
    CreatedOn: comment.createdOn,
    UpdatedOn: comment.updatedOn,
  }),
  toServerApiTypeFromRow: (rowObject: RowObject): [Util.LocalRepositoryState, AggregateType.CommentSaveCommand][] => {
    const result: [Util.LocalRepositoryState, AggregateType.CommentSaveCommand][] = []
    // Rowへのコメント
    for (let i = 0; i < rowObject.comments.length; i++) {
      const comment = rowObject.comments[i]
      const apiType = CommentConverter.toServerApiTypeWithoutTarget(comment, i)
      apiType.TargetRow = JSON.stringify([rowObject.id]) as Util.ItemKey
      result.push([Util.getLocalRepositoryState(comment), apiType])
    }
    // Cellへのコメント
    for (const [key, { comments }] of Object.entries(rowObject.attrs)) {
      const [rowTypeId, columnId] = JSON.parse(key) as [RowTypeId, ColumnId]
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i]
        const apiType = CommentConverter.toServerApiTypeWithoutTarget(comment, i)
        apiType.TargetCell = JSON.stringify([rowObject.id, rowTypeId, columnId]) as Util.ItemKey
        result.push([Util.getLocalRepositoryState(comment), apiType])
      }
    }
    return result
  },
  toServerApiTypeFromRowType: (rowType: RowType): [Util.LocalRepositoryState, AggregateType.CommentSaveCommand][] => {
    const result: [Util.LocalRepositoryState, AggregateType.CommentSaveCommand][] = []
    // RowTypeへのコメント
    for (let i = 0; i < rowType.comments.length; i++) {
      const comment = rowType.comments[i]
      const apiType = CommentConverter.toServerApiTypeWithoutTarget(comment, i)
      apiType.TargetRowType = JSON.stringify([rowType.id]) as Util.ItemKey
      result.push([Util.getLocalRepositoryState(comment), apiType])
    }
    // Columnへのコメント
    for (const column of rowType.columns) {
      for (let i = 0; i < column.comments.length; i++) {
        const comment = column.comments[i]
        const apiType = CommentConverter.toServerApiTypeWithoutTarget(comment, i)
        apiType.TargetColumn = column.id as string as Util.ItemKey
        result.push([Util.getLocalRepositoryState(comment), apiType])
      }
    }
    return result
  },
  fromServerApiType: (arr: AggregateType.CommentDisplayData[] | undefined): Comment[] => {
    if (!arr) return []
    const sorted = orderBy(arr, c => c.own_members.Order ?? 0)
    return sorted.map(displayData => ({
      id: displayData.own_members.ID as CommentId,
      text: displayData.own_members.Text ?? '',
      author: displayData.own_members.Author ?? '',
      createdOn: displayData.own_members.CreatedOn ?? '',
      updatedOn: displayData.own_members.UpdatedOn ?? '',
      indent: displayData.own_members.Indent ?? 0,
      existsInRemoteRepository: true,
      willBeChanged: false,
      willBeDeleted: false,
    }))
  },
}

// ---------------------------------
const orderBy = <T, TValue extends string | number>(arr: T[], selector: (item: T) => TValue) => {
  const newArray = [...arr]
  newArray.sort((a, b) => {
    const valueA = selector(a)
    const valueB = selector(b)
    if (valueA < valueB) return -1
    if (valueA > valueB) return 1
    return 0
  })
  return newArray
}
