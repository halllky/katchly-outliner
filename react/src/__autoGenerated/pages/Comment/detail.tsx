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
    const urlKeyID = key0
    return [urlKeyID]
  }, [key0])

  const { load } = Util.useCommentRepository(pkArray)

  const [defaultValues, setDefaultValues] = useState<AggregateType.CommentDisplayData | undefined>()
  useEffect(() => {
    load().then(items => {
      setDefaultValues(items?.[0])
    })
  }, [load])

  return defaultValues ? (
    <AfterLoaded
      pkArray={pkArray}
      defaultValues={defaultValues}
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
}: {
  pkArray: [string | undefined]
  defaultValues: AggregateType.CommentDisplayData
}) => {

  const navigate = useNavigate()
  const reactHookFormMethods = useForm({ defaultValues })
  const { handleSubmit } = reactHookFormMethods

  const instanceName = useMemo(() => {
    return `${defaultValues.own_members?.Text ?? ''}`
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

  const navigateToEditView = useCallback((e: React.MouseEvent) => {
    navigate(`/xcc9c15b1503ef15d999d64ce6d5fe189/edit/${window.encodeURI(`${pkArray[0]}`)}`)
    e.preventDefault()
  }, [navigate, pkArray])

  return (
    <FormProvider {...reactHookFormMethods}>
      <form className="page-content-root gap-2">
        <h1 className="flex text-base font-semibold select-none py-1">
          <Link to="/x6940e80bcd51a8fd2f00f79328cf4efc">Comment</Link>
          &nbsp;&#047;&nbsp;
          <span className="select-all">{instanceName}</span>
          <div className="flex-1"></div>
        </h1>

        <Util.InlineMessageList />

        <CommentView />

        <Input.IconButton submit fill className="self-start" icon={PencilIcon} onClick={navigateToEditView}>編集</Input.IconButton>
      </form>
    </FormProvider>
  )
}

const CommentView = ({ }: {
}) => {
  const { register, registerEx, watch, getValues } = Util.useFormContextEx<AggregateType.CommentDisplayData>()
  const item = getValues()

  return (
    <>
      <VForm.Container leftColumnMinWidth="15.2rem">
        <input type="hidden" {...register(`own_members.ID`)} />
        <VForm.Item label="Text">
          <Input.Description {...registerEx(`own_members.Text`)} readOnly />
        </VForm.Item>
        <VForm.Item label="Author">
          <Input.Word {...registerEx(`own_members.Author`)} readOnly />
        </VForm.Item>
        <VForm.Item label="Indent">
          <Input.Num {...registerEx(`own_members.Indent`)} readOnly />
        </VForm.Item>
        <VForm.Item label="Order">
          <Input.Num {...registerEx(`own_members.Order`)} readOnly />
        </VForm.Item>
        <VForm.Item label="CreatedOn">
          <Input.Date {...registerEx(`own_members.CreatedOn`)} readOnly />
        </VForm.Item>
        <VForm.Item label="UpdatedOn">
          <Input.Date {...registerEx(`own_members.UpdatedOn`)} readOnly />
        </VForm.Item>
        <VForm.Item label="TargetRow">
          <Link className="text-link" to={Util.getRowSingleViewUrl(getValues('own_members.TargetRow.__instanceKey'), 'view')}>
            {`${item.own_members?.TargetRow?.Text ?? ''}`}
          </Link>
        </VForm.Item>
        <VForm.Item label="TargetCell">
          <Link className="text-link" to={Util.getAttrsSingleViewUrl(getValues('own_members.TargetCell.__instanceKey'), 'view')}>
            {`${item.own_members?.TargetCell?.Value ?? ''}`}
          </Link>
        </VForm.Item>
        <VForm.Item label="TargetRowType">
          <Link className="text-link" to={Util.getRowTypeSingleViewUrl(getValues('own_members.TargetRowType.__instanceKey'), 'view')}>
            {`${item.own_members?.TargetRowType?.ID ?? ''}`}
          </Link>
        </VForm.Item>
        <VForm.Item label="TargetColumn">
          <Link className="text-link" to={Util.getColumnsSingleViewUrl(getValues('own_members.TargetColumn.__instanceKey'), 'view')}>
            {`${item.own_members?.TargetColumn?.Parent?.ID ?? ''}${item.own_members?.TargetColumn?.ColumnId ?? ''}`}
          </Link>
        </VForm.Item>
      </VForm.Container>
    </>
  )
}