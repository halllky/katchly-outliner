import { UUID } from 'uuidjs'
import { RowObject, RowTypeId, RowObjectId, createNewRowType } from './Types'

export default function (many: boolean) {

  const task = createNewRowType('残タスク', ['ステータス', '備考'])
  const status = task.columns.find(c => c.name === 'ステータス')!.id

  const parts = createNewRowType('構成要素')

  const task1 = newRow('先方と要件を詰める', { type: task.id })
  const task1_1 = newRow('パワポの図を描く', { type: task.id, indent: 1, attrs: { [status]: '完了' } })
  const task1_2 = newRow('打ち合わせの日時を打診する', { type: task.id, indent: 1, attrs: { [status]: '未' } })

  return {
    rowTypes: [
      task,
      parts,
    ],
    rows: [
      task1,
      task1_1,
      task1_2,
      ...(many ? Array.from({ length: 10 }).map(_ => newRow('', { type: task.id })) : []),
      ...(many ? Array.from({ length: 10 }).map(_ => newRow('', { type: parts.id })) : []),
      ...(many ? Array.from({ length: 200 }).map(_ => newRow('', { type: task.id })) : []),
    ],
  }
}

const newRow = (text: string, { type, indent, attrs }: { type: RowTypeId, indent?: number, attrs?: RowObject['attrs'] }): RowObject => ({
  id: UUID.generate() as RowObjectId,
  type,
  text,
  attrs: attrs ?? {},
  indent: indent ?? 0,
  existsInRemoteRepository: false,
  willBeChanged: true,
  willBeDeleted: false,
})

