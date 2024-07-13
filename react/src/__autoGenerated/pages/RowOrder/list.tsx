import React, { useCallback, useEffect, useMemo, useRef, useState, useReducer } from 'react'
import { Link } from 'react-router-dom'
import { useFieldArray, FormProvider } from 'react-hook-form'
import { BookmarkSquareIcon, PencilIcon, XMarkIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
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
  const [filter, setFilter] = useState<AggregateType.RowOrderSearchCondition>(() => AggregateType.createRowOrderSearchCondition())
  const [currentPage, dispatchPaging] = useReducer(pagingReducer, { pageIndex: 0 })
  const searchConditionPanelRef = useRef<ImperativePanelHandle>(null)
  const [collapsed, setCollapsed] = useState(false)

  const rhfSearchMethods = Util.useFormEx<AggregateType.RowOrderSearchCondition>({})
  const {
    getValues: getConditionValues,
    registerEx: registerExCondition,
    reset: resetSearchCondition,
  } = rhfSearchMethods
  const clearSearchCondition = useCallback(() => {
    resetSearchCondition()
    searchConditionPanelRef.current?.expand()
  }, [resetSearchCondition, searchConditionPanelRef])
  const toggleSearchCondition = useCallback(() => {
    if (searchConditionPanelRef.current?.getCollapsed()) {
      searchConditionPanelRef.current.expand()
    } else {
      searchConditionPanelRef.current?.collapse()
    }
  }, [searchConditionPanelRef])

  // 編集対象（リモートリポジトリ + ローカルリポジトリ）
  const editRange = useMemo(() => ({
    filter,
    skip: currentPage.pageIndex * 20,
    take: 20,
  }), [filter, currentPage])
  const { load, commit } = Util.useRowOrderRepository(editRange)

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
    searchConditionPanelRef.current?.collapse()
  }, [getConditionValues, searchConditionPanelRef])

  // データ編集
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
        const singleViewUrl = Util.getRowOrderSingleViewUrl(row.localRepositoryItemKey, state === '+' ? 'new' : 'edit')
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
  ], [get, update])

  return (
    <div className="page-content-root">

      <div className="flex gap-4 p-1">
        <div className="flex gap-4 flex-wrap">
          <Util.SideMenuCollapseButton />
          <h1 className="self-center text-base font-semibold whitespace-nowrap select-none">
            RowOrder
          </h1>
          <Input.IconButton className="self-center" onClick={handleRemove}>削除</Input.IconButton>
          <Input.IconButton className="self-center" onClick={onSave}>一時保存</Input.IconButton>
        </div>
        <div className="flex-1"></div>
        <Input.IconButton className="self-center" onClick={clearSearchCondition}>クリア</Input.IconButton>
        <div className="self-center flex">
          <Input.IconButton icon={MagnifyingGlassIcon} fill onClick={handleReload}>検索</Input.IconButton>
          <div className="self-stretch w-px bg-color-base"></div>
          <Input.IconButton icon={collapsed ? ChevronDownIcon : ChevronUpIcon} fill onClick={toggleSearchCondition} hideText>検索条件</Input.IconButton>
        </div>
      </div>

      <PanelGroup direction="vertical">
        <Panel ref={searchConditionPanelRef} defaultSize={30} collapsible onCollapse={setCollapsed}>
          <div className="h-full overflow-auto">
            <FormProvider {...rhfSearchMethods}>
              <VForm.Container estimatedLabelWidth="10rem" className="p-1">
                <VForm.Item label="Order">
                  <Input.Num {...registerExCondition(`Order.From`)} />
                  <span className="select-none">～</span>
                  <Input.Num {...registerExCondition(`Order.To`)} />
                </VForm.Item>
                <VForm.Container label="Row">
                  <VForm.Item label="Text">
                    <Input.Description {...registerExCondition(`Row.Text`)} />
                  </VForm.Item>
                  <VForm.Item label="Indent">
                    <Input.Num {...registerExCondition(`Row.Indent.From`)} />
                    <span className="select-none">～</span>
                    <Input.Num {...registerExCondition(`Row.Indent.To`)} />
                  </VForm.Item>
                  <VForm.Item label="CreatedOn">
                    <Input.Date {...registerExCondition(`Row.CreatedOn.From`)} />
                    <span className="select-none">～</span>
                    <Input.Date {...registerExCondition(`Row.CreatedOn.To`)} />
                  </VForm.Item>
                  <VForm.Item label="CreateUser">
                    <Input.Word {...registerExCondition(`Row.CreateUser`)} />
                  </VForm.Item>
                  <VForm.Item label="UpdatedOn">
                    <Input.Date {...registerExCondition(`Row.UpdatedOn.From`)} />
                    <span className="select-none">～</span>
                    <Input.Date {...registerExCondition(`Row.UpdatedOn.To`)} />
                  </VForm.Item>
                  <VForm.Item label="UpdateUser">
                    <Input.Word {...registerExCondition(`Row.UpdateUser`)} />
                  </VForm.Item>
                </VForm.Container>
                <VForm.Container label="RowType">
                  <VForm.Item label="RowTypeName">
                    <Input.Word {...registerExCondition(`Row.RowType.RowTypeName`)} />
                  </VForm.Item>
                  <VForm.Item label="CreatedOn">
                    <Input.Date {...registerExCondition(`Row.RowType.CreatedOn.From`)} />
                    <span className="select-none">～</span>
                    <Input.Date {...registerExCondition(`Row.RowType.CreatedOn.To`)} />
                  </VForm.Item>
                  <VForm.Item label="CreateUser">
                    <Input.Word {...registerExCondition(`Row.RowType.CreateUser`)} />
                  </VForm.Item>
                  <VForm.Item label="UpdatedOn">
                    <Input.Date {...registerExCondition(`Row.RowType.UpdatedOn.From`)} />
                    <span className="select-none">～</span>
                    <Input.Date {...registerExCondition(`Row.RowType.UpdatedOn.To`)} />
                  </VForm.Item>
                  <VForm.Item label="UpdateUser">
                    <Input.Word {...registerExCondition(`Row.RowType.UpdateUser`)} />
                  </VForm.Item>
                </VForm.Container>
              </VForm.Container>
            </FormProvider>
          </div>
        </Panel>

        <PanelResizeHandle className="h-2 bg-color-4" />

        <Panel>
          <Util.InlineMessageList />
          <FormProvider {...reactHookFormMethods}>
            <Layout.DataTable
              data={fields}
              columns={columnDefs}
              onChangeRow={handleUpdateRow}
              ref={dtRef}
              className="h-full"
            ></Layout.DataTable>
          </FormProvider>
        </Panel>
      </PanelGroup>
    </div>
  )
}

type GridRow = AggregateType.RowOrderDisplayData

// TODO: utilに持っていく
type PageState = { pageIndex: number, loaded?: boolean }
const pagingReducer = Util.defineReducer((state: PageState) => ({
  loadComplete: () => ({ pageIndex: state.pageIndex, loaded: true }),
  nextPage: () => ({ pageIndex: state.pageIndex + 1, loaded: false }),
  prevPage: () => ({ pageIndex: Math.max(0, state.pageIndex - 1), loaded: false }),
  moveTo: (pageIndex: number) => ({ pageIndex, loaded: false }),
}))
