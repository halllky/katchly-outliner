import React from 'react'
import * as RT from '@tanstack/react-table'
import { AsyncComboProps, SyncComboProps } from '..'

export type DataTableProps<T> = {
  data?: T[]
  onChangeRow?: (index: number, data: T) => void
  onKeyDown?: React.KeyboardEventHandler
  onActiveRowChanged?: (activeRow: { getRow: () => T, rowIndex: number } | undefined) => void
  columns?: ColumnDefEx<T>[]
  hideHeader?: boolean
  tableWidth?: 'fit' | 'dyanmic'
  className?: string
}
export type ColumnDefEx<TRow> = RT.ColumnDef<TRow> & {
  hidden?: boolean
  headerGroupName?: string
  editSetting?: ColumnEditSetting<TRow>
}

export type ColumnEditSetting<TRow, TOption = unknown> = {
  readOnly?: ((row: TRow) => boolean)
} & (TextColumnEditSetting<TRow>
  | TextareaColumndEditSetting<TRow>
  | SyncComboColumnEditSetting<TRow, TOption>
  | AsyncComboColumnEditSetting<TRow, TOption>)

type TextColumnEditSetting<TRow> = {
  type: 'text'
  getTextValue: (row: TRow) => string | undefined
  setTextValue: (row: TRow, value: string | undefined) => void
}
type TextareaColumndEditSetting<TRow> = {
  type: 'multiline-text'
  getTextValue: (row: TRow) => string | undefined
  setTextValue: (row: TRow, value: string | undefined) => void
}
type SyncComboColumnEditSetting<TRow, TOption = unknown> = {
  type: 'combo'
  getValueFromRow: (row: TRow) => TOption | undefined
  setValueToRow: (row: TRow, value: TOption | undefined) => void
  onClipboardCopy: (row: TRow) => string
  onClipboardPaste: (row: TRow, value: string) => void
  comboProps: SyncComboProps<TOption, TOption>
}
type AsyncComboColumnEditSetting<TRow, TOption = unknown> = {
  type: 'async-combo'
  getValueFromRow: (row: TRow) => TOption | undefined
  setValueToRow: (row: TRow, value: TOption | undefined) => void
  onClipboardCopy: (row: TRow) => string
  onClipboardPaste: (row: TRow, value: string) => void
  comboProps: AsyncComboProps<TOption, TOption>
}

export type DataTableRef<T> = {
  focus: () => void
  startEditing: () => void
  getSelectedRows: () => { row: T, rowIndex: number }[]
}
