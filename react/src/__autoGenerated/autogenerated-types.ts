import { UUID } from 'uuidjs'
import * as Util from './util'

// ------------------ NIJO::BackgroundTaskEntity ------------------

// ------------------ Row ------------------
export type RowSaveCommand = {
  ID?: string
  Text?: string
  RowType?: Util.ItemKey
  Attrs?: AttrsSaveCommand[]
  Indent?: number
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
  Text?: string
  RowType: Row_RowTypeSearchCondition
  Indent: { From?: number, To?: number }
}
export type AttrsSearchCondition = {
  ColType: Attrs_ColTypeSearchCondition
  Value?: string
}
export type Row_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
}
export type Attrs_ColTypeSearchCondition = {
  Parent: Attrs_ColType_ParentSearchCondition
  ColumnId?: string
  ColumnName?: string
}
export type Attrs_ColType_ParentSearchCondition = {
  ID?: string
  RowTypeName?: string
}

export const createRowSearchCondition = (): RowSearchCondition => ({
    RowType: createRow_RowTypeSearchCondition(),
    Indent: {},
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
    Text?: string
    RowType?: RowTypeRefInfo
    Indent?: number
  }
  child_Attrs?: AttrsDisplayData[]
  ref_from_Row_RowOrder?: RowOrderDisplayData
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
      Text: displayData?.own_members?.Text,
      RowType: displayData?.own_members?.RowType?.__instanceKey,
      Indent: displayData?.own_members?.Indent,
      Attrs: displayData.child_Attrs?.map(xAttrs => ({
        ColType: xAttrs?.own_members?.ColType?.__instanceKey,
        Value: xAttrs?.own_members?.Value,
      })),
    },
  }

  const item1: Util.LocalRepositoryItem<RowOrderSaveCommand> | undefined = displayData?.ref_from_Row_RowOrder === undefined
    ? undefined
    : {
      itemKey: displayData.ref_from_Row_RowOrder.localRepositoryItemKey,
      existsInRemoteRepository: displayData.ref_from_Row_RowOrder.existsInRemoteRepository,
      willBeChanged: displayData.ref_from_Row_RowOrder.willBeChanged,
      willBeDeleted: displayData.ref_from_Row_RowOrder.willBeDeleted,
      item: {
        Row: displayData?.ref_from_Row_RowOrder?.own_members?.Row?.__instanceKey,
        Order: displayData?.ref_from_Row_RowOrder?.own_members?.Order,
      },
    }

  return [
    item0,
    item1,
  ] as const
}

/** Rowを参照する他のデータの画面上に表示されるRowのデータ型。 */
export type RowRefInfo = {
  /** Rowのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のRowをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  ID?: string,
  Text?: string,
}

/** Attrsを参照する他のデータの画面上に表示されるAttrsのデータ型。 */
export type AttrsRefInfo = {
  /** Attrsのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のAttrsをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
    Text?: string,
  },
  ColType?: {
    Parent?: {
      ID?: string,
    },
    ColumnId?: string,
  },
  Value?: string,
}


// ------------------ RowOrder ------------------
export type RowOrderSaveCommand = {
  Row?: Util.ItemKey
  Order?: number
}

export const createRowOrder = (): RowOrderSaveCommand => ({
})

export type RowOrderSearchCondition = {
  Row: RowOrder_RowSearchCondition
  Order: { From?: number, To?: number }
}
export type RowOrder_RowSearchCondition = {
  ID?: string
  Text?: string
  RowType: RowOrder_Row_RowTypeSearchCondition
  Indent: { From?: number, To?: number }
}
export type RowOrder_Row_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
}

export const createRowOrderSearchCondition = (): RowOrderSearchCondition => ({
    Row: createRowOrder_RowSearchCondition(),
    Order: {},
})
export const createRowOrder_RowSearchCondition = (): RowOrder_RowSearchCondition => ({
    RowType: createRowOrder_Row_RowTypeSearchCondition(),
    Indent: {},
})
export const createRowOrder_Row_RowTypeSearchCondition = (): RowOrder_Row_RowTypeSearchCondition => ({
})

/** RowOrderの画面表示用データ */
export type RowOrderDisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    Row?: RowRefInfo
    Order?: number
  }
}

/** 画面に表示されるデータ型を登録更新される粒度の型に変換します。 */
export const convertRowOrderToLocalRepositoryItem = (displayData: RowOrderDisplayData) => {
  const item0: Util.LocalRepositoryItem<RowOrderSaveCommand> = {
    itemKey: displayData.localRepositoryItemKey,
    existsInRemoteRepository: displayData.existsInRemoteRepository,
    willBeChanged: displayData.willBeChanged,
    willBeDeleted: displayData.willBeDeleted,
    item: {
      Row: displayData?.own_members?.Row?.__instanceKey,
      Order: displayData?.own_members?.Order,
    },
  }

  return [
    item0,
  ] as const
}

/** RowOrderを参照する他のデータの画面上に表示されるRowOrderのデータ型。 */
export type RowOrderRefInfo = {
  /** RowOrderのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のRowOrderをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Row?: {
    ID?: string,
    Text?: string,
  },
}


// ------------------ RowType ------------------
export type RowTypeSaveCommand = {
  ID?: string
  RowTypeName?: string
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
  RowTypeName?: string
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
    RowTypeName?: string
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
      RowTypeName: displayData?.own_members?.RowTypeName,
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


