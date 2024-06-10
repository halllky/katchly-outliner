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
  CreatedOn?: string
  CreateUser?: string
  UpdatedOn?: string
  UpdateUser?: string
}

export const createRow = (): RowSaveCommand => ({
  ID: UUID.generate(),
  Attrs: [],
})

export type AttrsSaveCommand = {
  ColType?: Util.ItemKey
  Value?: string
  UpdatedOn?: string
}

export const createAttrs = (): AttrsSaveCommand => ({
})

export type RowSearchCondition = {
  ID?: string
  Text?: string
  RowType: Row_RowTypeSearchCondition
  Indent: { From?: number, To?: number }
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type AttrsSearchCondition = {
  ColType: Attrs_ColTypeSearchCondition
  Value?: string
  UpdatedOn: { From?: string, To?: string }
}
export type Row_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type Attrs_ColTypeSearchCondition = {
  Parent: Attrs_ColType_ParentSearchCondition
  ColumnId?: string
  ColumnName?: string
}
export type Attrs_ColType_ParentSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}

export const createRowSearchCondition = (): RowSearchCondition => ({
    RowType: createRow_RowTypeSearchCondition(),
    Indent: {},
    CreatedOn: {},
    UpdatedOn: {},
})
export const createAttrsSearchCondition = (): AttrsSearchCondition => ({
    ColType: createAttrs_ColTypeSearchCondition(),
    UpdatedOn: {},
})
export const createRow_RowTypeSearchCondition = (): Row_RowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createAttrs_ColTypeSearchCondition = (): Attrs_ColTypeSearchCondition => ({
    Parent: createAttrs_ColType_ParentSearchCondition(),
})
export const createAttrs_ColType_ParentSearchCondition = (): Attrs_ColType_ParentSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
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
    CreatedOn?: string
    CreateUser?: string
    UpdatedOn?: string
    UpdateUser?: string
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
    UpdatedOn?: string
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
      CreatedOn: displayData?.own_members?.CreatedOn,
      CreateUser: displayData?.own_members?.CreateUser,
      UpdatedOn: displayData?.own_members?.UpdatedOn,
      UpdateUser: displayData?.own_members?.UpdateUser,
      Attrs: displayData.child_Attrs?.map(xAttrs => ({
        ColType: xAttrs?.own_members?.ColType?.__instanceKey,
        Value: xAttrs?.own_members?.Value,
        UpdatedOn: xAttrs?.own_members?.UpdatedOn,
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
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type RowOrder_Row_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}

export const createRowOrderSearchCondition = (): RowOrderSearchCondition => ({
    Row: createRowOrder_RowSearchCondition(),
    Order: {},
})
export const createRowOrder_RowSearchCondition = (): RowOrder_RowSearchCondition => ({
    RowType: createRowOrder_Row_RowTypeSearchCondition(),
    Indent: {},
    CreatedOn: {},
    UpdatedOn: {},
})
export const createRowOrder_Row_RowTypeSearchCondition = (): RowOrder_Row_RowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
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
  CreatedOn?: string
  CreateUser?: string
  UpdatedOn?: string
  UpdateUser?: string
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
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type ColumnsSearchCondition = {
  ColumnId?: string
  ColumnName?: string
}

export const createRowTypeSearchCondition = (): RowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
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
    CreatedOn?: string
    CreateUser?: string
    UpdatedOn?: string
    UpdateUser?: string
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
      CreatedOn: displayData?.own_members?.CreatedOn,
      CreateUser: displayData?.own_members?.CreateUser,
      UpdatedOn: displayData?.own_members?.UpdatedOn,
      UpdateUser: displayData?.own_members?.UpdateUser,
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


// ------------------ Comment ------------------
export type CommentSaveCommand = {
  ID?: string
  Text?: string
  Author?: string
  CreatedOn?: string
  UpdatedOn?: string
  Target?: 'CommentTargetRow' | 'CommentTargetCell' | 'CommentTargetRowType' | 'CommentTargetColumn' | 'CommentTargetComment'
  CommentTargetRow?: CommentTargetRowSaveCommand
  CommentTargetCell?: CommentTargetCellSaveCommand
  CommentTargetRowType?: CommentTargetRowTypeSaveCommand
  CommentTargetColumn?: CommentTargetColumnSaveCommand
  CommentTargetComment?: CommentTargetCommentSaveCommand
}

export const createComment = (): CommentSaveCommand => ({
  ID: UUID.generate(),
  CommentTargetRow: createCommentTargetRow(),
  CommentTargetCell: createCommentTargetCell(),
  CommentTargetRowType: createCommentTargetRowType(),
  CommentTargetColumn: createCommentTargetColumn(),
  CommentTargetComment: createCommentTargetComment(),
  Target: 'CommentTargetRow',
})

export type CommentTargetRowSaveCommand = {
  Row?: Util.ItemKey
}

export const createCommentTargetRow = (): CommentTargetRowSaveCommand => ({
})

export type CommentTargetCellSaveCommand = {
  Cell?: Util.ItemKey
}

export const createCommentTargetCell = (): CommentTargetCellSaveCommand => ({
})

export type CommentTargetRowTypeSaveCommand = {
  RowType?: Util.ItemKey
}

export const createCommentTargetRowType = (): CommentTargetRowTypeSaveCommand => ({
})

export type CommentTargetColumnSaveCommand = {
  Column?: Util.ItemKey
}

export const createCommentTargetColumn = (): CommentTargetColumnSaveCommand => ({
})

export type CommentTargetCommentSaveCommand = {
  CommentId?: string
}

export const createCommentTargetComment = (): CommentTargetCommentSaveCommand => ({
  CommentId: UUID.generate(),
})

export type CommentSearchCondition = {
  ID?: string
  Text?: string
  Author?: string
  CreatedOn: { From?: string, To?: string }
  UpdatedOn: { From?: string, To?: string }
  Target_CommentTargetRow?: boolean
  Target_CommentTargetCell?: boolean
  Target_CommentTargetRowType?: boolean
  Target_CommentTargetColumn?: boolean
  Target_CommentTargetComment?: boolean
  CommentTargetRow: CommentTargetRowSearchCondition
  CommentTargetCell: CommentTargetCellSearchCondition
  CommentTargetRowType: CommentTargetRowTypeSearchCondition
  CommentTargetColumn: CommentTargetColumnSearchCondition
  CommentTargetComment: CommentTargetCommentSearchCondition
}
export type CommentTargetRowSearchCondition = {
  Row: CommentTargetRow_RowSearchCondition
}
export type CommentTargetCellSearchCondition = {
  Cell: CommentTargetCell_CellSearchCondition
}
export type CommentTargetRowTypeSearchCondition = {
  RowType: CommentTargetRowType_RowTypeSearchCondition
}
export type CommentTargetColumnSearchCondition = {
  Column: CommentTargetColumn_ColumnSearchCondition
}
export type CommentTargetCommentSearchCondition = {
  CommentId?: string
}
export type CommentTargetRow_RowSearchCondition = {
  ID?: string
  Text?: string
  RowType: CommentTargetRow_Row_RowTypeSearchCondition
  Indent: { From?: number, To?: number }
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type CommentTargetRow_Row_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type CommentTargetCell_CellSearchCondition = {
  Parent: CommentTargetCell_Cell_ParentSearchCondition
  ColType: CommentTargetCell_Cell_ColTypeSearchCondition
  Value?: string
  UpdatedOn: { From?: string, To?: string }
}
export type CommentTargetCell_Cell_ParentSearchCondition = {
  ID?: string
  Text?: string
  RowType: CommentTargetCell_Cell_Parent_RowTypeSearchCondition
  Indent: { From?: number, To?: number }
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type CommentTargetCell_Cell_Parent_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type CommentTargetCell_Cell_ColTypeSearchCondition = {
  Parent: CommentTargetCell_Cell_ColType_ParentSearchCondition
  ColumnId?: string
  ColumnName?: string
}
export type CommentTargetCell_Cell_ColType_ParentSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type CommentTargetRowType_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
export type CommentTargetColumn_ColumnSearchCondition = {
  Parent: CommentTargetColumn_Column_ParentSearchCondition
  ColumnId?: string
  ColumnName?: string
}
export type CommentTargetColumn_Column_ParentSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}

export const createCommentSearchCondition = (): CommentSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
    CommentTargetRow: createCommentTargetRowSearchCondition(),
    CommentTargetCell: createCommentTargetCellSearchCondition(),
    CommentTargetRowType: createCommentTargetRowTypeSearchCondition(),
    CommentTargetColumn: createCommentTargetColumnSearchCondition(),
    CommentTargetComment: createCommentTargetCommentSearchCondition(),
})
export const createCommentTargetRowSearchCondition = (): CommentTargetRowSearchCondition => ({
    Row: createCommentTargetRow_RowSearchCondition(),
})
export const createCommentTargetCellSearchCondition = (): CommentTargetCellSearchCondition => ({
    Cell: createCommentTargetCell_CellSearchCondition(),
})
export const createCommentTargetRowTypeSearchCondition = (): CommentTargetRowTypeSearchCondition => ({
    RowType: createCommentTargetRowType_RowTypeSearchCondition(),
})
export const createCommentTargetColumnSearchCondition = (): CommentTargetColumnSearchCondition => ({
    Column: createCommentTargetColumn_ColumnSearchCondition(),
})
export const createCommentTargetCommentSearchCondition = (): CommentTargetCommentSearchCondition => ({
})
export const createCommentTargetRow_RowSearchCondition = (): CommentTargetRow_RowSearchCondition => ({
    RowType: createCommentTargetRow_Row_RowTypeSearchCondition(),
    Indent: {},
    CreatedOn: {},
    UpdatedOn: {},
})
export const createCommentTargetRow_Row_RowTypeSearchCondition = (): CommentTargetRow_Row_RowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createCommentTargetCell_CellSearchCondition = (): CommentTargetCell_CellSearchCondition => ({
    Parent: createCommentTargetCell_Cell_ParentSearchCondition(),
    ColType: createCommentTargetCell_Cell_ColTypeSearchCondition(),
    UpdatedOn: {},
})
export const createCommentTargetCell_Cell_ParentSearchCondition = (): CommentTargetCell_Cell_ParentSearchCondition => ({
    RowType: createCommentTargetCell_Cell_Parent_RowTypeSearchCondition(),
    Indent: {},
    CreatedOn: {},
    UpdatedOn: {},
})
export const createCommentTargetCell_Cell_Parent_RowTypeSearchCondition = (): CommentTargetCell_Cell_Parent_RowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createCommentTargetCell_Cell_ColTypeSearchCondition = (): CommentTargetCell_Cell_ColTypeSearchCondition => ({
    Parent: createCommentTargetCell_Cell_ColType_ParentSearchCondition(),
})
export const createCommentTargetCell_Cell_ColType_ParentSearchCondition = (): CommentTargetCell_Cell_ColType_ParentSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createCommentTargetRowType_RowTypeSearchCondition = (): CommentTargetRowType_RowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createCommentTargetColumn_ColumnSearchCondition = (): CommentTargetColumn_ColumnSearchCondition => ({
    Parent: createCommentTargetColumn_Column_ParentSearchCondition(),
})
export const createCommentTargetColumn_Column_ParentSearchCondition = (): CommentTargetColumn_Column_ParentSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})

/** Commentの画面表示用データ */
export type CommentDisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    ID?: string
    Text?: string
    Author?: string
    CreatedOn?: string
    UpdatedOn?: string
    Target?: 'CommentTargetRow' | 'CommentTargetCell' | 'CommentTargetRowType' | 'CommentTargetColumn' | 'CommentTargetComment'
  }
  child_CommentTargetRow?: CommentTargetRowDisplayData
  child_CommentTargetCell?: CommentTargetCellDisplayData
  child_CommentTargetRowType?: CommentTargetRowTypeDisplayData
  child_CommentTargetColumn?: CommentTargetColumnDisplayData
  child_CommentTargetComment?: CommentTargetCommentDisplayData
}
/** CommentTargetRowの画面表示用データ */
export type CommentTargetRowDisplayData = {
  own_members: {
    Row?: RowRefInfo
  }
}
/** CommentTargetCellの画面表示用データ */
export type CommentTargetCellDisplayData = {
  own_members: {
    Cell?: AttrsRefInfo
  }
}
/** CommentTargetRowTypeの画面表示用データ */
export type CommentTargetRowTypeDisplayData = {
  own_members: {
    RowType?: RowTypeRefInfo
  }
}
/** CommentTargetColumnの画面表示用データ */
export type CommentTargetColumnDisplayData = {
  own_members: {
    Column?: ColumnsRefInfo
  }
}
/** CommentTargetCommentの画面表示用データ */
export type CommentTargetCommentDisplayData = {
  own_members: {
    CommentId?: string
  }
}

/** 画面に表示されるデータ型を登録更新される粒度の型に変換します。 */
export const convertCommentToLocalRepositoryItem = (displayData: CommentDisplayData) => {
  const item0: Util.LocalRepositoryItem<CommentSaveCommand> = {
    itemKey: displayData.localRepositoryItemKey,
    existsInRemoteRepository: displayData.existsInRemoteRepository,
    willBeChanged: displayData.willBeChanged,
    willBeDeleted: displayData.willBeDeleted,
    item: {
      ID: displayData?.own_members?.ID,
      Text: displayData?.own_members?.Text,
      Author: displayData?.own_members?.Author,
      CreatedOn: displayData?.own_members?.CreatedOn,
      UpdatedOn: displayData?.own_members?.UpdatedOn,
      Target: displayData?.own_members?.Target,
      CommentTargetRow: {
        Row: displayData?.child_CommentTargetRow?.own_members?.Row?.__instanceKey,
      },
      CommentTargetCell: {
        Cell: displayData?.child_CommentTargetCell?.own_members?.Cell?.__instanceKey,
      },
      CommentTargetRowType: {
        RowType: displayData?.child_CommentTargetRowType?.own_members?.RowType?.__instanceKey,
      },
      CommentTargetColumn: {
        Column: displayData?.child_CommentTargetColumn?.own_members?.Column?.__instanceKey,
      },
      CommentTargetComment: {
        CommentId: displayData?.child_CommentTargetComment?.own_members?.CommentId,
      },
    },
  }

  return [
    item0,
  ] as const
}

/** Commentを参照する他のデータの画面上に表示されるCommentのデータ型。 */
export type CommentRefInfo = {
  /** Commentのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のCommentをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  ID?: string,
  Text?: string,
  CommentTargetComment?: {
    CommentId?: string,
  },
}

/** CommentTargetRowを参照する他のデータの画面上に表示されるCommentTargetRowのデータ型。 */
export type CommentTargetRowRefInfo = {
  /** CommentTargetRowのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のCommentTargetRowをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
    Text?: string,
    CommentTargetComment?: {
      CommentId?: string,
    },
  },
}

/** CommentTargetCellを参照する他のデータの画面上に表示されるCommentTargetCellのデータ型。 */
export type CommentTargetCellRefInfo = {
  /** CommentTargetCellのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のCommentTargetCellをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
    Text?: string,
    CommentTargetComment?: {
      CommentId?: string,
    },
  },
}

/** CommentTargetRowTypeを参照する他のデータの画面上に表示されるCommentTargetRowTypeのデータ型。 */
export type CommentTargetRowTypeRefInfo = {
  /** CommentTargetRowTypeのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のCommentTargetRowTypeをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
    Text?: string,
    CommentTargetComment?: {
      CommentId?: string,
    },
  },
}

/** CommentTargetColumnを参照する他のデータの画面上に表示されるCommentTargetColumnのデータ型。 */
export type CommentTargetColumnRefInfo = {
  /** CommentTargetColumnのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のCommentTargetColumnをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
    Text?: string,
    CommentTargetComment?: {
      CommentId?: string,
    },
  },
}

/** CommentTargetCommentを参照する他のデータの画面上に表示されるCommentTargetCommentのデータ型。 */
export type CommentTargetCommentRefInfo = {
  /** CommentTargetCommentのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のCommentTargetCommentをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
    Text?: string,
  },
  CommentId?: string,
}


// ------------------ Log ------------------
export type LogSaveCommand = {
  ID?: string
  LogTime?: string
  UpdatedObject?: string
  UpdateType?: string
  RowIdOrRowTypeId?: string
  Content?: string
}

export const createLog = (): LogSaveCommand => ({
  ID: UUID.generate(),
})

export type LogSearchCondition = {
  ID?: string
  LogTime: { From?: string, To?: string }
  UpdatedObject?: string
  UpdateType?: string
  RowIdOrRowTypeId?: string
  Content?: string
}

export const createLogSearchCondition = (): LogSearchCondition => ({
    LogTime: {},
})

/** Logの画面表示用データ */
export type LogDisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    ID?: string
    LogTime?: string
    UpdatedObject?: string
    UpdateType?: string
    RowIdOrRowTypeId?: string
    Content?: string
  }
}

/** 画面に表示されるデータ型を登録更新される粒度の型に変換します。 */
export const convertLogToLocalRepositoryItem = (displayData: LogDisplayData) => {
  const item0: Util.LocalRepositoryItem<LogSaveCommand> = {
    itemKey: displayData.localRepositoryItemKey,
    existsInRemoteRepository: displayData.existsInRemoteRepository,
    willBeChanged: displayData.willBeChanged,
    willBeDeleted: displayData.willBeDeleted,
    item: {
      ID: displayData?.own_members?.ID,
      LogTime: displayData?.own_members?.LogTime,
      UpdatedObject: displayData?.own_members?.UpdatedObject,
      UpdateType: displayData?.own_members?.UpdateType,
      RowIdOrRowTypeId: displayData?.own_members?.RowIdOrRowTypeId,
      Content: displayData?.own_members?.Content,
    },
  }

  return [
    item0,
  ] as const
}

/** Logを参照する他のデータの画面上に表示されるLogのデータ型。 */
export type LogRefInfo = {
  /** Logのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のLogをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  ID?: string,
  Content?: string,
}


