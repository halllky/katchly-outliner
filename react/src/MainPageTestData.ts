import { UUID } from 'uuidjs'
import { RowType, RowObject, RowTypeId, ColumnId, RowObjectId } from './Types'

export default function () {

  const task = newRowType('残タスク', ['ステータス', '備考'])
  const status = task.columns.find(c => c.name === 'ステータス')!.id

  const task1 = newRow('先方と要件を詰める', { type: task.id })
  const task1_1 = newRow('パワポの図を描く', { type: task.id, parent: task1.id, attrs: { [status]: '完了' } })
  const task1_2 = newRow('打ち合わせの日時を打診する', { type: task.id, parent: task1.id, attrs: { [status]: '未' } })

  return {
    rowTypes: [
      task
    ],
    rows: [
      task1,
      task1_1,
      task1_2,
    ],
  }
}

const newRowType = (name?: string, columnNames?: string[]): RowType => ({
  id: UUID.generate() as RowTypeId,
  name,
  columns: columnNames?.map(colName => ({
    id: UUID.generate() as ColumnId,
    name: colName
  })) ?? [],
})

const newRow = (text: string, { type, parent, attrs }: { type: RowTypeId, parent?: RowObjectId, attrs?: RowObject['attrs'] }): RowObject => ({
  id: UUID.generate() as RowObjectId,
  type,
  parent,
  text,
  attrs: attrs ?? {},
})
