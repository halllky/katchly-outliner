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
  const [filter, setFilter] = useState<AggregateType.RowSearchCondition>(() => AggregateType.createRowSearchCondition())
  const [currentPage, dispatchPaging] = useReducer(pagingReducer, { pageIndex: 0 })

  const rhfSearchMethods = Util.useFormEx<AggregateType.RowSearchCondition>({})
  const getConditionValues = rhfSearchMethods.getValues
  const registerExCondition = rhfSearchMethods.registerEx

  // 編集対象（リモートリポジトリ + ローカルリポジトリ）
  const editRange = useMemo(() => ({
    filter,
    skip: currentPage.pageIndex * 20,
    take: 20,
  }), [filter, currentPage])
  const { load, commit } = Util.useRowRepository(editRange)

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
    const newRow: AggregateType.RowDisplayData = {
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
        const singleViewUrl = Util.getRowSingleViewUrl(row.localRepositoryItemKey, state === '+' ? 'new' : 'edit')
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
      header: 'RowType',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.RowType
        const formatted = `${value?.ID ?? ''}`
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {formatted}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.RowType,
      editSetting: (() => {
        const asyncComboSetting: Layout.ColumnEditSetting<GridRow, AggregateType.RowTypeRefInfo> = {
          type: 'async-combo',
          getValueFromRow: row => row.own_members?.RowType,
          setValueToRow: (row, value) => {
            row.own_members.RowType = value
          },
          onClipboardCopy: row => {
            const formatted = row.own_members?.RowType ? JSON.stringify(row.own_members?.RowType) : ''
            return formatted
          },
          onClipboardPaste: (row, value) => {
            if (row.own_members === undefined) return
            let formatted: AggregateType.RowTypeRefInfo | undefined
            if (value) {
              try {
                const obj: AggregateType.RowTypeRefInfo = JSON.parse(value)
                // 登録にはインスタンスキーが使われるのでキーの型だけは細かくチェックする
                if (obj.__instanceKey === undefined) throw new Error
                const arrInstanceKey: [string] = JSON.parse(obj.__instanceKey)
                if (!Array.isArray(arrInstanceKey)) throw new Error
                if (typeof arrInstanceKey[0] !== 'string') throw new Error
                formatted = obj
              } catch {
                formatted = undefined
              }
            } else {
              formatted = undefined
            }
            row.own_members.RowType = formatted
          },
          comboProps: {
            queryKey: `combo-x482f568abd9568fda9b360b0bf991835::`,
            query: async keyword => {
              const response = await get<AggregateType.RowTypeRefInfo[]>(`/api/RowType/list-by-keyword`, { keyword })
              if (!response.ok) return []
              return response.data
            },
            emitValueSelector: item => item,
            matchingKeySelectorFromEmitValue: item => item.__instanceKey,
            matchingKeySelectorFromOption: item => item.__instanceKey,
            textSelector: item => `${item.ID ?? ''}`,
          },
        }
        return asyncComboSetting as Layout.ColumnEditSetting<GridRow, unknown>
      })(),
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
      id: 'col5',
      header: 'CreateUser',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.CreateUser
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.CreateUser,
      editSetting: {
        type: 'text',
        getTextValue: row => row.own_members?.CreateUser,
        setTextValue: (row, value) => {
          row.own_members.CreateUser = value
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
      header: 'UpdateUser',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.UpdateUser
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.UpdateUser,
      editSetting: {
        type: 'text',
        getTextValue: row => row.own_members?.UpdateUser,
        setTextValue: (row, value) => {
          row.own_members.UpdateUser = value
        },
      },
    },
    {
      id: 'ref-from-ref_from_Row_RowOrder',
      header: '',
      cell: ({ row }) => {
      
        const createRowOrder = useCallback(() => {
          if (row.original) {
            row.original.ref_from_Row_RowOrder = {
              localRepositoryItemKey: JSON.stringify(UUID.generate()) as Util.ItemKey,
              existsInRemoteRepository: false,
              willBeChanged: true,
              willBeDeleted: false,
              own_members: {
                Row: {
                  __instanceKey: row.original.localRepositoryItemKey,
                },
              },
            }
            update(row.index, { ...row.original })
          }
        }, [row.index])
      
        const deleteRowOrder = useCallback(() => {
          if (row.original.ref_from_Row_RowOrder) {
            row.original.ref_from_Row_RowOrder.willBeDeleted = true
            update(row.index, { ...row.original })
          }
        }, [row.index])
      
        const RowOrder = row.original.ref_from_Row_RowOrder
      
        return <>
          {(RowOrder === undefined || RowOrder.willBeDeleted) && (
            <Input.Button icon={PlusIcon} onClick={createRowOrder}>作成</Input.Button>
          )}
          {(RowOrder !== undefined && !RowOrder.willBeDeleted) && (
            <Input.Button icon={XMarkIcon} onClick={deleteRowOrder}>削除</Input.Button>
          )}
        </>
      },
      headerGroupName: 'RowOrder',
    },
    {
      id: 'col8',
      header: 'Order',
      cell: cellProps => {
        const value = cellProps.row.original.ref_from_Row_RowOrder?.own_members?.Order
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => {
        const value = row.ref_from_Row_RowOrder?.own_members?.Order
        const formatted = value?.toString()
        return formatted
      },
      headerGroupName: 'RowOrder',
      editSetting: {
        type: 'text',
        getTextValue: row => {
          const value = row.ref_from_Row_RowOrder?.own_members?.Order
          const formatted = value?.toString()
          return formatted
        },
        setTextValue: (row, value) => {
          if (row.ref_from_Row_RowOrder) {
            const { num: formatted } = Util.tryParseAsNumberOrEmpty(value)
            row.ref_from_Row_RowOrder.own_members.Order = formatted
            row.ref_from_Row_RowOrder.willBeChanged = true
          }
        },
      },
    },
  ], [get, update])

  return (
    <div className="page-content-root gap-4">

      <FormProvider {...rhfSearchMethods}>
        <form className="flex flex-col gap-2">
          <div className="flex gap-2 justify-start">
            <h1 className="text-base font-semibold select-none py-1">
              Row
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
            <VForm.Item label="Indent">
              <Input.Num {...registerExCondition(`Indent.From`)} />
              <span className="select-none">～</span>
              <Input.Num {...registerExCondition(`Indent.To`)} />
            </VForm.Item>
            <VForm.Item label="CreatedOn">
              <Input.Date {...registerExCondition(`CreatedOn.From`)} />
              <span className="select-none">～</span>
              <Input.Date {...registerExCondition(`CreatedOn.To`)} />
            </VForm.Item>
            <VForm.Item label="CreateUser">
              <Input.Word {...registerExCondition(`CreateUser`)} />
            </VForm.Item>
            <VForm.Item label="UpdatedOn">
              <Input.Date {...registerExCondition(`UpdatedOn.From`)} />
              <span className="select-none">～</span>
              <Input.Date {...registerExCondition(`UpdatedOn.To`)} />
            </VForm.Item>
            <VForm.Item label="UpdateUser">
              <Input.Word {...registerExCondition(`UpdateUser`)} />
            </VForm.Item>
            <VForm.Container label="RowType">
              <VForm.Item label="RowTypeName">
                <Input.Word {...registerExCondition(`RowType.RowTypeName`)} />
              </VForm.Item>
              <VForm.Item label="CreatedOn">
                <Input.Date {...registerExCondition(`RowType.CreatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`RowType.CreatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="CreateUser">
                <Input.Word {...registerExCondition(`RowType.CreateUser`)} />
              </VForm.Item>
              <VForm.Item label="UpdatedOn">
                <Input.Date {...registerExCondition(`RowType.UpdatedOn.From`)} />
                <span className="select-none">～</span>
                <Input.Date {...registerExCondition(`RowType.UpdatedOn.To`)} />
              </VForm.Item>
              <VForm.Item label="UpdateUser">
                <Input.Word {...registerExCondition(`RowType.UpdateUser`)} />
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

type GridRow = AggregateType.RowDisplayData

// TODO: utilに持っていく
type PageState = { pageIndex: number, loaded?: boolean }
const pagingReducer = Util.defineReducer((state: PageState) => ({
  loadComplete: () => ({ pageIndex: state.pageIndex, loaded: true }),
  nextPage: () => ({ pageIndex: state.pageIndex + 1, loaded: false }),
  prevPage: () => ({ pageIndex: Math.max(0, state.pageIndex - 1), loaded: false }),
  moveTo: (pageIndex: number) => ({ pageIndex, loaded: false }),
}))
