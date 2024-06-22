import { useMemo, useCallback, useRef } from 'react'
import { AppSetting, useAppSettings } from './AppSettings'
import { Comment, RowTypeId, RowType, GridRow, UseFieldArrayReturnType, RowTypeMapDispatcher, createNewComment } from './Types'
import * as Util from '../__autoGenerated/util'
import * as Input from '../__autoGenerated/input'
import * as Collection from '../__autoGenerated/collection'
import { RowStateBar } from './RowStateBar'

type DetailViewProp = {
  row?: GridRow
  rowIndex?: number
  rowTypeMap: Map<RowTypeId, RowType>
  updateRow: UseFieldArrayReturnType['update']
  changeRowType: UseFieldArrayReturnType['update']
  dispatchRowType: RowTypeMapDispatcher
}

export default function ({ row, rowIndex, rowTypeMap, changeRowType, updateRow, dispatchRowType }: DetailViewProp) {

  const handleChangeRowType = useCallback((rowTypeId: RowTypeId | undefined) => {
    if (row?.type !== 'row' || rowIndex === undefined || rowTypeId === undefined) return
    changeRowType(rowIndex, { ...row, item: { ...row.item, type: rowTypeId, willBeChanged: true } })
  }, [row, rowIndex, changeRowType])

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex pb-1">
        <span className="flex-1 inline-block overflow-hidden text-ellipsis whitespace-nowrap border border-color-0">
          {row?.type === 'row' && row.item.text}
          {row?.type === 'rowType' && rowTypeMap.get(row.rowTypeId)?.name}
        </span>
        {row?.type === 'row' && (
          <RowTypeComboBox dataSource={rowTypeMap} value={row.item.type} onChange={handleChangeRowType} className="flex-1" />
        )}
      </div>
      <CommentList
        row={row}
        rowIndex={rowIndex}
        onChange={updateRow}
        rowTypeMap={rowTypeMap}
        dispatchRowType={dispatchRowType}
      />
    </div>
  )
}

const RowTypeComboBox = ({ dataSource, value, onChange, className }: {
  dataSource: Map<RowTypeId, RowType>
  value?: RowTypeId
  onChange?: (id: RowTypeId | undefined) => void
  className?: string
}) => {
  const dataSourceAsArray = useMemo(() => {
    return Array.from(dataSource).map(([, rowType]) => rowType)
  }, [dataSource])
  return (
    <Input.ComboBox
      options={dataSourceAsArray}
      emitValueSelector={getIdOfRowType}
      matchingKeySelectorFromOption={getIdOfRowType}
      matchingKeySelectorFromEmitValue={getIdOfRowTypeId}
      textSelector={getNameOfRowType}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}
const getIdOfRowType = (rowType: RowType) => rowType.id
const getNameOfRowType = (rowType: RowType) => rowType.name ?? ''
const getIdOfRowTypeId = (id: RowTypeId) => id

// --------------------------------------
type CommentListState = { comments: Comment[] }

const CommentList = ({ row, rowIndex, onChange, rowTypeMap, dispatchRowType }: {
  row: GridRow | undefined
  rowIndex: number | undefined
  onChange: UseFieldArrayReturnType['update']
  rowTypeMap: Map<RowTypeId, RowType>
  dispatchRowType: RowTypeMapDispatcher
}) => {
  const { data: { userName } } = useAppSettings()
  const { comments }: CommentListState = useMemo(() => {
    if (row?.type === 'row') {
      return row.item
    } else if (row?.type === 'rowType') {
      const rowType = rowTypeMap.get(row.rowTypeId)
      return rowType ?? { comments: [] }
    } else {
      return { comments: [] }
    }
  }, [row, rowTypeMap])

  /** rowのコメントの配列の更新を上位コンポーネントに知らせます。 */
  const editCommentArray = useCallback((updateFunction: (current: Comment[]) => Comment[]) => {
    if (row?.type === 'row') {
      if (rowIndex === undefined) return
      const comments = updateFunction([...row.item.comments])
      onChange(rowIndex, { ...row, item: { ...row.item, comments } })

    } else if (row?.type === 'rowType') {
      const rowType = rowTypeMap.get(row.rowTypeId)
      if (!rowType) return
      const comments = [...rowType.comments]
      updateFunction(comments)
      dispatchRowType(state => state.set({ ...rowType, comments }))
    }
  }, [row, rowIndex, rowTypeMap, onChange, dispatchRowType])

  const onChangeCommentText = useCallback((commentIndex: number, comment: Comment) => {
    editCommentArray(comments => {
      comments.splice(commentIndex, 1, { ...comment, willBeChanged: true })
      return comments
    })
  }, [editCommentArray])

  const gridRef = useRef<Collection.DataTableRef<Comment>>(null)
  const [, dispatchMsg] = Util.useMsgContext()
  const onKeyDown: React.KeyboardEventHandler = useCallback(e => {
    // TABキーによるインデントの上げ下げ
    if (e.key === 'Tab') {
      editCommentArray(comments => {
        const selectedRows = gridRef.current?.getSelectedRows()
        if (selectedRows === undefined) return comments
        for (const { rowIndex: commentIndex } of selectedRows) {
          const comment = comments[commentIndex]
          comment.indent = e.shiftKey
            ? Math.max(0, comment.indent - 1)
            : (comment.indent + 1)
          comment.willBeChanged = true
        }
        return comments
      })
      e.preventDefault()
    }
    // Enter による行追加
    else if (e.key === 'Enter') {
      if (!userName) {
        dispatchMsg(msg => msg.warn('コメントを追加するには設定画面でユーザー名を設定してください。'))
        e.preventDefault()
        return
      }
      editCommentArray(comments => {
        const insertPoint = gridRef.current?.getSelectedRows()[0]?.rowIndex
        if (insertPoint === undefined) {
          comments.push(createNewComment(userName))
        } else if (e.ctrlKey || e.metaKey) {
          // カーソル位置に追加
          comments.splice(insertPoint, 0, createNewComment(userName))
        } else {
          // カーソル位置の次の行に追加
          comments.splice(insertPoint + 1, 0, createNewComment(userName))
          e.preventDefault()
        }
        return comments
      })
      e.preventDefault()
    }
    // Shift + Delete による行削除
    else if (e.shiftKey && e.key === 'Delete') {
      editCommentArray(comments => {
        const selectedRowIndexes = gridRef.current
          ?.getSelectedRows()
          .map(({ row }) => row.id)
        if (selectedRowIndexes === undefined) return comments

        const remainComments: Comment[] = []
        let warning = false
        for (const comment of comments) {
          if (!selectedRowIndexes.includes(comment.id)) {
            remainComments.push(comment)
            continue
          }
          if (comment.author !== userName) {
            if (!warning) {
              dispatchMsg(msg => msg.warn('他人のコメントは削除できません。'))
              warning = true
            }
            remainComments.push(comment)
            continue
          }
          if (comment.existsInRemoteRepository) {
            comment.willBeDeleted = true
            remainComments.push(comment)
          } else {
            // 即削除
          }
        }
        return remainComments
      })
      e.preventDefault()
    }
    // Alt + 上下 による行移動
    else if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      editCommentArray(comments => {
        const selectedRows = gridRef.current?.getSelectedRows()
        if (selectedRows === undefined || selectedRows.length === 0) return comments
        const first = selectedRows[0].rowIndex
        const last = selectedRows[selectedRows.length - 1].rowIndex
        if (e.key === 'ArrowUp') {
          if (first > 0) {
            const moving = comments.splice(first - 1, 1)
            comments.splice(last, 0, ...moving)
          }
        } else {
          if (last < (comments.length - 1)) {
            const moving = comments.splice(last + 1, 1)
            comments.splice(first, 0, ...moving)
          }
        }
        return comments
      })
    }
  }, [gridRef, userName, editCommentArray, dispatchMsg])

  const columnDef = useMemo((): Collection.ColumnDefEx<Comment>[] => [
    {
      id: 'col0',
      header: 'コメント',
      cell: cellProps => <CommnetView comment={cellProps.row.original} />,
      accessorFn: x => x.text,
      editSetting: {
        type: 'multiline-text',
        getTextValue: x => x.text,
        setTextValue: (x, v) => x.text = v ?? '',
        readOnly: x => x.author !== userName,
      },
    },
  ], [userName])

  return (
    <Collection.DataTable
      ref={gridRef}
      data={comments}
      columns={columnDef}
      onChangeRow={onChangeCommentText}
      onKeyDown={onKeyDown}
      tableWidth="fit"
      className="flex-1"
    />
  )
}

const CommnetView = ({ comment }: {
  comment: Comment
}) => {
  const editState = Util.getLocalRepositoryState(comment)

  return (
    <div key={comment.id} className="flex">
      <RowStateBar state={editState} />
      <div style={{ flexBasis: comment.indent * 28 }}></div>
      <div className="flex-1 flex flex-col">
        <div className="flex flex-wrap text-xs text-color-5">
          {comment.author}
          <div className="flex-1"></div>
          {comment.createdOn}
        </div>
        <span className="text-sm whitespace-pre-wrap">
          {comment.text}
        </span>
      </div>
    </div>
  )
}
