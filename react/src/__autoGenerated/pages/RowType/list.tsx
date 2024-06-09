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
  const [filter, setFilter] = useState<AggregateType.RowTypeSearchCondition>(() => AggregateType.createRowTypeSearchCondition())
  const [currentPage, dispatchPaging] = useReducer(pagingReducer, { pageIndex: 0 })

  const rhfSearchMethods = Util.useFormEx<AggregateType.RowTypeSearchCondition>({})
  const getConditionValues = rhfSearchMethods.getValues
  const registerExCondition = rhfSearchMethods.registerEx

  // 編集対象（リモートリポジトリ + ローカルリポジトリ）
  const editRange = useMemo(() => ({
    filter,
    skip: currentPage.pageIndex * 20,
    take: 20,
  }), [filter, currentPage])
  const { load, commit } = Util.useRowTypeRepository(editRange)

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
    const newRow: AggregateType.RowTypeDisplayData = {
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
        const singleViewUrl = Util.getRowTypeSingleViewUrl(row.localRepositoryItemKey, state === '+' ? 'new' : 'edit')
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
      header: 'RowTypeName',
      cell: cellProps => {
        const value = cellProps.row.original.own_members?.RowTypeName
        return (
          <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
            {value}
            &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
          </span>
        )
      },
      accessorFn: row => row.own_members?.RowTypeName,
      editSetting: {
        type: 'text',
        getTextValue: row => row.own_members?.RowTypeName,
        setTextValue: (row, value) => {
          row.own_members.RowTypeName = value
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
              RowType
            </h1>
            <Input.Button onClick={handleReload}>再読み込み</Input.Button>
            <div className="basis-4"></div>
            <Input.Button onClick={handleAdd}>追加</Input.Button>
            <Input.Button onClick={handleRemove}>削除</Input.Button>
            <Input.IconButton fill icon={BookmarkSquareIcon} onClick={onSave}>一時保存</Input.IconButton>
          </div>

          <Util.InlineMessageList />

          <VForm.Container leftColumnMinWidth="10rem">
            <VForm.Item label="RowTypeName">
              <Input.Word {...registerExCondition(`RowTypeName`)} />
            </VForm.Item>
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

type GridRow = AggregateType.RowTypeDisplayData

// TODO: utilに持っていく
type PageState = { pageIndex: number, loaded?: boolean }
const pagingReducer = Util.defineReducer((state: PageState) => ({
  loadComplete: () => ({ pageIndex: state.pageIndex, loaded: true }),
  nextPage: () => ({ pageIndex: state.pageIndex + 1, loaded: false }),
  prevPage: () => ({ pageIndex: Math.max(0, state.pageIndex - 1), loaded: false }),
  moveTo: (pageIndex: number) => ({ pageIndex, loaded: false }),
}))
