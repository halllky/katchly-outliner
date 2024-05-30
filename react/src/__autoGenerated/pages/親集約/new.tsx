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
  const { load, commit } = Util.use親集約Repository(keyOfNewItem as Util.ItemKey | undefined)

  const [defaultValues, setDefaultValues] = useState<AggregateType.親集約DisplayData | undefined>()
  useEffect(() => {
    load().then(items => {
      setDefaultValues(items?.[0])
    })
  }, [load])

  const handleCommit: ReturnType<typeof Util.use親集約Repository>['commit'] = useCallback(async (...items) => {
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
  defaultValues: AggregateType.親集約DisplayData
  commit: ReturnType<typeof Util.use親集約Repository>['commit']
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
  const onSave: SubmitHandler<AggregateType.親集約DisplayData> = useCallback(async data => {
    await commit({ ...data, willBeChanged: true })
  }, [commit])

  return (
    <FormProvider {...reactHookFormMethods}>
      <form className="page-content-root gap-2" ref={formRef} onSubmit={handleSubmit(onSave)} onKeyDown={onKeyDown}>
        <h1 className="flex text-base font-semibold select-none py-1">
          <Link to="/xe213acbb917da6e275692e24574a1c42">親集約</Link>
          &nbsp;&#047;&nbsp;
          新規作成
          <div className="flex-1"></div>
        </h1>

        <Util.InlineMessageList />

        <親集約View />

        <Input.IconButton submit fill className="self-start" icon={BookmarkSquareIcon}>一時保存</Input.IconButton>
      </form>
    </FormProvider>
  )
}

const 親集約View = ({ }: {
}) => {
  const { register, registerEx, watch, getValues } = Util.useFormContextEx<AggregateType.親集約DisplayData>()
  const item = getValues()

  return (
    <>
      <VForm.Container leftColumnMinWidth="12.8rem">
        <input type="hidden" {...register(`own_members.ID`)} />
        <VForm.Item label="単語">
          <Input.Word {...registerEx(`own_members.単語`)} />
        </VForm.Item>
        <VForm.Item label="文章">
          <Input.Description {...registerEx(`own_members.文章`)} />
        </VForm.Item>
        <VForm.Item label="整数">
          <Input.Num {...registerEx(`own_members.整数`)} />
        </VForm.Item>
        <VForm.Item label="実数">
          <Input.Num {...registerEx(`own_members.実数`)} />
        </VForm.Item>
        <VForm.Item label="日付時刻">
          <Input.Date {...registerEx(`own_members.日付時刻`)} />
        </VForm.Item>
        <VForm.Item label="日付">
          <Input.Date {...registerEx(`own_members.日付`)} />
        </VForm.Item>
        <VForm.Item label="年月">
          <Input.YearMonth {...registerEx(`own_members.年月`)} />
        </VForm.Item>
        <VForm.Item label="年">
          <Input.Num {...registerEx(`own_members.年`)} />
        </VForm.Item>
        <VForm.Item label="参照">
          <Input.ComboBox参照先 {...registerEx(`own_members.参照.__instanceKey`)} className='w-full' />
        </VForm.Item>
        <VForm.Item label="真偽値">
          <Input.CheckBox {...registerEx(`own_members.真偽値`)} />
        </VForm.Item>
        <VForm.Item label="列挙体">
          <Input.Selection {...registerEx(`own_members.列挙体`)} options={['選択肢1' as const, '選択肢2' as const, '選択肢3' as const]} keySelector={item => item} textSelector={item => item} />
        </VForm.Item>
        <ChildrenView />
      </VForm.Container>
    </>
  )
}
const ChildrenView = ({ }: {
}) => {
  const { registerEx, watch, control } = Util.useFormContextEx<AggregateType.親集約DisplayData>()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `child_Children`,
  })
  const dtRef = useRef<Layout.DataTableRef<AggregateType.ChildrenDisplayData>>(null)

  const onAdd = useCallback((e: React.MouseEvent) => {
    append({
      localRepositoryItemKey: JSON.stringify(UUID.generate()) as Util.ItemKey,
      existsInRemoteRepository: false,
      willBeChanged: true,
      willBeDeleted: false,
      own_members: {
        ID: UUID.generate(),
      },
    })
    e.preventDefault()
  }, [append])
  const onRemove = useCallback((e: React.MouseEvent) => {
    const selectedRowIndexes = dtRef.current?.getSelectedIndexes() ?? []
    for (const index of selectedRowIndexes.sort((a, b) => b - a)) remove(index)
    e.preventDefault()
  }, [remove])

  const options = useMemo<Layout.DataTableProps<AggregateType.ChildrenDisplayData>>(() => ({
    onChangeRow: update,
    columns: [
      {
        id: 'col1',
        header: '単語',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.単語
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {value}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.単語,
        setValue: (row, value) => row.item.own_members.単語 = value,
        cellEditor: (props, ref) => <Input.Word ref={ref} {...props} />,
      },
      {
        id: 'col2',
        header: '文章',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.文章
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {value}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.文章,
        setValue: (row, value) => row.item.own_members.文章 = value,
        cellEditor: (props, ref) => <Input.Description ref={ref} {...props} />,
      },
      {
        id: 'col3',
        header: '整数',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.整数
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {value}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.整数,
        setValue: (row, value) => row.item.own_members.整数 = value,
        cellEditor: (props, ref) => <Input.Num ref={ref} {...props} />,
      },
      {
        id: 'col4',
        header: '実数',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.実数
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {value}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.実数,
        setValue: (row, value) => row.item.own_members.実数 = value,
        cellEditor: (props, ref) => <Input.Num ref={ref} {...props} />,
      },
      {
        id: 'col5',
        header: '日付時刻',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.日付時刻
          const formatted = value == undefined
            ? ''
            : dayjs(value).format('YYYY-MM-DD HH:mm:ss')
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {formatted}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.日付時刻,
        setValue: (row, value) => row.item.own_members.日付時刻 = value,
        cellEditor: (props, ref) => <Input.Date ref={ref} {...props} />,
      },
      {
        id: 'col6',
        header: '日付',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.日付
          const formatted = value == undefined
            ? ''
            : dayjs(value).format('YYYY-MM-DD')
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {formatted}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.日付,
        setValue: (row, value) => row.item.own_members.日付 = value,
        cellEditor: (props, ref) => <Input.Date ref={ref} {...props} />,
      },
      {
        id: 'col7',
        header: '年月',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.年月
          let formatted = ''
          if (value != undefined) {
            const yyyy = (Math.floor(value / 100)).toString().padStart(4, '0')
            const mm = (value % 100).toString().padStart(2, '0')
            formatted = `${yyyy}-${mm}`
          }
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {formatted}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.年月,
        setValue: (row, value) => row.item.own_members.年月 = value,
        cellEditor: (props, ref) => <Input.YearMonth ref={ref} {...props} />,
      },
      {
        id: 'col8',
        header: '年',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.年
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {value}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.年,
        setValue: (row, value) => row.item.own_members.年 = value,
        cellEditor: (props, ref) => <Input.Num ref={ref} {...props} />,
      },
      {
        id: 'col9',
        header: '参照',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.参照
          const formatted = `${value?.Name ?? ''}`
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {formatted}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.参照,
        setValue: (row, value) => row.item.own_members.参照 = value,
        cellEditor: (props, ref) => <Input.ComboBox参照先 ref={ref} {...props} />,
      },
      {
        id: 'col10',
        header: '真偽値',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.真偽値
          const formatted = (value === undefined ? '' : (value ? '○' : '-'))
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {formatted}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.真偽値,
        setValue: (row, value) => row.item.own_members.真偽値 = value,
        cellEditor: (props, ref) => <Input.BooleanComboBox ref={ref} {...props} />,
      },
      {
        id: 'col11',
        header: '列挙体',
        cell: cellProps => {
          const value = cellProps.row.original.item.own_members?.列挙体
          return (
            <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
              {value}
              &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
            </span>
          )
        },
        accessorFn: data => data.item.own_members?.列挙体,
        setValue: (row, value) => row.item.own_members.列挙体 = value,
        cellEditor: (props, ref) => <Input.ComboBox ref={ref} {...props} options={['選択肢1' as const, '選択肢2' as const, '選択肢3' as const]} keySelector={item => item} textSelector={item => item} />,
      },
    ],
  }), [update])

  return (
    <VForm.Item wide
      label="Children"
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
