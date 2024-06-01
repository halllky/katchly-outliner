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
  const { key0 } = useParams()
  const pkArray: [string | undefined] = useMemo(() => {
    const urlKeyRow_ID = key0
    return [urlKeyRow_ID]
  }, [key0])

  const { load, commit } = Util.useRowOrderRepository(pkArray)

  const [defaultValues, setDefaultValues] = useState<AggregateType.RowOrderDisplayData | undefined>()
  useEffect(() => {
    load().then(items => {
      setDefaultValues(items?.[0])
    })
  }, [load])

  const handleCommit: ReturnType<typeof Util.useRowOrderRepository>['commit'] = useCallback(async (...items) => {
    await commit(...items)
    const afterCommit = await load()
    setDefaultValues(afterCommit?.[0])
  }, [load, commit])

  return defaultValues ? (
    <AfterLoaded
      pkArray={pkArray}
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
  pkArray,
  defaultValues,
  commit,
}: {
  pkArray: [string | undefined]
  defaultValues: AggregateType.RowOrderDisplayData
  commit: ReturnType<typeof Util.useRowOrderRepository>['commit']
}) => {

  const navigate = useNavigate()
  const reactHookFormMethods = useForm({ defaultValues })
  const { handleSubmit } = reactHookFormMethods

  const instanceName = useMemo(() => {
    return ``
  }, [defaultValues.own_members])

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
  const onSave: SubmitHandler<AggregateType.RowOrderDisplayData> = useCallback(async data => {
    await commit({ ...data, willBeChanged: true })
  }, [commit])

  return (
    <FormProvider {...reactHookFormMethods}>
      <form className="page-content-root gap-2" ref={formRef} onSubmit={handleSubmit(onSave)} onKeyDown={onKeyDown}>
        <h1 className="flex text-base font-semibold select-none py-1">
          <Link to="/x1827ce8197ce65dd7400e6eeb2155790">RowOrder</Link>
          &nbsp;&#047;&nbsp;
          <span className="select-all">{instanceName}</span>
          <div className="flex-1"></div>
        </h1>

        <Util.InlineMessageList />

        <RowOrderView />

        <Input.IconButton submit fill className="self-start" icon={BookmarkSquareIcon}>一時保存</Input.IconButton>
      </form>
    </FormProvider>
  )
}

const RowOrderView = ({ }: {
}) => {
  const { register, registerEx, watch, getValues } = Util.useFormContextEx<AggregateType.RowOrderDisplayData>()
  const item = getValues()

  return (
    <>
      <VForm.Container leftColumnMinWidth="10.4rem">
        <VForm.Item label="Row">
          <Input.ComboBoxRow {...registerEx(`own_members.Row`)} className='w-full' readOnly={item?.existsInRemoteRepository} />
        </VForm.Item>
        <VForm.Item label="Order">
          <Input.Num {...registerEx(`own_members.Order`)} />
        </VForm.Item>
      </VForm.Container>
    </>
  )
}