import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { ArrowPathIcon, ChatBubbleLeftEllipsisIcon, Cog6ToothIcon, InboxIcon, PlusIcon, CubeIcon, MinusIcon } from '@heroicons/react/24/outline'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import * as Util from '../__autoGenerated/util'
import * as Input from '../__autoGenerated/input'
import * as Collection from '../__autoGenerated/collection'
import { GridRow, GridRowOfRowObject, PageFormState, ROWTYPE_STYLE, RowObject, RowType, UseFieldArrayReturnType, createNewRowType, getAboveRowObjectIndex, getAttrCellValue, getBelowRowObjectIndex, getLabelCellValue, getRowEditState, insertNewRow, moveArrayItem, setAttrCellValue, setLabelCellValue, toGridRows, useEditRowObject, useRowTypeMap } from './Types'
import { useKatchlyRepository } from './MainPageRepos'
import { AppSetting, AppSettingContext, AppSttingsDialog, useAppSettings } from './AppSettings'
import { RowStateBar } from './RowStateBar'
import { DetailView, DetailViewRef } from './DetailView'

import './main-page-style.css'

export default function () {

  const divRef = useRef<HTMLDivElement>(null)
  const appStyle = useMemo((): React.CSSProperties => ({
    fontFamily: '"Cascadia Mono", "BIZ UDGothic"',
  }), [])

  return (
    <Util.ImeContextProvider elementRef={divRef.current}>
      <Util.ToastContextProvider>
        <Util.MsgContextProvider>
          <AppSettingContext>
            <div className="relative h-full w-full flex flex-col bg-color-2" ref={divRef} style={appStyle}>
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
      nowSaving={nowSaving}
      className="flex-1 overflow-hidden"
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

  // 画面初期表示時にグリッドにフォーカス
  useEffect(() => {
    gridRef.current?.focus()
  }, [gridRef])

  const { data: appSettings, save: saveAppSettings } = useAppSettings()
  const { detailViewPosition, windowTitle } = appSettings
  useEffect(() => {
    document.title = windowTitle ?? ''
  }, [windowTitle])

  // サイドメニュー
  const toggleSideMenu = useCallback(() => {
    let detailViewPosition: typeof appSettings['detailViewPosition']
    if (appSettings.detailViewPosition === 'bottom') {
      detailViewPosition = ''
    } else if (appSettings.detailViewPosition === 'right') {
      detailViewPosition = 'bottom'
    } else {
      detailViewPosition = 'right'
    }
    saveAppSettings({ ...appSettings, detailViewPosition })
  }, [appSettings, saveAppSettings])

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
      header: '',
      size: 640,
      cell: cellProps => {
        const bgColor = cellProps.row.original.type === 'rowType' ? `border-l border-color-4 ${ROWTYPE_STYLE}` : ''
        const comments = cellProps.row.original.type === 'row'
          ? cellProps.row.original.item.comments
          : (rowTypeMap.get(cellProps.row.original.rowTypeId)?.comments ?? [])

        return (
          <div className="flex">
            <RowStateBar state={getRowEditState(cellProps.row.original, rowTypeMap)} />
            <Indent row={cellProps.row.original} indentSize={indentSize} />
            <div className={`flex-1 flex overflow-hidden ${bgColor}`}>
              <span className="inline-block flex-1 px-1 overflow-hidden whitespace-nowrap text-ellipsis">
                {getLabelCellValue(cellProps.row.original, rowTypeMap)}&nbsp;
              </span>
              {comments.length > 0 && (
                <ChatBubbleLeftEllipsisIcon className="text-color-5 w-4 h-4" />
              )}
            </div>
          </div>
        )

      },
      accessorFn: data => getLabelCellValue(data, rowTypeMap),
      editSetting: {
        type: 'multiline-text',
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
          <span className={`block w-full px-1 overflow-hidden whitespace-nowrap text-ellipsis ${bgColor}`}>
            {getAttrCellValue(cellProps.row.original, rowTypeMap, i)}&nbsp;
          </span>
        )
      },
      accessorFn: data => getAttrCellValue(data, rowTypeMap, i),
      editSetting: {
        type: 'multiline-text',
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
  Util.usePageOutPrompt()

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

  const detailViewRef = useRef<DetailViewRef>(null)
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
    // Ctrl + K による詳細欄フォーカス
    else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      detailViewRef.current?.focus()
      e.preventDefault()
    }
  }, [onSave, fields, rowTypeMap, toggleSideMenu, detailViewRef])

  const onEscapeInDetailView = useCallback(() => {
    gridRef.current?.focus()
  }, [gridRef])

  const onGridKeyDown: React.KeyboardEventHandler = useCallback(e => {
    // TABキーによるインデントの上げ下げ
    if (e.key === 'Tab') {
      const selectedRowIndexes = gridRef.current?.getSelectedRows().map(({ rowIndex }) => rowIndex)
      if (selectedRowIndexes === undefined) return
      editRowObject([Math.min(...selectedRowIndexes), Math.max(...selectedRowIndexes)], rows => rows.map(row => ({
        ...row,
        item: {
          ...row.item,
          indent: e.shiftKey
            ? Math.max(0, row.item.indent - 1)
            : (row.item.indent + 1),
          willBeChanged: true,
        },
      })))
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
      <PanelGroup
        direction={detailViewPosition === 'bottom' ? 'vertical' : 'horizontal'}
        className="w-full h-full"
        style={style}
      >
        <Panel className="flex flex-col">
          <div className="flex gap-1 items-center px-px h-main-page-header border-b border-color-3">
            <div className="basis-44">
              <Input.IconButton icon={InboxIcon} onClick={handleSave} className="p-1" outline>
                {nowSaving ? '保存中...' : '保存（Ctrl + S）'}
              </Input.IconButton>
            </div>
            <Input.IconButton icon={PlusIcon} onClick={handleAddRowByButton} hideText className="p-1">追加（Ctrl + Enter）</Input.IconButton>
            <Input.IconButton icon={MinusIcon} onClick={handleDeleteRows} hideText className="p-1">削除（Shift + Delete）</Input.IconButton>
            <Input.IconButton icon={CubeIcon} onClick={openNewRowTypeDialog} hideText className="p-1">種類新規作成</Input.IconButton>
            <div className="flex-1"></div>
            {children}
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
        <PanelResizeHandle className={getDetailViewResizeHandleClass(detailViewPosition)}>
          {/* アクションボタン欄とテーブルの間の境目 */}
          {detailViewPosition === 'right' && (
            <div className="h-main-page-header border-b border-color-3">&nbsp;</div>
          )}
        </PanelResizeHandle>

        {/* 詳細ビュー */}
        <Panel defaultSize={25} className={`${detailViewPosition ? '' : 'hidden'}`}>
          <DetailView
            ref={detailViewRef}
            row={activeRow?.rowIndex === undefined ? undefined : fields[activeRow.rowIndex]}
            rowIndex={activeRow?.rowIndex}
            rowTypeMap={rowTypeMap}
            updateRow={update}
            changeRowType={changeRowType}
            dispatchRowType={dispatchRowType}
            onEscape={onEscapeInDetailView}
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

// -----------------------------------
// UI部品

const Indent = ({ row, indentSize }: {
  row: GridRow
  indentSize: number
}) => {
  const style: React.CSSProperties = {
    flexBasis: row.type === 'row'
      ? row.item.indent * indentSize
      : row.indent * indentSize,
  }
  return (
    <div style={style}></div>
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

const getDetailViewResizeHandleClass = (state: AppSetting['detailViewPosition']): string => {
  if (state === 'bottom') return 'h-1'
  if (state === 'right') return 'w-1'
  return 'hidden'
}
