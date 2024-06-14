import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { ArrowPathIcon, ChevronRightIcon, ChatBubbleLeftEllipsisIcon, Cog6ToothIcon, InboxIcon, PaperAirplaneIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import * as Util from './__autoGenerated/util'
import * as Input from './__autoGenerated/input'
import * as Collection from './__autoGenerated/collection'
import { Comment, CommentId, GridRow, GridRowOfRowObject, PageFormState, ROWTYPE_STYLE, RowObject, RowType, RowTypeId, RowTypeMapDispatcher, UseFieldArrayReturnType, countComment, createNewComment, getAboveRowObjectIndex, getAttrCellValue, getBelowRowObjectIndex, getLabelCellValue, getRowEditState, insertNewRow, moveArrayItem, setAttrCellValue, setLabelCellValue, toGridRows, useEditRowObject, useRowTypeMap } from './Types'
import { useKatchlyRepository } from './MainPageRepos'
import { AppSettingContext, AppSttingsDialog, useAppSettings } from './AppSettings'
import dayjs from 'dayjs'

export default function () {

  const divRef = useRef<HTMLDivElement>(null)

  return (
    <Util.ImeContextProvider elementRef={divRef.current}>
      <Util.ToastContextProvider>
        <Util.MsgContextProvider>
          <AppSettingContext>
            <Util.InlineMessageList />
            <div className="relative h-full w-full" ref={divRef}>
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
    fontFamily: '"BIZ UDGothic"',
  }), [])

  // データの読み込みと保存
  const { loadAll, saveAll } = useKatchlyRepository()
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

  const handleSave = useCallback(async (data: { rows: RowObject[], rowTypes: RowType[] }) => {
    await saveAll(data)
    setData(await loadAll())
  }, [saveAll, loadAll, setNowLoading])

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
      className="p-1 h-full"
      style={debugStyle}
    >
      <Input.IconButton hideText onClick={handleLoad} icon={ArrowPathIcon} className="p-1">再読み込み</Input.IconButton>
      <Input.IconButton hideText icon={Cog6ToothIcon} onClick={openDialog} className="p-1">設定</Input.IconButton>
    </AfterLoaded>

    <AppSttingsDialog
      open={appSettingsOpened}
      onClose={onCloseDialog}
    />
  </>
}

const AfterLoaded = ({ rowData, rowTypeData, onSave, className, style, children }: {
  rowData: RowObject[]
  rowTypeData: RowType[]
  onSave: (data: { rows: RowObject[], rowTypes: RowType[] }) => void
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
        const commentCount = countComment(cellProps.row.original, rowTypeMap)

        return (
          <div className={`flex ${bgColor}`}>
            <RowStateBar state={getRowEditState(cellProps.row.original, rowTypeMap)} />
            <Indent row={cellProps.row.original} indentSize={indentSize} />
            <span className="inline-block flex-1 px-1 overflow-hidden whitespace-nowrap">
              {getLabelCellValue(cellProps.row.original, rowTypeMap)}&nbsp;
            </span>
            {commentCount > 0 && (
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
        },
      }))
    })
  }, [editRowObject])

  // 保存
  const handleSave = useCallback(() => {
    onSave({
      rows: fields.filter(x => x.type === 'row').map(x => (x as GridRowOfRowObject).item),
      rowTypes: Array.from(rowTypeMap.values()),
    })
  }, [onSave, rowTypeMap, fields])

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

  const onKeyDown: React.KeyboardEventHandler = useCallback(e => {
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
    // Ctrl + S による保存
    else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
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
  }, [update, toggleSideMenu, handleAddRow, handleDeleteRows, onSave, fields, rowTypeMap, editRowObject])

  return (
    <PanelGroup direction="horizontal" className={className} style={style}>
      <Panel className="flex flex-col gap-1">
        <div className="flex gap-1 items-center">
          <Input.IconButton icon={InboxIcon} onClick={handleSave} hideText className="p-1" outline>保存（Ctrl + S）</Input.IconButton>
          <Input.IconButton icon={PlusIcon} onClick={handleAddRowByButton} hideText className="p-1">追加（Ctrl + Enter）</Input.IconButton>
          <Input.IconButton icon={TrashIcon} onClick={handleDeleteRows} hideText className="p-1">削除（Shift + Delete）</Input.IconButton>
          <div className="flex-1"></div>
          {children}
          <Input.IconButton icon={ChevronRightIcon} onClick={toggleSideMenu} hideText className="p-1">サイドメニュー表示（Ctrl + B）</Input.IconButton>
        </div>

        <Collection.DataTable
          ref={gridRef}
          data={fields}
          columns={columnDefs}
          onChangeRow={update}
          onKeyDown={onKeyDown}
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
  )
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
      <ThreadView
        row={row}
        rowIndex={rowIndex}
        onChange={updateRow}
        rowTypeMap={rowTypeMap}
        dispatchRowType={dispatchRowType}
        className="flex-1 overflow-hidden"
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
type ThreadViewMode
  = { mode: 'new' }
  | { mode: 'edit', editingCommentId: CommentId }
  | { mode: 'response', responseTo: CommentId }

const ThreadView = ({ row, rowIndex, onChange, rowTypeMap, dispatchRowType, className }: {
  row: GridRow | undefined
  rowIndex: number | undefined
  onChange: UseFieldArrayReturnType['update']
  rowTypeMap: Map<RowTypeId, RowType>
  dispatchRowType: RowTypeMapDispatcher
  className?: string
}) => {
  const { data: { userName } } = useAppSettings()
  const [viewMode, setViewMode] = useState<ThreadViewMode>(() => ({ mode: 'new' }))
  const selectedCommentId = useMemo(() => {
    if (viewMode.mode === 'new') {
      return undefined
    } else if (viewMode.mode === 'edit') {
      return viewMode.editingCommentId
    } else if (viewMode.mode === 'response') {
      return viewMode.responseTo
    }
  }, [viewMode])
  const asTree = useMemo(() => {
    if (!row) return []
    const threads = row.type === 'row'
      ? row.item.threads
      : rowTypeMap.get(row.rowTypeId)?.threads
    if (!threads) return []
    const tree = Util.toTree(threads, {
      getId: comment => comment.id,
      getChildren: comment => comment.responses,
    })
    return Util.flatten(tree)
  }, [row, rowTypeMap])

  // 新スレッド作成
  const tryCommitNewThread = useCallback((): boolean => {
    const text = textareaRef.current?.getValue()
    if (!onChange || !text || !userName || !row || rowIndex === undefined) return false
    console.log(1)
    const newThread = createNewComment(userName)
    newThread.text = text
    if (row.type === 'row') {
      const newRow: GridRowOfRowObject = {
        ...row,
        item: { ...row.item, threads: [...row.item.threads, newThread] },
      }
      onChange(rowIndex, newRow)
    } else {
      const rowType = rowTypeMap.get(row.rowTypeId)
      if (!rowType) return false
      const newRowType: RowType = {
        ...rowType,
        threads: [...rowType.threads, newThread],
      }
      dispatchRowType(state => state.set(newRowType))
    }
    return true
  }, [userName, row, rowIndex, rowTypeMap, onChange, dispatchRowType])

  // 返信
  const tryCommitResponse = useCallback((): boolean => {
    if (viewMode.mode !== 'response') throw new Error
    const text = textareaRef.current?.getValue()
    if (!onChange || !text || !userName || !row || rowIndex === undefined) return false
    // 返信対象オブジェクトの特定
    const threadsOwner: { threads: Comment[] } | undefined = row.type === 'row'
      ? row.item
      : rowTypeMap.get(row.rowTypeId)
    if (!threadsOwner) return false
    const flattenThreads = Util.flatten(Util.toTree(threadsOwner.threads, { getId: c => c.id, getChildren: c => c.responses }))
    const responseTo = flattenThreads.find(treeItem => treeItem.item.id === viewMode.responseTo)
    if (!responseTo) return false
    // 返信オブジェクトの作成
    const newResponse = createNewComment(userName)
    newResponse.text = text
    responseTo.item.responses = [...responseTo.item.responses, newResponse]
    // 発火
    if (row.type === 'row') {
      onChange(rowIndex, { ...row, item: { ...threadsOwner as RowObject } })
    } else if (row.type === 'rowType') {
      dispatchRowType(state => state.set({ ...threadsOwner as RowType }))
    }
    return true
  }, [viewMode, userName, row, rowIndex, rowTypeMap, onChange, dispatchRowType])

  // 既存コメントの修正
  const tryCommitEditing = useCallback((): boolean => {
    if (viewMode.mode !== 'edit') throw new Error
    const text = textareaRef.current?.getValue()
    if (!onChange || !text || !userName || !row || rowIndex === undefined) return false
    // 修正対象オブジェクトの特定
    const threadsOwner: { threads: Comment[] } | undefined = row.type === 'row'
      ? row.item
      : rowTypeMap.get(row.rowTypeId)
    if (!threadsOwner) return false
    const flattenThreads = Util.flatten(Util.toTree(threadsOwner.threads, { getId: c => c.id, getChildren: c => c.responses }))
    const editingComment = flattenThreads.find(treeItem => treeItem.item.id === viewMode.editingCommentId)
    if (!editingComment) return false
    // 更新後のオブジェクトの作成
    const updatedComment: Comment = {
      ...editingComment.item,
      text,
      updatedOn: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      willBeChanged: true,
    }
    let updatedArray: Comment[]
    if (editingComment.parent) {
      const index = editingComment.parent.item.responses.findIndex(c => c.id === viewMode.editingCommentId)
      updatedArray = [...editingComment.parent.item.responses]
      updatedArray.splice(index, 1, updatedComment)
    } else {
      const index = threadsOwner.threads.findIndex(c => c.id === viewMode.editingCommentId)
      updatedArray = [...threadsOwner.threads]
      updatedArray.splice(index, 1, updatedComment)
    }
    // 発火
    if (row.type === 'row') {
      onChange(rowIndex, {
        ...row,
        item: { ...row.item, threads: updatedArray },
      })
    } else if (row.type === 'rowType') {
      dispatchRowType(state => state.set({
        ...threadsOwner as RowType,
        threads: updatedArray,
      }))
    }
    return true
  }, [viewMode, userName, row, rowIndex, rowTypeMap, onChange, dispatchRowType])

  // 送信
  const textareaRef = useRef<Input.CustomComponentRef<string>>(null)
  const [newItemText, setNewItemText] = useState<string>()
  const commitComment = useCallback(() => {
    let clearState: boolean
    if (viewMode.mode === 'new') {
      clearState = tryCommitNewThread()
    } else if (viewMode.mode === 'edit') {
      clearState = tryCommitEditing()
    } else if (viewMode.mode === 'response') {
      clearState = tryCommitResponse()
    } else {
      throw new Error
    }
    if (clearState) {
      setViewMode({ mode: 'new' })
      setNewItemText('')
    }
  }, [viewMode, tryCommitNewThread, tryCommitEditing, tryCommitResponse, setNewItemText, setViewMode])

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>

      <div className="flex-1 flex flex-col overflow-y-scroll">
        {asTree.map(({ depth, item: comment }) => (
          <div key={comment.id} className="flex flex-col border-b border-color-3" style={{ paddingLeft: depth * 28 }}>
            <div className="flex flex-wrap text-xs text-color-5">
              {comment.author}
              <div className="flex-1"></div>
              {comment.createdOn}
            </div>
            <span className="text-sm whitespace-pre-wrap">
              {comment.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col pt-1 border-t border-color-5">
        <Input.Description
          ref={textareaRef}
          value={newItemText}
          onChange={setNewItemText}
          className="flex-1 h-8"
        />
        <Input.IconButton icon={PaperAirplaneIcon} className="self-end p-3" hideText onClick={commitComment}>
          コメント追加
        </Input.IconButton>
      </div>

    </div>
  )
}
