import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import * as Layout from '../collection'
import * as Util from '../util'

const VForm = Layout.VerticalForm

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
        <Layout.DataTable
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

const COLUMN_DEFS: Layout.ColumnDefEx<GridRow>[] = [
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
    accessorFn: row => row.own_members?.JobId,
    editSetting: {
      type: 'text',
      getTextValue: row => row.own_members?.JobId,
      setTextValue: (row, value) => {
        row.own_members.JobId = value
      },
    },
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
    accessorFn: row => row.own_members?.Name,
    editSetting: {
      type: 'text',
      getTextValue: row => row.own_members?.Name,
      setTextValue: (row, value) => {
        row.own_members.Name = value
      },
    },
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
    accessorFn: row => row.own_members?.BatchType,
    editSetting: {
      type: 'text',
      getTextValue: row => row.own_members?.BatchType,
      setTextValue: (row, value) => {
        row.own_members.BatchType = value
      },
    },
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
    accessorFn: row => row.own_members?.ParameterJson,
    editSetting: {
      type: 'text',
      getTextValue: row => row.own_members?.ParameterJson,
      setTextValue: (row, value) => {
        row.own_members.ParameterJson = value
      },
    },
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
    accessorFn: row => row.own_members?.State,
    editSetting: (() => {
      const comboSetting: Layout.ColumnEditSetting<GridRow, 'WaitToStart' | 'Running' | 'Success' | 'Fault'> = {
        type: 'combo',
        getValueFromRow: row => row.own_members?.State,
        setValueToRow: (row, value) => {
          row.own_members.State = value
        },
        onClipboardCopy: row => {
          const formatted = row.own_members?.State ?? ''
          return formatted
        },
        onClipboardPaste: (row, value) => {
          if (row.own_members === undefined) return
          let formatted: 'WaitToStart' | 'Running' | 'Success' | 'Fault' | undefined
          if (value === 'WaitToStart') {
            formatted = 'WaitToStart'
          } else if (value === 'Running') {
            formatted = 'Running'
          } else if (value === 'Success') {
            formatted = 'Success'
          } else if (value === 'Fault') {
            formatted = 'Fault'
          } else {
            formatted = undefined
          }
          row.own_members.State = formatted
        },
        comboProps: {
          options: ['WaitToStart' as const, 'Running' as const, 'Success' as const, 'Fault' as const],
          emitValueSelector: opt => opt,
          matchingKeySelectorFromEmitValue: value => value,
          matchingKeySelectorFromOption: opt => opt,
          textSelector: opt => opt,
        },
      }
      return comboSetting as Layout.ColumnEditSetting<GridRow, unknown>
    })(),
  },
  {
    id: 'col6',
    header: 'RequestTime',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.RequestTime
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: row => row.own_members?.RequestTime,
    editSetting: {
      type: 'text',
      getTextValue: row => row.own_members?.RequestTime,
      setTextValue: (row, value) => {
        const { result: formatted } = Util.tryParseAsDateTimeOrEmpty(value)
        row.own_members.RequestTime = formatted
      },
    },
  },
  {
    id: 'col7',
    header: 'StartTime',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.StartTime
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: row => row.own_members?.StartTime,
    editSetting: {
      type: 'text',
      getTextValue: row => row.own_members?.StartTime,
      setTextValue: (row, value) => {
        const { result: formatted } = Util.tryParseAsDateTimeOrEmpty(value)
        row.own_members.StartTime = formatted
      },
    },
  },
  {
    id: 'col8',
    header: 'FinishTime',
    cell: cellProps => {
      const value = cellProps.row.original.own_members?.FinishTime
      return (
        <span className="block w-full px-1 overflow-hidden whitespace-nowrap">
          {value}
          &nbsp; {/* <= すべての値が空の行がつぶれるのを防ぐ */}
        </span>
      )
    },
    accessorFn: row => row.own_members?.FinishTime,
    editSetting: {
      type: 'text',
      getTextValue: row => row.own_members?.FinishTime,
      setTextValue: (row, value) => {
        const { result: formatted } = Util.tryParseAsDateTimeOrEmpty(value)
        row.own_members.FinishTime = formatted
      },
    },
  },
]
