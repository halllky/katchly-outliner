import React, { useState, useEffect, useCallback, useMemo, useReducer, useRef, useId, useContext, createContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { BookmarkSquareIcon, PencilIcon, XMarkIcon, PlusIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { UUID } from 'uuidjs';
import dayjs from 'dayjs';
import * as Input from '../../input';
import * as Layout from '../../collection';
import * as Util from '../../util';
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
  const { key0: keyOfNewItem } = useParams()
  const { load, commit } = Util.useRowTypeRepository(keyOfNewItem as Util.ItemKey | undefined)

  const [defaultValues, setDefaultValues] = useState<AggregateType.RowTypeDisplayData | undefined>()
  useEffect(() => {
    load().then(items => {
      setDefaultValues(items?.[0])
    })
  }, [load])

  const handleCommit: ReturnType<typeof Util.useRowTypeRepository>['commit'] = useCallback(async (...items) => {
    await commit(...items)
    const afterCommit = await load()
    setDefaultValues(afterCommit?.[0])
  }, [load, commit])

  return defaultValues ? (
    <AfterLoaded
      defaultValues={defaultValues}
      commit={handleCommit}
    ></AfterLoaded>
  ) : (
    <>
      <Util.InlineMessageList />
    </>
  )
}

const AfterLoaded = ({
  defaultValues,
  commit,
}: {
  defaultValues: AggregateType.RowTypeDisplayData
  commit: ReturnType<typeof Util.useRowTypeRepository>['commit']
}) => {

  const navigate = useNavigate()
  const reactHookFormMethods = useForm({ defaultValues })
  const { handleSubmit } = reactHookFormMethods


  const formRef = useRef<HTMLFormElement>(null)
  const onKeyDown: React.KeyboardEventHandler<HTMLFormElement> = useCallback(e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      // Ctrl + Enter で送信
      formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))

    } else if (e.key === 'Enter' && !(e.target as HTMLElement).matches('textarea')) {
      // フォーム中でEnterキーが押されたときに誤submitされるのを防ぐ。
      // textareaでpreventDefaultすると改行できなくなるので除外
      e.preventDefault()
    }
  }, [])

  // データの一時保存
  const onSave: SubmitHandler<AggregateType.RowTypeDisplayData> = useCallback(async data => {
    await commit({ ...data, willBeChanged: true })
  }, [commit])

  return (
    <FormProvider {...reactHookFormMethods}>
      <form className="page-content-root gap-2" ref={formRef} onSubmit={handleSubmit(onSave)} onKeyDown={onKeyDown}>
        <h1 className="flex text-base font-semibold select-none py-1">
          <Link to="/x32605e58c9870700a3a2652f36a5c4b5">RowType</Link>
          &nbsp;&#047;&nbsp;
          新規作成
          <div className="flex-1"></div>
        </h1>

        <Util.InlineMessageList />

        <RowTypeView />

        <Input.IconButton submit fill className="self-start" icon={BookmarkSquareIcon}>一時保存</Input.IconButton>
      </form>
    </FormProvider>
  )
}

const RowTypeView = ({ }: {
}) => {
  const { register, registerEx, watch, getValues } = Util.useFormContextEx<AggregateType.RowTypeDisplayData>()
  const item = getValues()

  return (
    <>
      <VForm.Container leftColumnMinWidth="14.0rem">
        <input type="hidden" {...register(`own_members.ID`)} />
        <VForm.Item label="RowTypeName">
          <Input.Word {...registerEx(`own_members.RowTypeName`)} />
        </VForm.Item>
        <ColumnsView />
      </VForm.Container>
    </>
  )
}
const ColumnsView = ({ }: {
}) => {
  const { registerEx, watch, control } = Util.useFormContextEx<AggregateType.RowTypeDisplayData>()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `child_Columns`,
  })
  const dtRef = useRef<Layout.DataTableRef<AggregateType.ColumnsDisplayData>>(null)

  const onAdd = useCallback((e: React.MouseEvent) => {
    append({
      localRepositoryItemKey: JSON.stringify(UUID.generate()) as Util.ItemKey,
      existsInRemoteRepository: false,
      willBeChanged: true,
      willBeDeleted: false,
      own_members: {
        ColumnId: UUID.generate(),
      },
    })
    e.preventDefault()
  }, [append])
  const onRemove = useCallback((e: React.MouseEvent) => {
    const selectedRowIndexes = dtRef.current?.getSelectedIndexes() ?? []
    for (const index of selectedRowIndexes.sort((a, b) => b - a)) remove(index)
    e.preventDefault()
  }, [remove])

  const options = useMemo<Layout.DataTableProps<AggregateType.ColumnsDisplayData>>(() => ({
    onChangeRow: update,
    columns: [
      {
        id: 'col1',
        header: 'ColumnName',
        cell: cellProps => {
          const value = cellProps.row.original.own_members?.ColumnName
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {value}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.own_members?.ColumnName,
        setValue: (row, value) => row.own_members.ColumnName = value,
        cellEditor: (props, ref) => <Input.Word ref={ref} {...props} />,
      },
    ],
  }), [update])

  return (
    <VForm.Item wide
      label="Columns"
      labelSide={<>
        <Input.Button
          icon={PlusIcon}
          onClick={onAdd}>
          追加
        </Input.Button>
        <Input.Button
          icon={XMarkIcon}
          onClick={onRemove}>
          削除
        </Input.Button>
      </>}
      >
      <Layout.DataTable
        ref={dtRef}
        data={fields}
        {...options}
        className="h-64 w-full"
      />
    </VForm.Item>
  )
}
