import { useCallback } from 'react'
import * as AggregateType from './__autoGenerated/autogenerated-types'
import * as Util from './__autoGenerated/util'
import { ColumnId, RowObject, RowObjectId, RowType, RowTypeId, createNewComment } from './Types'
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
    // Row
    const res1 = await post<AggregateType.RowDisplayData[]>(`/api/Row/load`, {})
    // TODO: コメント全件読み込み
    const rows: RowObject[] = []
    if (res1.ok) {
      const sorted = Array.from(res1.data)
      sorted.sort((a, b) => {
        const orderA = a.ref_from_Row_RowOrder?.own_members.Order ?? 0
        const orderB = b.ref_from_Row_RowOrder?.own_members.Order ?? 0
        return orderA - orderB
      })
      rows.push(...sorted.map(RowObjectConverter.fromServerApiType))
    }

    // RowType
    const res2 = await post<AggregateType.RowTypeDisplayData[]>(`/api/RowType/load`, {})
    const rowTypes = res2.ok ? Array.from(res2.data).map(RowTypeConverter.fromServerApiType) : []

    return { rows, rowTypes }
  }, [get, post, httpDelete])

  return { saveAll, loadAll }
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
        ColType: `["${rowObject.type}", "${colId}"]` as Util.ItemKey,
        Value: attr?.value,
        UpdatedOn: attr?.updatedOn,
      })),
    },
    {
      Row: `["${rowObject.id}"]` as Util.ItemKey,
      Order: order,
    }
  ],
  fromServerApiType: (displayData: AggregateType.RowDisplayData): RowObject => ({
    id: displayData.own_members.ID as RowObjectId,
    indent: displayData.own_members.Indent!,
    text: displayData.own_members.Text!,
    type: displayData.own_members.RowType!.ID as RowTypeId,
    attrs: displayData.child_Attrs?.reduce((prev, curr) => {
      const columnIdJson = JSON.parse(curr.own_members.ColType?.__instanceKey ?? '[,]') as [RowTypeId, ColumnId]
      prev[columnIdJson[1]] = {
        value: curr.own_members.Value ?? '',
        updatedOn: curr.own_members.UpdatedOn ?? '',
        threads: [],
      }
      return prev
    }, {} as RowObject['attrs']) ?? {},
    threads: (() => {
      return Array.from({ length: 3 }, (k, i) => i).map(_ => {
        const thread = createNewComment('1さんaaaaaaaaaaa')
        thread.text = 'これは1さんの発言です。'
        const res = createNewComment('2さん')
        res.text = `これは2さんの発言 ${res.id} ｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗ`
        thread.responses = [...thread.responses, res]
        return thread
      })
    })(), // TODO
    createdOn: displayData.own_members.CreatedOn ?? '',
    existsInRemoteRepository: true,
    willBeChanged: false,
    willBeDeleted: false,
  }),
}

/** 行型データとサーバーAPIの型との変換 */
const RowTypeConverter = {
  toServerApiType: (rowType: RowType): [Util.LocalRepositoryState, AggregateType.RowTypeSaveCommand] => [
    Util.getLocalRepositoryState(rowType),
    {
      ID: rowType.id,
      RowTypeName: rowType.name,
      Columns: rowType.columns.map(col => ({
        ColumnId: col.id,
        ColumnName: col.name,
      })),
    }
  ],
  fromServerApiType: (displayData: AggregateType.RowTypeDisplayData): RowType => ({
    id: displayData.own_members.ID as RowTypeId,
    name: displayData.own_members.RowTypeName,
    columns: displayData.child_Columns?.map<RowType['columns']['0']>(col => ({
      id: col.own_members.ColumnId as ColumnId,
      name: col.own_members.ColumnName,
    })) ?? [],
    threads: [], // TODO
    existsInRemoteRepository: true,
    willBeChanged: false,
    willBeDeleted: false,
  }),
}
