import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { ArrowPathIcon, ChevronRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import * as Util from './__autoGenerated/util'
import * as Input from './__autoGenerated/input'
import * as Collection from './__autoGenerated/collection'
import createTestData from './MainPageTestData'
import { GridRow, GridRowOfRowObject, GridRowOfRowType, PageFormState, ROWTYPE_STYLE, RowObject, RowType, RowTypeId, UseFieldArrayReturnType, getAttrCellValue, getLabelCellValue, getRowEditState, insertNewRow, rowTypeMapReducer, setAttrCellValue, setLabelCellValue, toGridRows, useRecalculateGridRow } from './Types'
import { useKatchlyRepository } from './MainPageRepos'

export default function () {

  const divRef = useRef<HTMLDivElement>(null)

  return (
    <Util.ImeContextProvider elementRef={divRef.current}>
      <Util.ToastContextProvider>
        <Util.MsgContextProvider>
          <Util.InlineMessageList />
          <div className="h-full w-full" ref={divRef}>
            <Page />
          </div>
          <Util.Toast />
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

  // デバッグ用
  const [many, setMany] = useState<boolean | undefined>(true)
  const fromDebugData = useCallback(() => {
    setData(createTestData(many ?? false))
  }, [setData, many])

  const { post } = Util.useHttpRequest()
  const [, dispatchToast] = Util.useToastContext()
  const recreateDatabase = useCallback(async () => {
    if (window.confirm('DBを再作成します。データは全て削除されます。よろしいですか？')) {
      const response = await post('/WebDebugger/recreate-database')
      if (response.ok) {
        dispatchToast(msg => msg.info('DBを再作成しました。'))
      } else {
        dispatchToast(msg => msg.error('DBの再作成に失敗しました。'))
      }
    }
  }, [post, dispatchToast])

  // DBに保存
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

  if (nowLoading) return (
    <span>読み込み中...</span>
  )

  return (
    <AfterLoaded
      rowTypeData={rowTypes}
      rowData={rows}
      onSave={handleSave}
      className="p-1 h-full"
      style={debugStyle}
    >
      <Input.IconButton outline onClick={handleLoad} icon={ArrowPathIcon}>再読み込み</Input.IconButton>

      <div className="basis-2"></div>

      <Input.IconButton outline onClick={fromDebugData}>DEBUG</Input.IconButton>
      <label className="flex items-center">
        <Input.CheckBox value={many} onChange={setMany} />
        many
      </label>

      <div className="basis-2"></div>

      <Input.IconButton outline onClick={recreateDatabase}>DB再作成</Input.IconButton>
    </AfterLoaded>
  )
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
  const [{ rowTypeMap }, dispatchRowType] = useReducer(rowTypeMapReducer, undefined, () => ({ rowTypeMap: new Map() }))
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

        return (
          <div className={`flex ${bgColor}`}>
            <RowStateBar state={getRowEditState(cellProps.row.original, rowTypeMap)} />
            <Indent row={cellProps.row.original} indentSize={indentSize} />
            <span className="inline-block flex-1 px-1 overflow-hidden whitespace-nowrap">
              {getLabelCellValue(cellProps.row.original, rowTypeMap)}&nbsp;
            </span>
          </div>
        )

      },
      accessorFn: data => getLabelCellValue(data, rowTypeMap),
      setValue: (row, value) => {
        if (row.type === 'row') {
          row.item.willBeChanged = true
        }
        const { updatedRowType } = setLabelCellValue(row, rowTypeMap, value)
        if (updatedRowType) {
          updatedRowType.willBeChanged = true
          dispatchRowType(state => state.set({ ...updatedRowType }))
        }
      },
      cellEditor: (props, ref) => <Input.Word ref={ref} {...props} />,

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
      setValue: (row, value) => {
        if (row.type === 'row') {
          row.item.willBeChanged = true
        }
        const { updatedRowType } = setAttrCellValue(row, rowTypeMap, i, value)
        if (updatedRowType) {
          updatedRowType.willBeChanged = true
          dispatchRowType(state => state.set({ ...updatedRowType }))
        }
      },
      cellEditor: (props, ref) => <Input.Word ref={ref} {...props} />,
    }))
  ], [columnCount, indentSize, rowTypeMap, update, dispatchRowType])

  // -------------------------------------
  // 更新
  const recalculate = useRecalculateGridRow(fields, insert, update, remove)
  const changeRowType: UseFieldArrayReturnType['update'] = useCallback((index, row) => {
    update(index, row)
    recalculate([index, index])
  }, [update, recalculate])

  // 保存
  const handleSave = useCallback(() => {
    onSave({
      rows: fields.filter(x => x.type === 'row').map(x => (x as GridRowOfRowObject).item),
      rowTypes: Array.from(rowTypeMap.values()),
    })
  }, [onSave, rowTypeMap, fields])

  // -------------------------------------
  // イベント
  const handleAddRow = useCallback(() => {
    const selectedRows = gridRef.current?.getSelectedRows()
    if (!selectedRows || selectedRows.length === 0) {
      const { newRow, newRowType } = insertNewRow(undefined)
      insert(0, newRow)
      if (newRowType !== undefined) dispatchRowType(state => state.set(newRowType))
    } else {
      const insertPoint = selectedRows[0]
      const { newRow, newRowType } = insertNewRow(insertPoint.row)
      insert(insertPoint.rowIndex, newRow)
      if (newRowType !== undefined) dispatchRowType(state => state.set(newRowType))
    }
  }, [insert, dispatchRowType])

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
    // Ctrl + Enter による行追加
    else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAddRow()
      e.preventDefault()
    }
    // Shift + Delete による行削除
    else if (e.shiftKey && e.key === 'Delete') {
      handleDeleteRows()
      e.preventDefault()
    }
  }, [update, toggleSideMenu, handleAddRow, handleDeleteRows, onSave, fields, rowTypeMap])

  return (
    <PanelGroup direction="horizontal" className={className} style={style}>
      <Panel className="flex flex-col gap-1">
        <div className="flex gap-1 items-center">
          <Input.IconButton icon={PlusIcon} onClick={handleAddRow} hideText className="p-1">追加（Ctrl + Enter）</Input.IconButton>
          <Input.IconButton icon={TrashIcon} onClick={handleDeleteRows} hideText className="p-1">削除（Shift + Delete）</Input.IconButton>
          <Input.IconButton fill onClick={handleSave}>保存</Input.IconButton>
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
      <Panel defaultSize={25} className={`${showSideMenu ? '' : 'hidden'}`}>
        <DetailView
          row={activeRow?.rowIndex === undefined ? undefined : fields[activeRow.rowIndex]}
          rowIndex={activeRow?.rowIndex}
          rowTypeMap={rowTypeMap}
          changeRowType={changeRowType}
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
  changeRowType: UseFieldArrayReturnType['update']
}

const DetailView = (props: DetailViewProp) => {
  const row = props.row
  if (!row) return <></>
  return row.type === 'row' ? (
    <DetailViewOfRowObject {...props} row={row} />
  ) : (
    <DetailViewOfRowType {...props} row={row} />
  )
}
const DetailViewOfRowObject = ({ row, rowIndex, rowTypeMap, changeRowType }: DetailViewProp & { row: GridRowOfRowObject }) => {

  const handleChangeRowType = useCallback((rowTypeId: RowTypeId | undefined) => {
    if (rowIndex === undefined || rowTypeId === undefined) return
    changeRowType(rowIndex, { ...row, item: { ...row.item, type: rowTypeId, willBeChanged: true } })
  }, [row, rowIndex, changeRowType])

  return (
    <PanelGroup direction="vertical">
      <Panel id="panel-1" defaultSize={30}>
        <ReadonlyTextarea className="h-full">
          {row.item.text}
        </ReadonlyTextarea>
      </Panel>
      <PanelResizeHandle className="h-2" />
      <Panel id="panel-2">
        <table className="table-fixed border border-neutral-200">
          <tbody>
            <tr>
              <th>種別</th>
              <td>
                <RowTypeComboBox dataSource={rowTypeMap} value={row.item.type} onChange={handleChangeRowType} className="flex-1" />
              </td>
            </tr>
            <RowAttrsTR row={row} rowTypeMap={rowTypeMap} />
          </tbody>
        </table>
      </Panel>
    </PanelGroup>
  )
}
const DetailViewOfRowType = ({ row, rowTypeMap }: DetailViewProp & { row: GridRowOfRowType }) => {

  const typeName = useMemo(() => {
    return rowTypeMap.get(row.rowTypeId)?.name
  }, [row, rowTypeMap])

  return (
    <PanelGroup direction="vertical">
      <Input.Word value={typeName} />
    </PanelGroup>
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

const RowAttrsTR = ({ row, rowTypeMap }: {
  row: GridRowOfRowObject
  rowTypeMap: Map<RowTypeId, RowType>
}) => {
  const columns = useMemo(() => {
    const rowType = rowTypeMap.get(row.item.type)
    return rowType?.columns ?? []
  }, [row, rowTypeMap])

  return <>
    {columns.map(col => (
      <tr key={col.id}>
        <th>
          {col.name}
        </th>
        <td>
          {row.item.attrs[col.id]}
        </td>
      </tr>
    ))}
  </>
}

const ReadonlyTextarea = ({ children, className }: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <span className={`block overflow-y-scroll border border-neutral-200 select-all ${className ?? ''}`}>
      {children}
    </span>
  )
}
