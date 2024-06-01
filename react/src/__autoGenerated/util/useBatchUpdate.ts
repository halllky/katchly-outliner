import { useCallback } from 'react'
import { useFieldArray } from 'react-hook-form'
import * as Types from '../autogenerated-types'
import { useHttpRequest } from './Http'
import { useFormEx } from './ReactHookFormUtil'
import { useToastContext } from './Notification'
import * as Storage from './Storage'

export type BatchUpdateState = {
  items: BatchUpdateItem[]
}
export type BatchUpdateItem
  = { type: 'Row', act: ActionType, item: Types.RowSaveCommand }
  | { type: 'RowOrder', act: ActionType, item: Types.RowOrderSaveCommand }
  | { type: 'RowType', act: ActionType, item: Types.RowTypeSaveCommand }
export type ActionType = 'a' | 'm' | 'd' // add, modify, delete

export default () => {
  // react-hook-formとのつなぎこみ
  const useFormExReturnValues = useFormEx<BatchUpdateState>({})
  const useFieldArrayReturnValues = useFieldArray({
    name: 'items',
    control: useFormExReturnValues.control,
  })

  // 一時保存
  const { data: unComittedData, save: saveTemporary } = useUncomitted()

  // 一括更新処理のスケジューリング
  const [, dispatchToast] = useToastContext()
  const { post } = useHttpRequest()
  const executeBatchUpdate = useCallback(async () => {
    const groups = groupBy(useFormExReturnValues.getValues('items'), x => x.type)
    for (const group of groups) {
      const url = `/api/NIJOBackgroundTaskEntity/schedule/NIJO-BATCH-UPDATE`
      const param = {
        DataType: group[0],
        Items: group[1].map(({ act, item }) => ({
          Action: (act === 'a' ? 'Add' : (act === 'd' ? 'Delete' : 'Modify')),
          Data: item,
        })),
      }
      const res = await post(url, param)
      if (res.ok) dispatchToast(msg => msg.info(`${group[0]}の更新をスケジューリングしました。`))
    }
  }, [post, useFormExReturnValues.handleSubmit, useFormExReturnValues.getValues])

  return {
    items: useFieldArrayReturnValues.fields,
    addNewItem: useFieldArrayReturnValues.append,
    executeBatchUpdate,
    unComittedData,
    saveTemporary,
    rawApi: {
      ...useFormExReturnValues,
      ...useFieldArrayReturnValues,
    },
  }
}

const [UnComittedCacheProvider, useUncomitted] = Storage.defineStorageContext({
  storageKey: 'NIJO::UNCOMITTED',
  defaultValue: (): BatchUpdateState => ({ items: [] }),
  serialize: obj => JSON.stringify(obj),
  deserialize: str => JSON.parse(str),
  noMessageOnSave: true,
})

const groupBy = <TItem, TKey>(arr: TItem[], fn: (t: TItem) => TKey): Map<TKey, TItem[]> => {
  return arr.reduce((map, curr) => {
    const key = fn(curr)
    const group = map.get(key)
    if (group) {
      group.push(curr)
    } else {
      map.set(key, [curr])
    }
    return map
  }, new Map<TKey, TItem[]>())
}
