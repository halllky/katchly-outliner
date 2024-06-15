import React, { useCallback, useEffect, useMemo, useRef, useState, useReducer } from 'react'
import { Link } from 'react-router-dom'
import { useFieldArray, FormProvider } from 'react-hook-form'
import { BookmarkSquareIcon, PencilIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { UUID } from 'uuidjs'
import * as Util from '../../util'
import * as Input from '../../input'
import * as Layout from '../../collection'
import * as AggregateType from '../../autogenerated-types'

const VForm = Layout.VerticalForm

export default function () {
  return (
    <Util.MsgContextProvider>
      <Page />
    </Util.MsgContextProvider>
  )
}

const Page = () => {
  const [, dispatchMsg] = Util.useMsgContext()
  const [, dispatchToast] = Util.useToastContext()
  const { get } = Util.useHttpRequest()

  // 検索条件
  const [filter, setFilter] = useState<AggregateType.CommentSearchCondition>(() => AggregateType.createCommentSearchCondition())
  const [currentPage, dispatchPaging] = useReducer(pagingReducer, { pageIndex: 0 })

  const rhfSearchMethods = Util.useFormEx<AggregateType.CommentSearchCondition>({})
  const getConditionValues = rhfSearchMethods.getValues
  const registerExCondition = rhfSearchMethods.registerEx

  // 編集対象（リモートリポジトリ + ローカルリポジトリ）
  const editRange = useMemo(() => ({
    filter,
    skip: currentPage.pageIndex * 20,
    take: 20,
  }), [filter, currentPage])
  const { load, commit } = Util.useCommentRepository(editRange)

  const reactHookFormMethods = Util.useFormEx<{ currentPageItems: GridRow[] }>({})
  const { control, registerEx, handleSubmit, reset } = reactHookFormMethods
  const { fields, append, update, remove } = useFieldArray({ name: 'currentPageItems', control })

  // 画面表示時、再読み込み時
  useEffect(() => {
    load().then(currentPageItems => {
      if (currentPageItems) {
        reset({ currentPageItems })
      }
    })
  }, [load])

  const handleReload = useCallback(() => {
    setFilter(getConditionValues())
  }, [getConditionValues])

  // データ編集
  const handleAdd: React.MouseEventHandler<HTMLButtonElement> = useCallback(async () => {
    const newRow: AggregateType.CommentDisplayData = {
      localRepositoryItemKey: JSON.stringify(UUID.generate()) as Util.ItemKey,
      existsInRemoteRepository: false,
      willBeChanged: true,
      willBeDeleted: false,
      own_members: {
        ID: UUID.generate(),
      },
    }
    append(newRow)
  }, [append])

  const handleUpdateRow = useCallback(async (index: number, row: GridRow) => {
    update(index, { ...row, willBeChanged: true })
  }, [update])

  const dtRef = useRef<Layout.DataTableRef<GridRow>>(null)
  const handleRemove: React.MouseEventHandler<HTMLButtonElement> = useCallback(async () => {
    if (!dtRef.current) return
    for (const { row, rowIndex } of dtRef.current.getSelectedRows()) {
      update(rowIndex, { ...row, willBeDeleted: true })
    }
  }, [update])

  // データの一時保存
  const onSave = useCallback(async () => {
    await commit(...fields)
    const currentPageItems = await load()
    if (currentPageItems) reset({ currentPageItems })
  }, [commit, load, fields])

  // 列定義
  const columnDefs: Layout.ColumnDefEx<GridRow>[] = useMemo(() => [
    {
      id: 'col-header',
      header: '',
      cell: cellProps => {
        const row = cellProps.row.original
        const state = Util.getLocalRepositoryState(row)
        const singleViewUrl = Util.getCommentSingleViewUrl(row.localRepositoryItemKey, state === '+' ? 'new' : 'edit')
        return (
          <div className="flex items-center gap-1 pl-1">
            <Link to={singleViewUrl} className="text-link">詳細</Link>
            <span className="inline-block w-4 text-center">{state}</span>
          </div>
        )
      },
      size: 64,
      enableResizing: false,
    },
    {
      id: 'col1',
      header: 'Text',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.Text
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.Text,
      editSetting: {
        type: 'text',
        getTextValue: row => row.own_members?.Text,
        setTextValue: (row, value) => {
          row.own_members.Text = value
        },
      },
    },
    {
      id: 'col2',
      header: 'Author',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.Author
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.Author,
      editSetting: {
        type: 'text',
        getTextValue: row => row.own_members?.Author,
        setTextValue: (row, value) => {
          row.own_members.Author = value
        },
      },
    },
    {
      id: 'col3',
      header: 'Indent',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.Indent
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => {
        const value = row.own_members?.Indent
        const formatted = value?.toString()
        return formatted
      },
      editSetting: {
        type: 'text',
        getTextValue: row => {
          const value = row.own_members?.Indent
          const formatted = value?.toString()
          return formatted
        },
        setTextValue: (row, value) => {
          const { num: formatted } = Util.tryParseAsNumberOrEmpty(value)
          row.own_members.Indent = formatted
        },
      },
    },
    {
      id: 'col4',
      header: 'Order',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.Order
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => {
        const value = row.own_members?.Order
        const formatted = value?.toString()
        return formatted
      },
      editSetting: {
        type: 'text',
        getTextValue: row => {
          const value = row.own_members?.Order
          const formatted = value?.toString()
          return formatted
        },
        setTextValue: (row, value) => {
          const { num: formatted } = Util.tryParseAsNumberOrEmpty(value)
          row.own_members.Order = formatted
        },
      },
    },
    {
      id: 'col5',
      header: 'CreatedOn',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.CreatedOn
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.CreatedOn,
      editSetting: {
        type: 'text',
        getTextValue: row => row.own_members?.CreatedOn,
        setTextValue: (row, value) => {
          const { result: formatted } = Util.tryParseAsDateTimeOrEmpty(value)
          row.own_members.CreatedOn = formatted
        },
      },
    },
    {
      id: 'col6',
      header: 'UpdatedOn',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.UpdatedOn
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.UpdatedOn,
      editSetting: {
        type: 'text',
        getTextValue: row => row.own_members?.UpdatedOn,
        setTextValue: (row, value) => {
          const { result: formatted } = Util.tryParseAsDateTimeOrEmpty(value)
          row.own_members.UpdatedOn = formatted
        },
      },
    },
    {
      id: 'col7',
      header: 'TargetRow',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.TargetRow
        const formatted = `${value?.Text ?? ''}`
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {formatted}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.TargetRow,
      editSetting: ({
        type: 'async-combo',
        getValueFromRow: row => row.own_members?.TargetRow,
        setValueToRow: (row, value) => {
          row.own_members.TargetRow = value
        },
        comboProps: {
          queryKey: `combo-xc431ca892f0ec48c9bbc3311bb00c38c::`,
          query: async keyword => {
            const response = await get<AggregateType.RowRefInfo []>(`/api/Row/list-by-keyword`, { keyword })
            if (!response.ok) return []
            return response.data
          },
          emitValueSelector: item => item,
          matchingKeySelectorFromEmitValue: item => item.__instanceKey,
          matchingKeySelectorFromOption: item => item.__instanceKey,
          textSelector: item => `${item.Text ?? ''}`,
        },
      } as Layout.ColumnEditSetting<GridRow, AggregateType.RowRefInfo>) as Layout.ColumnEditSetting<GridRow, unknown>,
    },
    {
      id: 'col8',
      header: 'TargetCell',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.TargetCell
        const formatted = `${value?.Value ?? ''}`
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {formatted}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.TargetCell,
      editSetting: ({
        type: 'async-combo',
        getValueFromRow: row => row.own_members?.TargetCell,
        setValueToRow: (row, value) => {
          row.own_members.TargetCell = value
        },
        comboProps: {
          queryKey: `combo-x218859120e2951a46aa6ad9fb9e627cc::`,
          query: async keyword => {
            const response = await get<AggregateType.AttrsRefInfo []>(`/api/Row/list-by-keyword-x218859120e2951a46aa6ad9fb9e627cc`, { keyword })
            if (!response.ok) return []
            return response.data
          },
          emitValueSelector: item => item,
          matchingKeySelectorFromEmitValue: item => item.__instanceKey,
          matchingKeySelectorFromOption: item => item.__instanceKey,
          textSelector: item => `${item.Value ?? ''}`,
        },
      } as Layout.ColumnEditSetting<GridRow, AggregateType.AttrsRefInfo>) as Layout.ColumnEditSetting<GridRow, unknown>,
    },
    {
      id: 'col9',
      header: 'TargetRowType',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.TargetRowType
        const formatted = `${value?.ID ?? ''}`
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {formatted}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.TargetRowType,
      editSetting: ({
        type: 'async-combo',
        getValueFromRow: row => row.own_members?.TargetRowType,
        setValueToRow: (row, value) => {
          row.own_members.TargetRowType = value
        },
        comboProps: {
          queryKey: `combo-x482f568abd9568fda9b360b0bf991835::`,
          query: async keyword => {
            const response = await get<AggregateType.RowTypeRefInfo []>(`/api/RowType/list-by-keyword`, { keyword })
            if (!response.ok) return []
            return response.data
          },
          emitValueSelector: item => item,
          matchingKeySelectorFromEmitValue: item => item.__instanceKey,
          matchingKeySelectorFromOption: item => item.__instanceKey,
          textSelector: item => `${item.ID ?? ''}`,
        },
      } as Layout.ColumnEditSetting<GridRow, AggregateType.RowTypeRefInfo>) as Layout.ColumnEditSetting<GridRow, unknown>,
    },
    {
      id: 'col10',
      header: 'TargetColumn',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.TargetColumn
        const formatted = `${value?.Parent?.ID ?? ''}${value?.ColumnId ?? ''}`
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {formatted}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.TargetColumn,
      editSetting: ({
        type: 'async-combo',
        getValueFromRow: row => row.own_members?.TargetColumn,
        setValueToRow: (row, value) => {
          row.own_members.TargetColumn = value
        },
        comboProps: {
          queryKey: `combo-x4411d631bacb9f19ceba5b9461ffdee8::`,
          query: async keyword => {
            const response = await get<AggregateType.ColumnsRefInfo []>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, { keyword })
            if (!response.ok) return []
            return response.data
          },
          emitValueSelector: item => item,
          matchingKeySelectorFromEmitValue: item => item.__instanceKey,
          matchingKeySelectorFromOption: item => item.__instanceKey,
          textSelector: item => `${item.Parent?.ID ?? ''}${item.ColumnId ?? ''}`,
        },
      } as Layout.ColumnEditSetting<GridRow, AggregateType.ColumnsRefInfo>) as Layout.ColumnEditSetting<GridRow, unknown>,
    },
  ], [get, update])

  return (
    <div className="page-content-root gap-4">

      <FormProvider {...rhfSearchMethods}>
        <form className="flex flex-col gap-2">
          <div className="flex gap-2 justify-start">
            <h1 className="text-base font-semibold select-none py-1">
              Comment
            </h1>
            <Input.Button onClick={handleReload}>再読み込み</Input.Button>
            <div className="basis-4"></div>
            <Input.Button onClick={handleAdd}>追加</Input.Button>
            <Input.Button onClick={handleRemove}>削除</Input.Button>
            <Input.IconButton fill icon={BookmarkSquareIcon} onClick={onSave}>一時保存</Input.IconButton>
          </div>

          <Util.InlineMessageList />

          <VForm.Container leftColumnMinWidth="10rem">
            <VForm.Item label="Text">
              <Input.Description {...registerExCondition(`Text`)} />
            </VForm.Item>
            <VForm.Item label="Author">
              <Input.Word {...registerExCondition(`Author`)} />
            </VForm.Item>
            <VForm.Item label="Indent">
              <Input.Num {...registerExCondition(`Indent.From`)} />
              <span className="select-none">～</span>
              <Input.Num {...registerExCondition(`Indent.To`)} />
            </VForm.Item>
            <VForm.Item label="Order">
              <Input.Num {...registerExCondition(`Order.From`)} />
              <span className="select-none">～</span>
              <Input.Num {...registerExCondition(`Order.To`)} />
            </VForm.Item>
            <VForm.Item label="CreatedOn">
              <Input.Date {...registerExCondition(`CreatedOn.From`)} />
              <span className="select-none">～</span>
              <Input.Date {...registerExCondition(`CreatedOn.To`)} />
            </VForm.Item>
            <VForm.Item label="UpdatedOn">
              <Input.Date {...registerExCondition(`UpdatedOn.From`)} />
              <span className="select-none">～</span>
              <Input.Date {...registerExCondition(`UpdatedOn.To`)} />
            </VForm.Item>
            <VForm.Container label="Row">
              <VForm.Item label="Text">
                <Input.Description {...registerExCondition(`TargetRow.Text`)} />
              </VForm.Item>
              <VForm.Item label="Indent">
                <Input.Num {...registerExCondition(`TargetRow.Indent.From`)} />
                <span className="select-none">～</span>
                <Input.Num {...registerExCondition(`TargetRow.Indent.To`)} />
              </VForm.Item>
              <VForm.Item label="CreatedOn">
                <Input.Date {...registerExCondition(`TargetRow.CreatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetRow.CreatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="CreateUser">
                <Input.Word {...registerExCondition(`TargetRow.CreateUser`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`TargetRow.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetRow.UpdatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="UpdateUser">
                <Input.Word {...registerExCondition(`TargetRow.UpdateUser`)} />
              </VForm.Item>
              <VForm.Item label="Text">
                <Input.Description {...registerExCondition(`TargetCell.Parent.Text`)} />
              </VForm.Item>
              <VForm.Item label="Indent">
                <Input.Num {...registerExCondition(`TargetCell.Parent.Indent.From`)} />
                <span className="select-none">～</span>
                <Input.Num {...registerExCondition(`TargetCell.Parent.Indent.To`)} />
              </VForm.Item>
              <VForm.Item label="CreatedOn">
                <Input.Date {...registerExCondition(`TargetCell.Parent.CreatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetCell.Parent.CreatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="CreateUser">
                <Input.Word {...registerExCondition(`TargetCell.Parent.CreateUser`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`TargetCell.Parent.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetCell.Parent.UpdatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="UpdateUser">
                <Input.Word {...registerExCondition(`TargetCell.Parent.UpdateUser`)} />
              </VForm.Item>
            </VForm.Container>
            <VForm.Container label="RowType">
              <VForm.Item label="RowTypeName">
                <Input.Word {...registerExCondition(`TargetRow.RowType.RowTypeName`)} />
              </VForm.Item>
              <VForm.Item label="CreatedOn">
                <Input.Date {...registerExCondition(`TargetRow.RowType.CreatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetRow.RowType.CreatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="CreateUser">
                <Input.Word {...registerExCondition(`TargetRow.RowType.CreateUser`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`TargetRow.RowType.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetRow.RowType.UpdatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="UpdateUser">
                <Input.Word {...registerExCondition(`TargetRow.RowType.UpdateUser`)} />
              </VForm.Item>
              <VForm.Item label="RowTypeName">
                <Input.Word {...registerExCondition(`TargetCell.Parent.RowType.RowTypeName`)} />
              </VForm.Item>
              <VForm.Item label="CreatedOn">
                <Input.Date {...registerExCondition(`TargetCell.Parent.RowType.CreatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetCell.Parent.RowType.CreatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="CreateUser">
                <Input.Word {...registerExCondition(`TargetCell.Parent.RowType.CreateUser`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`TargetCell.Parent.RowType.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetCell.Parent.RowType.UpdatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="UpdateUser">
                <Input.Word {...registerExCondition(`TargetCell.Parent.RowType.UpdateUser`)} />
              </VForm.Item>
              <VForm.Item label="RowTypeName">
                <Input.Word {...registerExCondition(`TargetCell.ColType.Parent.RowTypeName`)} />
              </VForm.Item>
              <VForm.Item label="CreatedOn">
                <Input.Date {...registerExCondition(`TargetCell.ColType.Parent.CreatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetCell.ColType.Parent.CreatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="CreateUser">
                <Input.Word {...registerExCondition(`TargetCell.ColType.Parent.CreateUser`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`TargetCell.ColType.Parent.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetCell.ColType.Parent.UpdatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="UpdateUser">
                <Input.Word {...registerExCondition(`TargetCell.ColType.Parent.UpdateUser`)} />
              </VForm.Item>
              <VForm.Item label="RowTypeName">
                <Input.Word {...registerExCondition(`TargetRowType.RowTypeName`)} />
              </VForm.Item>
              <VForm.Item label="CreatedOn">
                <Input.Date {...registerExCondition(`TargetRowType.CreatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetRowType.CreatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="CreateUser">
                <Input.Word {...registerExCondition(`TargetRowType.CreateUser`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`TargetRowType.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetRowType.UpdatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="UpdateUser">
                <Input.Word {...registerExCondition(`TargetRowType.UpdateUser`)} />
              </VForm.Item>
              <VForm.Item label="RowTypeName">
                <Input.Word {...registerExCondition(`TargetColumn.Parent.RowTypeName`)} />
              </VForm.Item>
              <VForm.Item label="CreatedOn">
                <Input.Date {...registerExCondition(`TargetColumn.Parent.CreatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetColumn.Parent.CreatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="CreateUser">
                <Input.Word {...registerExCondition(`TargetColumn.Parent.CreateUser`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`TargetColumn.Parent.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetColumn.Parent.UpdatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="UpdateUser">
                <Input.Word {...registerExCondition(`TargetColumn.Parent.UpdateUser`)} />
              </VForm.Item>
            </VForm.Container>
            <VForm.Container label="Columns">
              <VForm.Item label="ColumnName">
                <Input.Word {...registerExCondition(`TargetCell.ColType.ColumnName`)} />
              </VForm.Item>
              <VForm.Item label="ColumnName">
                <Input.Word {...registerExCondition(`TargetColumn.ColumnName`)} />
              </VForm.Item>
            </VForm.Container>
            <VForm.Container label="Attrs">
              <VForm.Item label="Value">
                <Input.Description {...registerExCondition(`TargetCell.Value`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`TargetCell.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`TargetCell.UpdatedOn.To`)} />
              </VForm.Item>
            </VForm.Container>
          </VForm.Container>
        </form>
      </FormProvider>

      <FormProvider {...reactHookFormMethods}>
        <form className="flex-1">
          <Layout.DataTable
            data={fields}
            columns={columnDefs}
            onChangeRow={handleUpdateRow}
            ref={dtRef}
            className="h-full"
          ></Layout.DataTable>
        </form>
      </FormProvider>
    </div>
  )
}

type GridRow = AggregateType.CommentDisplayData

// TODO: utilに持っていく
type PageState = { pageIndex: number, loaded?: boolean }
const pagingReducer = Util.defineReducer((state: PageState) => ({
  loadComplete: () => ({ pageIndex: state.pageIndex, loaded: true }),
  nextPage: () => ({ pageIndex: state.pageIndex + 1, loaded: false }),
  prevPage: () => ({ pageIndex: Math.max(0, state.pageIndex - 1), loaded: false }),
  moveTo: (pageIndex: number) => ({ pageIndex, loaded: false }),
}))
