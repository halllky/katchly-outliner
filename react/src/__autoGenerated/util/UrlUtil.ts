import { ItemKey } from './LocalRepository'

export const getRowSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/new/${window.encodeURI(`${key}`)}`
  }
  const [ID] = JSON.parse(key) as [string | undefined]
  if (mode === 'view') {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/detail/${window.encodeURI(`${ID}`)}`
  } else {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/edit/${window.encodeURI(`${ID}`)}`
  }
}

export const getAttrsSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/new/${window.encodeURI(`${key}`)}`
  }
  const [Attrs_ID, ColType_Columns_ID, ColType_ColumnId] = JSON.parse(key) as [string | undefined, string | undefined, string | undefined]
  if (mode === 'view') {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/detail/${window.encodeURI(`${Attrs_ID}`)}/${window.encodeURI(`${ColType_Columns_ID}`)}/${window.encodeURI(`${ColType_ColumnId}`)}`
  } else {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/edit/${window.encodeURI(`${Attrs_ID}`)}/${window.encodeURI(`${ColType_Columns_ID}`)}/${window.encodeURI(`${ColType_ColumnId}`)}`
  }
}

export const getRowAttrsRefsSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/new/${window.encodeURI(`${key}`)}`
  }
  const [RowAttrsRefs_Attrs_ID, RowAttrsRefs_ColType_Columns_ID, RowAttrsRefs_ColType_ColumnId] = JSON.parse(key) as [string | undefined, string | undefined, string | undefined]
  if (mode === 'view') {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/detail/${window.encodeURI(`${RowAttrsRefs_Attrs_ID}`)}/${window.encodeURI(`${RowAttrsRefs_ColType_Columns_ID}`)}/${window.encodeURI(`${RowAttrsRefs_ColType_ColumnId}`)}`
  } else {
    return `/xc431ca892f0ec48c9bbc3311bb00c38c/edit/${window.encodeURI(`${RowAttrsRefs_Attrs_ID}`)}/${window.encodeURI(`${RowAttrsRefs_ColType_Columns_ID}`)}/${window.encodeURI(`${RowAttrsRefs_ColType_ColumnId}`)}`
  }
}

export const getRowOrderSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/x29a9c912e5efa23f5781a3a7e18e9808/new/${window.encodeURI(`${key}`)}`
  }
  const [Row_ID] = JSON.parse(key) as [string | undefined]
  if (mode === 'view') {
    return `/x29a9c912e5efa23f5781a3a7e18e9808/detail/${window.encodeURI(`${Row_ID}`)}`
  } else {
    return `/x29a9c912e5efa23f5781a3a7e18e9808/edit/${window.encodeURI(`${Row_ID}`)}`
  }
}

export const getRowTypeSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/x482f568abd9568fda9b360b0bf991835/new/${window.encodeURI(`${key}`)}`
  }
  const [ID] = JSON.parse(key) as [string | undefined]
  if (mode === 'view') {
    return `/x482f568abd9568fda9b360b0bf991835/detail/${window.encodeURI(`${ID}`)}`
  } else {
    return `/x482f568abd9568fda9b360b0bf991835/edit/${window.encodeURI(`${ID}`)}`
  }
}

export const getColumnsSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/x482f568abd9568fda9b360b0bf991835/new/${window.encodeURI(`${key}`)}`
  }
  const [Columns_ID, ColumnId] = JSON.parse(key) as [string | undefined, string | undefined]
  if (mode === 'view') {
    return `/x482f568abd9568fda9b360b0bf991835/detail/${window.encodeURI(`${Columns_ID}`)}/${window.encodeURI(`${ColumnId}`)}`
  } else {
    return `/x482f568abd9568fda9b360b0bf991835/edit/${window.encodeURI(`${Columns_ID}`)}/${window.encodeURI(`${ColumnId}`)}`
  }
}

export const getCommentSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/xcc9c15b1503ef15d999d64ce6d5fe189/new/${window.encodeURI(`${key}`)}`
  }
  const [ID] = JSON.parse(key) as [string | undefined]
  if (mode === 'view') {
    return `/xcc9c15b1503ef15d999d64ce6d5fe189/detail/${window.encodeURI(`${ID}`)}`
  } else {
    return `/xcc9c15b1503ef15d999d64ce6d5fe189/edit/${window.encodeURI(`${ID}`)}`
  }
}

export const getChangeLogSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/x2f89be282c4027a76b6857544038122c/new/${window.encodeURI(`${key}`)}`
  }
  const [ID] = JSON.parse(key) as [string | undefined]
  if (mode === 'view') {
    return `/x2f89be282c4027a76b6857544038122c/detail/${window.encodeURI(`${ID}`)}`
  } else {
    return `/x2f89be282c4027a76b6857544038122c/edit/${window.encodeURI(`${ID}`)}`
  }
}

export const getNIJOBackgroundTaskEntitySingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/x2fb4046de31021ecb9b929f35ab4d110/new/${window.encodeURI(`${key}`)}`
  }
  const [JobId] = JSON.parse(key) as [string | undefined]
  if (mode === 'view') {
    return `/x2fb4046de31021ecb9b929f35ab4d110/detail/${window.encodeURI(`${JobId}`)}`
  } else {
    return `/x2fb4046de31021ecb9b929f35ab4d110/edit/${window.encodeURI(`${JobId}`)}`
  }
}

