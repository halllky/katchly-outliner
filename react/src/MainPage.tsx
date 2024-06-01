import { useEffect, useMemo, useReducer, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import * as Util from './__autoGenerated/util'
import * as Input from './__autoGenerated/input'
import * as Collection from './__autoGenerated/collection'
import createTestData from './MainPageTestData'
import { GridRow, RowObject, RowType, RowTypeId, getAttrCellValue, getLabelCellValue, setAttrCellValue, setLabelCellValue, toGridRows } from './Types'

export default function () {

  const { rowTypes, rows } = useMemo(() => {
    return createTestData()
  }, [])

  if (!rowTypes || !rows) return (
    <span>読み込み中...</span>
  )

  return (
    <AfterLoaded
      rowTypeData={rowTypes}
      rowData={rows}
    />
  )
}

const AfterLoaded = ({ rowData, rowTypeData }: {
  rowData: RowObject[]
  rowTypeData: RowType[]
}) => {

  // RowType
  const [{ rowTypeMap }, dispatchRowType] = useReducer(rowTypeMapReducer, undefined, () => ({ rowTypeMap: new Map() }))
  useEffect(() => {
    dispatchRowType(state => state.init(rowTypeData))
  }, [rowTypeData])

  // 行
  const { control, reset } = Util.useFormEx<PageFormState>({})
  const { fields, update } = useFieldArray({ control, name: 'gridRows' })
  useEffect(() => {
    reset({ gridRows: toGridRows(rowData) })
  }, [rowData])

  // 列
  const [columnCount, setColumnCount] = useState(4)
  const [indentSize, setIndentSize] = useState(24)
  const columnDefs = useMemo((): Collection.ColumnDefEx<Util.TreeNode<GridRow>>[] => [{
    id: 'col0',
    header: '　',
    cell: cellProps => {
      const value = getLabelCellValue(cellProps.row.original.item, rowTypeMap)
      const style: React.CSSProperties = { marginLeft: cellProps.row.original.item.indent * indentSize }
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap" style={style}>
          {value}&nbsp;
        </span>
      )
    },
    accessorFn: data => getLabelCellValue(data.item, rowTypeMap),
    setValue: (row, value) => {
      const { updatedRowType } = setLabelCellValue(row.item, rowTypeMap, value)
      if (updatedRowType) dispatchRowType(state => state.set({ ...updatedRowType }))
    },
    cellEditor: (props, ref) => <Input.Word ref={ref} {...props} />,

  }, ...Array.from({ length: columnCount }, (_, i) => i).map<Collection.ColumnDefEx<Util.TreeNode<GridRow>>>(i => ({
    id: `col${i + 1}`,
    header: '　',
    cell: cellProps => {
      const value = getAttrCellValue(cellProps.row.original.item, rowTypeMap, i)
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}&nbsp;
        </span>
      )
    },
    accessorFn: data => getAttrCellValue(data.item, rowTypeMap, i),
    setValue: (row, value) => {
      const { updatedRowType } = setAttrCellValue(row.item, rowTypeMap, i, value)
      if (updatedRowType) dispatchRowType(state => state.set({ ...updatedRowType }))
    },
    cellEditor: (props, ref) => <Input.Word ref={ref} {...props} />,
  }))], [columnCount, indentSize, rowTypeMap, update, dispatchRowType])

  return (
    <div>
      <Collection.DataTable
        data={fields}
        columns={columnDefs}
        onChangeRow={update}
      />
    </div>
  )
}

type PageFormState = {
  gridRows: GridRow[]
}

const rowTypeMapReducer = Util.defineReducer((state: {
  rowTypeMap: Map<RowTypeId, RowType>
}) => ({
  init: (rowTypes: RowType[]) => ({
    rowTypeMap: new Map(rowTypes.map(t => [t.id, t])),
  }),
  set: (rowType: RowType) => {
    const rowTypeMap = new Map(state.rowTypeMap)
    rowTypeMap.set(rowType.id, rowType)
    return { rowTypeMap }
  },
}))