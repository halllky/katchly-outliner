import { UUID } from 'uuidjs'
import * as Util from './util'

// ------------------ Row ------------------
/** Rowの登録・更新・削除用のデータ型 */
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

/** 画面上でRowのオブジェクトが新しく作成されるタイミングで呼ばれる新規作成関数 */
export const createRow = (): RowSaveCommand => ({
  ID: UUID.generate(),
  Attrs: [],
})

/** Attrsの登録・更新・削除用のデータ型 */
export type AttrsSaveCommand = {
  ColType?: Util.ItemKey
  Value?: string
  UpdatedOn?: string
}

/** 画面上でAttrsのオブジェクトが新しく作成されるタイミングで呼ばれる新規作成関数 */
export const createAttrs = (): AttrsSaveCommand => ({
})

/** Rowの一覧検索条件 */
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
/** Attrsの一覧検索条件 */
export type AttrsSearchCondition = {
  ColType: Attrs_ColTypeSearchCondition
  Value?: string
  UpdatedOn: { From?: string, To?: string }
}
/** RowTypeの一覧検索条件 */
export type Row_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
/** Columnsの一覧検索条件 */
export type Attrs_ColTypeSearchCondition = {
  Parent: Attrs_ColType_ParentSearchCondition
  ColumnId?: string
  ColumnName?: string
}
/** RowTypeの一覧検索条件 */
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
/** RowOrderの登録・更新・削除用のデータ型 */
export type RowOrderSaveCommand = {
  Row?: Util.ItemKey
  Order?: number
}

/** 画面上でRowOrderのオブジェクトが新しく作成されるタイミングで呼ばれる新規作成関数 */
export const createRowOrder = (): RowOrderSaveCommand => ({
})

/** RowOrderの一覧検索条件 */
export type RowOrderSearchCondition = {
  Row: RowOrder_RowSearchCondition
  Order: { From?: number, To?: number }
}
/** Rowの一覧検索条件 */
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
/** RowTypeの一覧検索条件 */
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
/** RowTypeの登録・更新・削除用のデータ型 */
export type RowTypeSaveCommand = {
  ID?: string
  RowTypeName?: string
  Columns?: ColumnsSaveCommand[]
  CreatedOn?: string
  CreateUser?: string
  UpdatedOn?: string
  UpdateUser?: string
}

/** 画面上でRowTypeのオブジェクトが新しく作成されるタイミングで呼ばれる新規作成関数 */
export const createRowType = (): RowTypeSaveCommand => ({
  ID: UUID.generate(),
  Columns: [],
})

/** Columnsの登録・更新・削除用のデータ型 */
export type ColumnsSaveCommand = {
  ColumnId?: string
  ColumnName?: string
}

/** 画面上でColumnsのオブジェクトが新しく作成されるタイミングで呼ばれる新規作成関数 */
export const createColumns = (): ColumnsSaveCommand => ({
  ColumnId: UUID.generate(),
})

/** RowTypeの一覧検索条件 */
export type RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
/** Columnsの一覧検索条件 */
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
/** Commentの登録・更新・削除用のデータ型 */
export type CommentSaveCommand = {
  ID?: string
  Text?: string
  Author?: string
  Indent?: number
  Order?: number
  CreatedOn?: string
  UpdatedOn?: string
  TargetRow?: Util.ItemKey
  TargetCell?: Util.ItemKey
  TargetRowType?: Util.ItemKey
  TargetColumn?: Util.ItemKey
}

/** 画面上でCommentのオブジェクトが新しく作成されるタイミングで呼ばれる新規作成関数 */
export const createComment = (): CommentSaveCommand => ({
  ID: UUID.generate(),
})

/** Commentの一覧検索条件 */
export type CommentSearchCondition = {
  ID?: string
  Text?: string
  Author?: string
  Indent: { From?: number, To?: number }
  Order: { From?: number, To?: number }
  CreatedOn: { From?: string, To?: string }
  UpdatedOn: { From?: string, To?: string }
  TargetRow: Comment_TargetRowSearchCondition
  TargetCell: Comment_TargetCellSearchCondition
  TargetRowType: Comment_TargetRowTypeSearchCondition
  TargetColumn: Comment_TargetColumnSearchCondition
}
/** Rowの一覧検索条件 */
export type Comment_TargetRowSearchCondition = {
  ID?: string
  Text?: string
  RowType: Comment_TargetRow_RowTypeSearchCondition
  Indent: { From?: number, To?: number }
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
/** RowTypeの一覧検索条件 */
export type Comment_TargetRow_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
/** Attrsの一覧検索条件 */
export type Comment_TargetCellSearchCondition = {
  Parent: Comment_TargetCell_ParentSearchCondition
  ColType: Comment_TargetCell_ColTypeSearchCondition
  Value?: string
  UpdatedOn: { From?: string, To?: string }
}
/** Rowの一覧検索条件 */
export type Comment_TargetCell_ParentSearchCondition = {
  ID?: string
  Text?: string
  RowType: Comment_TargetCell_Parent_RowTypeSearchCondition
  Indent: { From?: number, To?: number }
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
/** RowTypeの一覧検索条件 */
export type Comment_TargetCell_Parent_RowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
/** Columnsの一覧検索条件 */
export type Comment_TargetCell_ColTypeSearchCondition = {
  Parent: Comment_TargetCell_ColType_ParentSearchCondition
  ColumnId?: string
  ColumnName?: string
}
/** RowTypeの一覧検索条件 */
export type Comment_TargetCell_ColType_ParentSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
/** RowTypeの一覧検索条件 */
export type Comment_TargetRowTypeSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}
/** Columnsの一覧検索条件 */
export type Comment_TargetColumnSearchCondition = {
  Parent: Comment_TargetColumn_ParentSearchCondition
  ColumnId?: string
  ColumnName?: string
}
/** RowTypeの一覧検索条件 */
export type Comment_TargetColumn_ParentSearchCondition = {
  ID?: string
  RowTypeName?: string
  CreatedOn: { From?: string, To?: string }
  CreateUser?: string
  UpdatedOn: { From?: string, To?: string }
  UpdateUser?: string
}

export const createCommentSearchCondition = (): CommentSearchCondition => ({
    Indent: {},
    Order: {},
    CreatedOn: {},
    UpdatedOn: {},
    TargetRow: createComment_TargetRowSearchCondition(),
    TargetCell: createComment_TargetCellSearchCondition(),
    TargetRowType: createComment_TargetRowTypeSearchCondition(),
    TargetColumn: createComment_TargetColumnSearchCondition(),
})
export const createComment_TargetRowSearchCondition = (): Comment_TargetRowSearchCondition => ({
    RowType: createComment_TargetRow_RowTypeSearchCondition(),
    Indent: {},
    CreatedOn: {},
    UpdatedOn: {},
})
export const createComment_TargetRow_RowTypeSearchCondition = (): Comment_TargetRow_RowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createComment_TargetCellSearchCondition = (): Comment_TargetCellSearchCondition => ({
    Parent: createComment_TargetCell_ParentSearchCondition(),
    ColType: createComment_TargetCell_ColTypeSearchCondition(),
    UpdatedOn: {},
})
export const createComment_TargetCell_ParentSearchCondition = (): Comment_TargetCell_ParentSearchCondition => ({
    RowType: createComment_TargetCell_Parent_RowTypeSearchCondition(),
    Indent: {},
    CreatedOn: {},
    UpdatedOn: {},
})
export const createComment_TargetCell_Parent_RowTypeSearchCondition = (): Comment_TargetCell_Parent_RowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createComment_TargetCell_ColTypeSearchCondition = (): Comment_TargetCell_ColTypeSearchCondition => ({
    Parent: createComment_TargetCell_ColType_ParentSearchCondition(),
})
export const createComment_TargetCell_ColType_ParentSearchCondition = (): Comment_TargetCell_ColType_ParentSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createComment_TargetRowTypeSearchCondition = (): Comment_TargetRowTypeSearchCondition => ({
    CreatedOn: {},
    UpdatedOn: {},
})
export const createComment_TargetColumnSearchCondition = (): Comment_TargetColumnSearchCondition => ({
    Parent: createComment_TargetColumn_ParentSearchCondition(),
})
export const createComment_TargetColumn_ParentSearchCondition = (): Comment_TargetColumn_ParentSearchCondition => ({
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
    Indent?: number
    Order?: number
    CreatedOn?: string
    UpdatedOn?: string
    TargetRow?: RowRefInfo
    TargetCell?: AttrsRefInfo
    TargetRowType?: RowTypeRefInfo
    TargetColumn?: ColumnsRefInfo
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
      Indent: displayData?.own_members?.Indent,
      Order: displayData?.own_members?.Order,
      CreatedOn: displayData?.own_members?.CreatedOn,
      UpdatedOn: displayData?.own_members?.UpdatedOn,
      TargetRow: displayData?.own_members?.TargetRow?.__instanceKey,
      TargetCell: displayData?.own_members?.TargetCell?.__instanceKey,
      TargetRowType: displayData?.own_members?.TargetRowType?.__instanceKey,
      TargetColumn: displayData?.own_members?.TargetColumn?.__instanceKey,
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
}


// ------------------ Log ------------------
/** Logの登録・更新・削除用のデータ型 */
export type LogSaveCommand = {
  ID?: string
  LogTime?: string
  UpdatedObject?: string
  UpdateType?: string
  RowIdOrRowTypeId?: string
  Content?: string
}

/** 画面上でLogのオブジェクトが新しく作成されるタイミングで呼ばれる新規作成関数 */
export const createLog = (): LogSaveCommand => ({
  ID: UUID.generate(),
})

/** Logの一覧検索条件 */
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


