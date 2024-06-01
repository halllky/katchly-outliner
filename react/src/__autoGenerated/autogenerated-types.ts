import { UUID } from 'uuidjs'
import * as Util from './util'

// ------------------ NIJO::BackgroundTaskEntity ------------------

// ------------------ Row ------------------
export type RowSaveCommand = {
  ID?: string
  Parent?: string
  Label?: string
  RowType?: Util.ItemKey
  Attrs?: AttrsSaveCommand[]
}

export const createRow = (): RowSaveCommand => ({
  ID: UUID.generate(),
  Attrs: [],
})

export type AttrsSaveCommand = {
  ColType?: Util.ItemKey
  Value?: string
}

export const createAttrs = (): AttrsSaveCommand => ({
})

export type RowSearchCondition = {
  ID?: string
  Parent?: string
  Label?: string
  RowType: Row_RowTypeSearchCondition
}
export type AttrsSearchCondition = {
  ColType: Attrs_ColTypeSearchCondition
  Value?: string
}
export type Row_RowTypeSearchCondition = {
  ID?: string
}
export type Attrs_ColTypeSearchCondition = {
  Parent: Attrs_ColType_ParentSearchCondition
  ColumnId?: string
  ColumnName?: string
}
export type Attrs_ColType_ParentSearchCondition = {
  ID?: string
}

export const createRowSearchCondition = (): RowSearchCondition => ({
    RowType: createRow_RowTypeSearchCondition(),
})
export const createAttrsSearchCondition = (): AttrsSearchCondition => ({
    ColType: createAttrs_ColTypeSearchCondition(),
})
export const createRow_RowTypeSearchCondition = (): Row_RowTypeSearchCondition => ({
})
export const createAttrs_ColTypeSearchCondition = (): Attrs_ColTypeSearchCondition => ({
    Parent: createAttrs_ColType_ParentSearchCondition(),
})
export const createAttrs_ColType_ParentSearchCondition = (): Attrs_ColType_ParentSearchCondition => ({
})

/** Rowの画面表示用データ */
export type RowDisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    ID?: string
    Parent?: string
    Label?: string
    RowType?: RowTypeRefInfo
  }
  child_Attrs?: AttrsDisplayData[]
}
/** Attrsの画面表示用データ */
export type AttrsDisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    ColType?: ColumnsRefInfo
    Value?: string
  }
}

/** 画面に表示されるデータ型を登録更新される粒度の型に変換します。 */
export const convertRowToLocalRepositoryItem = (displayData: RowDisplayData) => {
  const item0: Util.LocalRepositoryItem<RowSaveCommand> = {
    itemKey: displayData.localRepositoryItemKey,
    existsInRemoteRepository: displayData.existsInRemoteRepository,
    willBeChanged: displayData.willBeChanged,
    willBeDeleted: displayData.willBeDeleted,
    item: {
      ID: displayData?.own_members?.ID,
      Parent: displayData?.own_members?.Parent,
      Label: displayData?.own_members?.Label,
      RowType: displayData?.own_members?.RowType?.__instanceKey,
      Attrs: displayData.child_Attrs?.map(xAttrs => ({
        ColType: xAttrs?.own_members?.ColType?.__instanceKey,
        Value: xAttrs?.own_members?.Value,
      })),
    },
  }

  return [
    item0,
  ] as const
}

/** Rowを参照する他のデータの画面上に表示されるRowのデータ型。 */
export type RowRefInfo = {
  /** Rowのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のRowをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  ID?: string,
  Label?: string,
}

/** Attrsを参照する他のデータの画面上に表示されるAttrsのデータ型。 */
export type AttrsRefInfo = {
  /** Attrsのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のAttrsをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
    Label?: string,
  },
  ColType?: {
    Parent?: {
      ID?: string,
    },
    ColumnId?: string,
  },
  Value?: string,
}


// ------------------ RowType ------------------
export type RowTypeSaveCommand = {
  ID?: string
  Columns?: ColumnsSaveCommand[]
}

export const createRowType = (): RowTypeSaveCommand => ({
  ID: UUID.generate(),
  Columns: [],
})

export type ColumnsSaveCommand = {
  ColumnId?: string
  ColumnName?: string
}

export const createColumns = (): ColumnsSaveCommand => ({
  ColumnId: UUID.generate(),
})

export type RowTypeSearchCondition = {
  ID?: string
}
export type ColumnsSearchCondition = {
  ColumnId?: string
  ColumnName?: string
}

export const createRowTypeSearchCondition = (): RowTypeSearchCondition => ({
})
export const createColumnsSearchCondition = (): ColumnsSearchCondition => ({
})

/** RowTypeの画面表示用データ */
export type RowTypeDisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    ID?: string
  }
  child_Columns?: ColumnsDisplayData[]
}
/** Columnsの画面表示用データ */
export type ColumnsDisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    ColumnId?: string
    ColumnName?: string
  }
}

/** 画面に表示されるデータ型を登録更新される粒度の型に変換します。 */
export const convertRowTypeToLocalRepositoryItem = (displayData: RowTypeDisplayData) => {
  const item0: Util.LocalRepositoryItem<RowTypeSaveCommand> = {
    itemKey: displayData.localRepositoryItemKey,
    existsInRemoteRepository: displayData.existsInRemoteRepository,
    willBeChanged: displayData.willBeChanged,
    willBeDeleted: displayData.willBeDeleted,
    item: {
      ID: displayData?.own_members?.ID,
      Columns: displayData.child_Columns?.map(xColumns => ({
        ColumnId: xColumns?.own_members?.ColumnId,
        ColumnName: xColumns?.own_members?.ColumnName,
      })),
    },
  }

  return [
    item0,
  ] as const
}

/** RowTypeを参照する他のデータの画面上に表示されるRowTypeのデータ型。 */
export type RowTypeRefInfo = {
  /** RowTypeのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のRowTypeをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  ID?: string,
}

/** Columnsを参照する他のデータの画面上に表示されるColumnsのデータ型。 */
export type ColumnsRefInfo = {
  /** Columnsのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のColumnsをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
  },
  ColumnId?: string,
}


