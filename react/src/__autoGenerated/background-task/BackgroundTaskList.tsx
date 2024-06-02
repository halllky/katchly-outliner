import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import * as Collection from '../collection'
import * as Util from '../util'

const VForm = Collection.VerticalForm

export const BackgroundTaskList = () => {

  const { get } = Util.useHttpRequest()
  const [rows, setRows] = useState<GridRow[]>()

  useEffect(() => {
    get(`/api/NIJOBackgroundTaskEntity/ls`).then(res => {
      if (res.ok) setRows(res.data as GridRow[])
    })
  }, [])

  return (
    <VForm.Container label="バックグラウンドプロセス">
      <VForm.Item wide>
        <Collection.DataTable
          data={rows}
          columns={COLUMN_DEFS}
          className="h-64"
        />
      </VForm.Item>
    </VForm.Container>
  )
}

type GridRow = {
  own_members: {
    JobId?: string
    Name?: string
    BatchType?: string
    ParameterJson?: string
    State?: 'WaitToStart' | 'Running' | 'Success' | 'Fault'
    RequestTime?: string
    StartTime?: string
    FinishTime?: string
  }
}

const COLUMN_DEFS: Collection.ColumnDefEx<GridRow>[] = [
{
    id: 'col1',
    header: 'JobId',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.JobId
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: data => data.own_members?.JobId,
  },
  {
    id: 'col2',
    header: 'Name',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.Name
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: data => data.own_members?.Name,
  },
  {
    id: 'col3',
    header: 'BatchType',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.BatchType
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: data => data.own_members?.BatchType,
  },
  {
    id: 'col4',
    header: 'ParameterJson',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.ParameterJson
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: data => data.own_members?.ParameterJson,
  },
  {
    id: 'col5',
    header: 'State',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.State
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: data => data.own_members?.State,
  },
  {
    id: 'col6',
    header: 'RequestTime',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.RequestTime
      const formatted = value == undefined
        ? ''
        : dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {formatted}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: data => data.own_members?.RequestTime,
  },
  {
    id: 'col7',
    header: 'StartTime',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.StartTime
      const formatted = value == undefined
        ? ''
        : dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {formatted}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: data => data.own_members?.StartTime,
  },
  {
    id: 'col8',
    header: 'FinishTime',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.FinishTime
      const formatted = value == undefined
        ? ''
        : dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {formatted}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: data => data.own_members?.FinishTime,
  },
]
