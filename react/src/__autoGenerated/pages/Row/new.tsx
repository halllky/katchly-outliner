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
  const { load, commit } = Util.useRowRepository(keyOfNewItem as Util.ItemKey | undefined)

  const [defaultValues, setDefaultValues] = useState<AggregateType.RowDisplayData | undefined>()
  useEffect(() => {
    load().then(items => {
      setDefaultValues(items?.[0])
    })
  }, [load])

  const handleCommit: ReturnType<typeof Util.useRowRepository>['commit'] = useCallback(async (...items) => {
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
  defaultValues: AggregateType.RowDisplayData
  commit: ReturnType<typeof Util.useRowRepository>['commit']
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
  const onSave: SubmitHandler<AggregateType.RowDisplayData> = useCallback(async data => {
    await commit({ ...data, willBeChanged: true })
  }, [commit])

  return (
    <FormProvider {...reactHookFormMethods}>
      <form className="page-content-root gap-2" ref={formRef} onSubmit={handleSubmit(onSave)} onKeyDown={onKeyDown}>
        <h1 className="flex text-base font-semibold select-none py-1">
          <Link to="/xaa6703a7b77c514e0f4f9413ccf059d3">Row</Link>
          &nbsp;&#047;&nbsp;
          新規作成
          <div className="flex-1"></div>
        </h1>

        <Util.InlineMessageList />

        <RowView />

        <Input.IconButton submit fill className="self-start" icon={BookmarkSquareIcon}>一時保存</Input.IconButton>
      </form>
    </FormProvider>
  )
}

const RowView = ({ }: {
}) => {
  const { register, registerEx, watch, getValues } = Util.useFormContextEx<AggregateType.RowDisplayData>()
  const item = getValues()

  return (
    <>
      <VForm.Container leftColumnMinWidth="12.8rem">
        <input type="hidden" {...register(`own_members.ID`)} />
        <VForm.Item label="Text">
          <Input.Description {...registerEx(`own_members.Text`)} />
        </VForm.Item>
        <VForm.Item label="RowType">
          <Input.ComboBoxRowType {...registerEx(`own_members.RowType`)} className='w-full' />
        </VForm.Item>
        <AttrsView />
        <VForm.Item label="Indent">
          <Input.Num {...registerEx(`own_members.Indent`)} />
        </VForm.Item>
        <VForm.Item label="CreatedOn">
          <Input.Date {...registerEx(`own_members.CreatedOn`)} />
        </VForm.Item>
        <VForm.Item label="CreateUser">
          <Input.Word {...registerEx(`own_members.CreateUser`)} />
        </VForm.Item>
        <VForm.Item label="UpdatedOn">
          <Input.Date {...registerEx(`own_members.UpdatedOn`)} />
        </VForm.Item>
        <VForm.Item label="UpdateUser">
          <Input.Word {...registerEx(`own_members.UpdateUser`)} />
        </VForm.Item>
      </VForm.Container>
      <Row_RowOrderView />
    </>
  )
}
const Row_RowOrderView = ({ }: {
}) => {
  const { register, registerEx, watch, getValues, setValue } = Util.useFormContextEx<AggregateType.RowDisplayData>()
  const item = watch(`ref_from_Row_RowOrder`)
  const state = item ? Util.getLocalRepositoryState(item) : undefined

  const handleCreate = useCallback(() => {
    setValue(`ref_from_Row_RowOrder`, {
      localRepositoryItemKey: JSON.stringify(UUID.generate()) as Util.ItemKey,
      existsInRemoteRepository: false,
      willBeChanged: true,
      willBeDeleted: false,
      own_members: {
        Row: {
          __instanceKey: getValues()?.localRepositoryItemKey,
        },
      },
    })
  }, [getValues, setValue])
  const handleDelete = useCallback(() => {
    const current = getValues(`ref_from_Row_RowOrder`)
    if (current) setValue(`ref_from_Row_RowOrder`, { ...current, willBeDeleted: true })
  }, [setValue, getValues])
  const handleRedo = useCallback(() => {
    const current = getValues(`ref_from_Row_RowOrder`)
    if (current) setValue(`ref_from_Row_RowOrder`, { ...current, willBeDeleted: false })
  }, [setValue, getValues])

  return (
    <>
      <VForm.Container
        leftColumnMinWidth="10.4rem"
        label="RowOrder"
        labelSide={(state === '' || state === '+' || state === '*') && (
          <Input.Button icon={XMarkIcon} onClick={handleDelete}>削除</Input.Button>
        )}
        className="pt-4"
      >
        {state === undefined && (
          <VForm.Item wide>
            <Input.Button icon={PlusIcon} onClick={handleCreate}>作成</Input.Button>
          </VForm.Item>
        )}
        {state === '-' && (
          <VForm.Item wide>
            <Input.Button icon={ArrowUturnLeftIcon} onClick={handleRedo}>元に戻す</Input.Button>
          </VForm.Item>
        )}
        {(state === '' || state === '+' || state === '*') && (
          <>
            <input type="hidden" {...register(`ref_from_Row_RowOrder.own_members.Row`)} />
            <VForm.Item label="Order">
              <Input.Num {...registerEx(`ref_from_Row_RowOrder.own_members.Order`)} />
            </VForm.Item>
          </>
        )}
      </VForm.Container>
    </>
  )
}
const AttrsView = ({ }: {
}) => {
  const { get } = Util.useHttpRequest()
  const { register, registerEx, watch, control } = Util.useFormContextEx<AggregateType.RowDisplayData>()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `child_Attrs`,
  })
  const dtRef = useRef<Layout.DataTableRef<AggregateType.AttrsDisplayData>>(null)

  const onAdd = useCallback((e: React.MouseEvent) => {
    append({
      localRepositoryItemKey: JSON.stringify(UUID.generate()) as Util.ItemKey,
      existsInRemoteRepository: false,
      willBeChanged: true,
      willBeDeleted: false,
      own_members: {
      },
    })
    e.preventDefault()
  }, [append])
  const onRemove = useCallback((e: React.MouseEvent) => {
    const selectedRowIndexes = dtRef.current?.getSelectedRows().map(({ rowIndex }) => rowIndex) ?? []
    for (const index of selectedRowIndexes.sort((a, b) => b - a)) remove(index)
    e.preventDefault()
  }, [remove])

  const options = useMemo<Layout.DataTableProps<AggregateType.AttrsDisplayData>>(() => ({
    onChangeRow: update,
    columns: [
      {
        id: 'col1',
        header: 'ColType',
        cell: cellProps => {
          const value = cellProps.row.original.own_members?.ColType
          const formatted = `${value?.Parent?.ID ?? ''}${value?.ColumnId ?? ''}`
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {formatted}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: row => row.own_members?.ColType,
        editSetting: (() => {
          const asyncComboSetting: Layout.ColumnEditSetting<AggregateType.AttrsDisplayData, AggregateType.ColumnsRefInfo> = {
            type: 'async-combo',
            getValueFromRow: row => row.own_members?.ColType,
            setValueToRow: (row, value) => {
              row.own_members.ColType = value
            },
            onClipboardCopy: row => {
              const formatted = row.own_members?.ColType ? JSON.stringify(row.own_members?.ColType) : ''
              return formatted
            },
            onClipboardPaste: (row, value) => {
              if (row.own_members === undefined) return
              let formatted: AggregateType.ColumnsRefInfo | undefined
              if (value) {
                try {
                  const obj: AggregateType.ColumnsRefInfo = JSON.parse(value)
                  // 登録にはインスタンスキーが使われるのでキーの型だけは細かくチェックする
                  if (obj.__instanceKey === undefined) throw new Error
                  const arrInstanceKey: [string, string] = JSON.parse(obj.__instanceKey)
                  if (!Array.isArray(arrInstanceKey)) throw new Error
                  if (typeof arrInstanceKey[0] !== 'string') throw new Error
                  if (typeof arrInstanceKey[1] !== 'string') throw new Error
                  formatted = obj
                } catch {
                  formatted = undefined
                }
              } else {
                formatted = undefined
              }
              row.own_members.ColType = formatted
            },
            comboProps: {
              queryKey: `combo-x4411d631bacb9f19ceba5b9461ffdee8::`,
              query: async keyword => {
                const response = await get<AggregateType.ColumnsRefInfo[]>(`/api/RowType/list-by-keyword-x4411d631bacb9f19ceba5b9461ffdee8`, { keyword })
                if (!response.ok) return []
                return response.data
              },
              emitValueSelector: item => item,
              matchingKeySelectorFromEmitValue: item => item.__instanceKey,
              matchingKeySelectorFromOption: item => item.__instanceKey,
              textSelector: item => `${item.Parent?.ID ?? ''}${item.ColumnId ?? ''}`,
            },
          }
          return asyncComboSetting as Layout.ColumnEditSetting<AggregateType.AttrsDisplayData, unknown>
        })(),
      },
      {
        id: 'col2',
        header: 'Value',
        cell: cellProps => {
          const value = cellProps.row.original.own_members?.Value
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {value}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: row => row.own_members?.Value,
        editSetting: {
          type: 'text',
          getTextValue: row => row.own_members?.Value,
          setTextValue: (row, value) => {
            row.own_members.Value = value
          },
        },
      },
      {
        id: 'col3',
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
    ],
  }), [get, update])

  return (
    <VForm.Item wide
      label="Attrs"
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
