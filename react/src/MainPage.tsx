import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { ArrowPathIcon, ChevronRightIcon, ChatBubbleLeftEllipsisIcon, Cog6ToothIcon, InboxIcon, PlusIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import * as Util from './__autoGenerated/util'
import * as Input from './__autoGenerated/input'
import * as Collection from './__autoGenerated/collection'
import { Comment, GridRow, GridRowOfRowObject, PageFormState, ROWTYPE_STYLE, RowObject, RowType, RowTypeId, RowTypeMapDispatcher, UseFieldArrayReturnType, createNewComment, createNewRowType, getAboveRowObjectIndex, getAttrCellValue, getBelowRowObjectIndex, getLabelCellValue, getRowEditState, insertNewRow, moveArrayItem, setAttrCellValue, setLabelCellValue, toGridRows, useEditRowObject, useRowTypeMap } from './Types'
import { useKatchlyRepository } from './MainPageRepos'
import { AppSettingContext, AppSttingsDialog, useAppSettings } from './AppSettings'

export default function () {

  const divRef = useRef<HTMLDivElement>(null)

  return (
    <Util.ImeContextProvider elementRef={divRef.current}>
      <Util.ToastContextProvider>
        <Util.MsgContextProvider>
          <AppSettingContext>
            <div className="relative h-full w-full flex flex-col" ref={divRef}>
              <Util.InlineMessageList />
              <Page />
            </div>
            <Util.Toast />
          </AppSettingContext>
        </Util.MsgContextProvider>
      </Util.ToastContextProvider>
    </Util.ImeContextProvider>
  )
}

export const Page = () => {

  const [nowLoading, setNowLoading] = useState(true)
  const [{ rows, rowTypes }, setData] = useState<{ rows: RowObject[], rowTypes: RowType[] }>(() => ({ rows: [], rowTypes: [] }))
  const debugStyle = useMemo((): React.CSSProperties => ({
    fontFamily: '"Cascadia Mono", "BIZ UDGothic"',
  }), [])

  // データの読み込みと保存
  const { loadAll, saveAll, nowSaving } = useKatchlyRepository()
  const handleLoad = useCallback(async () => {
    setNowLoading(true)
    try {
      const data = await loadAll()
      setData(data)
    } catch (err) {
      setData({ rows: [], rowTypes: [] })
      alert(err)
    } finally {
      setNowLoading(false)
    }
  }, [loadAll, setNowLoading, setData])

  const [, dispatchToast] = Util.useToastContext()
  const handleSave = useCallback(async (data: { rows: RowObject[], rowTypes: RowType[] }) => {
    await saveAll(data)
    setData(await loadAll())
    dispatchToast(msg => msg.info('保存しました。'))
  }, [saveAll, loadAll, setNowLoading, dispatchToast])

  useEffect(() => {
    handleLoad()
  }, [])

  // アプリ設定
  const [appSettingsOpened, dispatchOpenAppSettings] = Util.useToggle()
  const openDialog = useCallback(() => {
    dispatchOpenAppSettings(state => state.setValue(true))
  }, [dispatchOpenAppSettings])
  const onCloseDialog = useCallback(() => {
    dispatchOpenAppSettings(state => state.setValue(false))
  }, [dispatchOpenAppSettings])

  if (nowLoading) return (
    <span>読み込み中...</span>
  )

  return <>
    <AfterLoaded
      rowTypeData={rowTypes}
      rowData={rows}
      onSave={handleSave}
      nowSaving={nowSaving}
      className="p-1 flex-1 overflow-hidden"
      style={debugStyle}
    >
      <Input.IconButton hideText icon={ArrowPathIcon} onClick={handleLoad} className="p-1">再読み込み</Input.IconButton>
      <Input.IconButton hideText icon={Cog6ToothIcon} onClick={openDialog} className="p-1">設定</Input.IconButton>
    </AfterLoaded>

    <AppSttingsDialog
      open={appSettingsOpened}
      onClose={onCloseDialog}
    />
  </>
}

const AfterLoaded = ({ rowData, rowTypeData, onSave, nowSaving, className, style, children }: {
  rowData: RowObject[]
  rowTypeData: RowType[]
  onSave: (data: { rows: RowObject[], rowTypes: RowType[] }) => void
  nowSaving: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) => {

  const gridRef = useRef<Collection.DataTableRef<GridRow>>(null)
  const [activeRow, setActiveRow] = useState<{ rowIndex: number }>()

  // サイドメニュー
  const [showSideMenu, dispatchShowSideMenu] = Util.useToggle(true)
  const toggleSideMenu = useCallback(() => {
    dispatchShowSideMenu(state => state.toggle())
  }, [dispatchShowSideMenu])

  // RowType
  const [{ rowTypeMap }, dispatchRowType] = useRowTypeMap()
  useEffect(() => {
    dispatchRowType(state => state.init(rowTypeData))
  }, [rowTypeData])

  // 行
  const { control, reset } = Util.useFormEx<PageFormState>({})
  const { fields, insert, update, remove } = useFieldArray({ control, name: 'gridRows' })
  useEffect(() => {
    reset({ gridRows: toGridRows(rowData) })
  }, [rowData])

  // 列
  const [columnCount, setColumnCount] = useState(4)
  const [indentSize, setIndentSize] = useState(24)
  const columnDefs = useMemo((): Collection.ColumnDefEx<GridRow>[] => [
    // ラベルの列
    {
      id: 'col0',
      header: '　',
      size: 640,
      cell: cellProps => {
        const bgColor = cellProps.row.original.type === 'rowType' ? ROWTYPE_STYLE : ''
        const comments = cellProps.row.original.type === 'row'
          ? cellProps.row.original.item.comments
          : (rowTypeMap.get(cellProps.row.original.rowTypeId)?.comments ?? [])

        return (
          <div className={`flex ${bgColor}`}>
            <RowStateBar state={getRowEditState(cellProps.row.original, rowTypeMap)} />
            <Indent row={cellProps.row.original} indentSize={indentSize} />
            <span className="inline-block flex-1 px-1 overflow-hidden whitespace-nowrap">
              {getLabelCellValue(cellProps.row.original, rowTypeMap)}&nbsp;
            </span>
            {comments.length > 0 && (
              <ChatBubbleLeftEllipsisIcon className="text-color-5 w-4 h-4" />
            )}
          </div>
        )

      },
      accessorFn: data => getLabelCellValue(data, rowTypeMap),
      editSetting: {
        type: 'text',
        getTextValue: data => getLabelCellValue(data, rowTypeMap),
        setTextValue: (row, value) => {
          if (row.type === 'row') {
            row.item.willBeChanged = true
          }
          const { updatedRowType } = setLabelCellValue(row, rowTypeMap, value)
          if (updatedRowType) {
            updatedRowType.willBeChanged = true
            dispatchRowType(state => state.set({ ...updatedRowType }))
          }
        },
      },
    },

    // 属性の列
    ...Array.from({ length: columnCount }, (_, i) => i).map<Collection.ColumnDefEx<GridRow>>(i => ({
      id: `col${i + 1}`,
      header: '　',
      cell: cellProps => {
        const bgColor = cellProps.row.original.type === 'rowType' ? ROWTYPE_STYLE : ''
        return (
          <span className={`block w-full px-1 overflow-hidden whitespace-nowrap ${bgColor}`}>
            {getAttrCellValue(cellProps.row.original, rowTypeMap, i)}&nbsp;
          </span>
        )
      },
      accessorFn: data => getAttrCellValue(data, rowTypeMap, i),
      editSetting: {
        type: 'text',
        getTextValue: data => getAttrCellValue(data, rowTypeMap, i),
        setTextValue: (row, value) => {
          if (row.type === 'row') {
            row.item.willBeChanged = true
          }
          const { updatedRowType } = setAttrCellValue(row, rowTypeMap, i, value)
          if (updatedRowType) {
            updatedRowType.willBeChanged = true
            dispatchRowType(state => state.set({ ...updatedRowType }))
          }
        },
      },
    }))
  ], [columnCount, indentSize, rowTypeMap, update, dispatchRowType])

  // -------------------------------------
  // 更新
  const editRowObject = useEditRowObject(fields, insert, update, remove)
  const changeRowType: UseFieldArrayReturnType['update'] = useCallback((index, updatedRow) => {
    editRowObject([index, index], rows => {
      return rows.map(row => ({
        ...row,
        item: {
          ...row.item,
          type: (updatedRow as GridRowOfRowObject).item.type,
          willBeChanged: true,
        },
      }))
    })
  }, [editRowObject])

  // 保存
  const handleSave = useCallback(() => {
    if (!nowSaving) {
      onSave({
        rows: fields.filter(x => x.type === 'row').map(x => (x as GridRowOfRowObject).item),
        rowTypes: Array.from(rowTypeMap.values()),
      })
    }
  }, [nowSaving, onSave, rowTypeMap, fields])

  // -------------------------------------
  // 新規行型作成
  const [newRowTypeDialogOpened, dispatchNewRowTypeDialogOpened] = Util.useToggle()
  const openNewRowTypeDialog = useCallback(() => {
    dispatchNewRowTypeDialogOpened(state => state.setValue(true))
  }, [dispatchNewRowTypeDialogOpened])
  const onCloseNewRowTypeDialog = useCallback(() => {
    dispatchNewRowTypeDialogOpened(state => state.setValue(false))
  }, [dispatchNewRowTypeDialogOpened])
  const onCreateNewRowType = useCallback((newRowType: RowType) => {
    dispatchRowType(state => state.set(newRowType))
  }, [dispatchRowType])

  // -------------------------------------
  // イベント
  const handleAddRow = useCallback((nextRow?: boolean) => {
    const selectedRows = gridRef.current?.getSelectedRows()
    if (!selectedRows || selectedRows.length === 0) {
      const { newRow, newRowType } = insertNewRow(undefined)
      insert(0, newRow)
      if (newRowType !== undefined) dispatchRowType(state => state.set(newRowType))

    } else {
      const insertPoint = selectedRows[nextRow ? (selectedRows.length - 1) : 0]
      const insertIndex = nextRow ? (insertPoint.rowIndex + 1) : insertPoint.rowIndex
      const { newRow, newRowType } = insertNewRow(insertPoint.row)
      insert(insertIndex, newRow)
      if (newRowType !== undefined) dispatchRowType(state => state.set(newRowType))
    }
  }, [insert, dispatchRowType])
  const handleAddRowByButton = useCallback(() => {
    handleAddRow()
  }, [handleAddRow])

  const handleDeleteRows = useCallback(() => {
    if (!gridRef.current) return
    const deletedRowIndexes: number[] = []
    for (const { row, rowIndex } of gridRef.current.getSelectedRows()) {
      if (row.type === 'rowType') {
        continue
      } else if (row.item.existsInRemoteRepository) {
        row.item.willBeDeleted = true
        update(rowIndex, { ...row })
      } else {
        deletedRowIndexes.push(rowIndex)
      }
    }
    remove(deletedRowIndexes)
  }, [update, remove])

  const onPageKeyDown: React.KeyboardEventHandler = useCallback(e => {
    // Ctrl + S による保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      onSave({
        rows: fields.filter(x => x.type === 'row').map(x => (x as GridRowOfRowObject).item),
        rowTypes: Array.from(rowTypeMap.values()),
      })
      e.preventDefault()
    }
    // Ctrl + B によるサイドメニュー表示切替
    else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      toggleSideMenu()
      e.preventDefault()
    }
  }, [onSave, fields, rowTypeMap, toggleSideMenu])

  const onGridKeyDown: React.KeyboardEventHandler = useCallback(e => {
    // TABキーによるインデントの上げ下げ
    if (e.key === 'Tab') {
      const selectedRows = gridRef.current?.getSelectedRows()
      if (selectedRows === undefined) return
      for (const { row, rowIndex } of selectedRows) {
        if (row.type === 'rowType') continue
        row.item.indent = e.shiftKey
          ? Math.max(0, row.item.indent - 1)
          : (row.item.indent + 1)
        row.item.willBeChanged = true
        update(rowIndex, row)
      }
      e.preventDefault()
    }
    // Enter による行追加
    else if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        // カーソル位置に追加
        handleAddRow()
        e.preventDefault()
      } else {
        // カーソル位置の次の行に追加
        handleAddRow(true)
        e.preventDefault()
      }
    }
    // Shift + Delete による行削除
    else if (e.shiftKey && e.key === 'Delete') {
      handleDeleteRows()
      e.preventDefault()
    }
    // Alt + 上下 による行移動
    else if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      const selectedRows = gridRef.current?.getSelectedRows()
      if (selectedRows === undefined || selectedRows.length === 0) return
      const first = selectedRows[0].rowIndex
      const last = selectedRows[selectedRows.length - 1].rowIndex
      if (e.key === 'ArrowUp') {
        if (first === 0) return
        const above = getAboveRowObjectIndex(first, fields)
        if (above === undefined) return
        editRowObject([above, last], rows => {
          for (const row of rows) row.item.willBeChanged = true
          return moveArrayItem(rows, { from: 0, to: rows.length - 1 })
        })

      } else {
        if (last === (fields.length - 1)) return
        const below = getBelowRowObjectIndex(last, fields)
        if (below === undefined) return
        editRowObject([below, first], rows => {
          for (const row of rows) row.item.willBeChanged = true
          return moveArrayItem(rows, { from: rows.length - 1, to: 0 })
        })
      }
    }
  }, [update, handleAddRow, handleDeleteRows, fields, rowTypeMap, editRowObject])

  return <>
    <div onKeyDown={onPageKeyDown} className={`outline-none ${className ?? ''}`} tabIndex={0}>
      <PanelGroup direction="horizontal" className="w-full h-full" style={style}>
        <Panel className="flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            {nowSaving ? (
              <Input.IconButton onClick={handleSave} className="p-1" outline>保存中...</Input.IconButton>
            ) : (
              <Input.IconButton icon={InboxIcon} onClick={handleSave} hideText className="p-1" outline>保存（Ctrl + S）</Input.IconButton>
            )}
            <Input.IconButton icon={PlusIcon} onClick={handleAddRowByButton} hideText className="p-1">追加（Ctrl + Enter）</Input.IconButton>
            <Input.IconButton icon={TrashIcon} onClick={handleDeleteRows} hideText className="p-1">削除（Shift + Delete）</Input.IconButton>
            <Input.IconButton icon={CubeIcon} onClick={openNewRowTypeDialog} hideText className="p-1">種類新規作成</Input.IconButton>
            <div className="flex-1"></div>
            {children}
            <Input.IconButton icon={ChevronRightIcon} onClick={toggleSideMenu} hideText className="p-1">サイドメニュー表示（Ctrl + B）</Input.IconButton>
          </div>

          <Collection.DataTable
            ref={gridRef}
            data={fields}
            columns={columnDefs}
            onChangeRow={update}
            onKeyDown={onGridKeyDown}
            onActiveRowChanged={setActiveRow}
            className="flex-1 h-full"
          />

        </Panel>
        <PanelResizeHandle className={`w-2 ${showSideMenu ? '' : 'hidden'}`} />

        {/* 詳細ビュー */}
        <Panel defaultSize={25} className={`${showSideMenu ? '' : 'hidden'}`}>
          <DetailView
            row={activeRow?.rowIndex === undefined ? undefined : fields[activeRow.rowIndex]}
            rowIndex={activeRow?.rowIndex}
            rowTypeMap={rowTypeMap}
            updateRow={update}
            changeRowType={changeRowType}
            dispatchRowType={dispatchRowType}
          />
        </Panel>
      </PanelGroup>
    </div>

    <NewRowTypeDialog
      open={newRowTypeDialogOpened}
      onClose={onCloseNewRowTypeDialog}
      onCreate={onCreateNewRowType}
    />
  </>
}

// -----------------------------------
// サイドメニュー
type DetailViewProp = {
  row?: GridRow
  rowIndex?: number
  rowTypeMap: Map<RowTypeId, RowType>
  updateRow: UseFieldArrayReturnType['update']
  changeRowType: UseFieldArrayReturnType['update']
  dispatchRowType: RowTypeMapDispatcher
}

const DetailView = ({ row, rowIndex, rowTypeMap, changeRowType, updateRow, dispatchRowType }: DetailViewProp) => {

  const handleChangeRowType = useCallback((rowTypeId: RowTypeId | undefined) => {
    if (row?.type !== 'row' || rowIndex === undefined || rowTypeId === undefined) return
    changeRowType(rowIndex, { ...row, item: { ...row.item, type: rowTypeId, willBeChanged: true } })
  }, [row, rowIndex, changeRowType])

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex pb-1">
        <span className="flex-1 inline-block overflow-hidden text-ellipsis whitespace-nowrap">
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

// -----------------------------------
// UI部品
const RowStateBar = ({ state }: {
  state: Util.LocalRepositoryState
}) => {
  if (state === '+') {
    return <div className="w-2 self-stretch bg-lime-500"></div>
  } else if (state === '*') {
    return <div className="w-2 self-stretch bg-sky-500"></div>
  } else if (state === '-') {
    return <div className="w-2 self-stretch bg-rose-500"></div>
  } else {
    return <div className="w-2 self-stretch"></div>
  }
}

const Indent = ({ row, indentSize }: {
  row: GridRow
  indentSize: number
}) => {
  const style: React.CSSProperties = {
    flexBasis: row.type === 'row'
      ? row.item.indent * indentSize
      : undefined,
  }
  return (
    <div style={style}></div>
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
    <div key={comment.id} className="flex border-b border-color-3">
      <RowStateBar state={editState} />
      <div style={{ flexBasis: comment.indent * 28 }}></div>
      <div className="flex-1 flex flex-col border-b border-color-3">
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

// ---------------------------------------------
/** 新規行型作成ダイアログ */
const NewRowTypeDialog = ({ open, onClose, onCreate }: {
  open: boolean
  onClose: () => void
  onCreate: (rowType: RowType) => void
}) => {
  const { registerEx, handleSubmit } = Util.useFormEx<{ name?: string }>({})
  const onSave = useCallback((data: { name?: string }) => {
    onCreate?.(createNewRowType(data.name))
    onClose()
  }, [onCreate, onClose])

  return (
    <Collection.ModalDialog title="種類新規作成" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
        <Collection.VerticalForm.Container>
          <Collection.VerticalForm.Item label="名前">
            <Input.Word {...registerEx(`name`)} />
          </Collection.VerticalForm.Item>
          <Collection.VerticalForm.Item wide>
            <Input.IconButton fill submit>保存</Input.IconButton>
          </Collection.VerticalForm.Item>
        </Collection.VerticalForm.Container>
      </form>
    </Collection.ModalDialog>
  )
}
