import { UUID } from 'uuidjs'
import * as Util from './util'

// ------------------ NIJO::BackgroundTaskEntity ------------------

// ------------------ 親集約 ------------------
export type 親集約SaveCommand = {
  ID?: string
  単語?: string
  文章?: string
  整数?: number
  実数?: number
  日付時刻?: string
  日付?: string
  年月?: number
  年?: number
  参照?: Util.ItemKey
  真偽値?: boolean
  列挙体?: '選択肢1' | '選択肢2' | '選択肢3'
  Children?: ChildrenSaveCommand[]
}

export const create親集約 = (): 親集約SaveCommand => ({
  ID: UUID.generate(),
  Children: [],
})

export type ChildrenSaveCommand = {
  ID?: string
  単語?: string
  文章?: string
  整数?: number
  実数?: number
  日付時刻?: string
  日付?: string
  年月?: number
  年?: number
  参照?: Util.ItemKey
  真偽値?: boolean
  列挙体?: '選択肢1' | '選択肢2' | '選択肢3'
}

export const createChildren = (): ChildrenSaveCommand => ({
  ID: UUID.generate(),
})

export type 親集約SearchCondition = {
  ID?: string
  単語?: string
  文章?: string
  整数: { From?: number, To?: number }
  実数: { From?: number, To?: number }
  日付時刻: { From?: string, To?: string }
  日付: { From?: string, To?: string }
  年月: { From?: number, To?: number }
  年: { From?: number, To?: number }
  参照: 親集約_参照SearchCondition
  真偽値?: boolean
  列挙体?: '選択肢1' | '選択肢2' | '選択肢3'
}
export type ChildrenSearchCondition = {
  ID?: string
  単語?: string
  文章?: string
  整数: { From?: number, To?: number }
  実数: { From?: number, To?: number }
  日付時刻: { From?: string, To?: string }
  日付: { From?: string, To?: string }
  年月: { From?: number, To?: number }
  年: { From?: number, To?: number }
  参照: Children_参照SearchCondition
  真偽値?: boolean
  列挙体?: '選択肢1' | '選択肢2' | '選択肢3'
}
export type 親集約_参照SearchCondition = {
  参照先ID?: string
  Name?: string
}
export type Children_参照SearchCondition = {
  参照先ID?: string
  Name?: string
}

export const create親集約SearchCondition = (): 親集約SearchCondition => ({
    整数: {},
    実数: {},
    日付時刻: {},
    日付: {},
    年月: {},
    年: {},
    参照: create親集約_参照SearchCondition(),
})
export const createChildrenSearchCondition = (): ChildrenSearchCondition => ({
    整数: {},
    実数: {},
    日付時刻: {},
    日付: {},
    年月: {},
    年: {},
    参照: createChildren_参照SearchCondition(),
})
export const create親集約_参照SearchCondition = (): 親集約_参照SearchCondition => ({
})
export const createChildren_参照SearchCondition = (): Children_参照SearchCondition => ({
})

/** 親集約の画面表示用データ */
export type 親集約DisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    ID?: string
    単語?: string
    文章?: string
    整数?: number
    実数?: number
    日付時刻?: string
    日付?: string
    年月?: number
    年?: number
    参照?: 参照先RefInfo
    真偽値?: boolean
    列挙体?: '選択肢1' | '選択肢2' | '選択肢3'
  }
  child_Children?: ChildrenDisplayData[]
}
/** Childrenの画面表示用データ */
export type ChildrenDisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    ID?: string
    単語?: string
    文章?: string
    整数?: number
    実数?: number
    日付時刻?: string
    日付?: string
    年月?: number
    年?: number
    参照?: 参照先RefInfo
    真偽値?: boolean
    列挙体?: '選択肢1' | '選択肢2' | '選択肢3'
  }
}

/** 画面に表示されるデータ型を登録更新される粒度の型に変換します。 */
export const convert親集約ToLocalRepositoryItem = (displayData: 親集約DisplayData) => {
  const item0: Util.LocalRepositoryItem<親集約SaveCommand> = {
    itemKey: displayData.localRepositoryItemKey,
    existsInRemoteRepository: displayData.existsInRemoteRepository,
    willBeChanged: displayData.willBeChanged,
    willBeDeleted: displayData.willBeDeleted,
    item: {
      ID: displayData?.own_members?.ID,
      単語: displayData?.own_members?.単語,
      文章: displayData?.own_members?.文章,
      整数: displayData?.own_members?.整数,
      実数: displayData?.own_members?.実数,
      日付時刻: displayData?.own_members?.日付時刻,
      日付: displayData?.own_members?.日付,
      年月: displayData?.own_members?.年月,
      年: displayData?.own_members?.年,
      参照: displayData?.own_members?.参照?.__instanceKey,
      真偽値: displayData?.own_members?.真偽値,
      列挙体: displayData?.own_members?.列挙体,
      Children: displayData.child_Children?.map(xChildren => ({
        ID: xChildren?.own_members?.ID,
        単語: xChildren?.own_members?.単語,
        文章: xChildren?.own_members?.文章,
        整数: xChildren?.own_members?.整数,
        実数: xChildren?.own_members?.実数,
        日付時刻: xChildren?.own_members?.日付時刻,
        日付: xChildren?.own_members?.日付,
        年月: xChildren?.own_members?.年月,
        年: xChildren?.own_members?.年,
        参照: xChildren?.own_members?.参照?.__instanceKey,
        真偽値: xChildren?.own_members?.真偽値,
        列挙体: xChildren?.own_members?.列挙体,
      })),
    },
  }

  return [
    item0,
  ] as const
}

/** 親集約を参照する他のデータの画面上に表示される親集約のデータ型。 */
export type 親集約RefInfo = {
  /** 親集約のキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間の親集約をUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  ID?: string,
  文章?: string,
}

/** Childrenを参照する他のデータの画面上に表示されるChildrenのデータ型。 */
export type ChildrenRefInfo = {
  /** Childrenのキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間のChildrenをUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  Parent?: {
    ID?: string,
    文章?: string,
  },
  ID?: string,
  文章?: string,
}


// ------------------ 参照先 ------------------
export type 参照先SaveCommand = {
  参照先ID?: string
  Name?: string
}

export const create参照先 = (): 参照先SaveCommand => ({
  参照先ID: UUID.generate(),
})

export type 参照先SearchCondition = {
  参照先ID?: string
  Name?: string
}

export const create参照先SearchCondition = (): 参照先SearchCondition => ({
})

/** 参照先の画面表示用データ */
export type 参照先DisplayData = {
  localRepositoryItemKey: Util.ItemKey
  existsInRemoteRepository: boolean
  willBeChanged: boolean
  willBeDeleted: boolean
  own_members: {
    参照先ID?: string
    Name?: string
  }
}

/** 画面に表示されるデータ型を登録更新される粒度の型に変換します。 */
export const convert参照先ToLocalRepositoryItem = (displayData: 参照先DisplayData) => {
  const item0: Util.LocalRepositoryItem<参照先SaveCommand> = {
    itemKey: displayData.localRepositoryItemKey,
    existsInRemoteRepository: displayData.existsInRemoteRepository,
    willBeChanged: displayData.willBeChanged,
    willBeDeleted: displayData.willBeDeleted,
    item: {
      参照先ID: displayData?.own_members?.参照先ID,
      Name: displayData?.own_members?.Name,
    },
  }

  return [
    item0,
  ] as const
}

/** 参照先を参照する他のデータの画面上に表示される参照先のデータ型。 */
export type 参照先RefInfo = {
  /** 参照先のキー。保存するときはこの値が使用される。
      新規作成されてからDBに登録されるまでの間の参照先をUUID等の不変の値で参照できるようにするために文字列になっている。 */
  __instanceKey?: Util.ItemKey

  参照先ID?: string,
  Name?: string,
}


