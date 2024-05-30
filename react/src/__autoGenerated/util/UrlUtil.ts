import { ItemKey } from './LocalRepository'

export const get親集約SingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/xe09725e2e5673c42591875254a98e3c9/new/${window.encodeURI(`${key}`)}`
  }
  const [ID] = JSON.parse(key) as [string | undefined]
  if (mode === 'view') {
    return `/xe09725e2e5673c42591875254a98e3c9/detail/${window.encodeURI(`${ID}`)}`
  } else {
    return `/xe09725e2e5673c42591875254a98e3c9/edit/${window.encodeURI(`${ID}`)}`
  }
}

export const getChildrenSingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/xe09725e2e5673c42591875254a98e3c9/new/${window.encodeURI(`${key}`)}`
  }
  const [Children_ID, ID] = JSON.parse(key) as [string | undefined, string | undefined]
  if (mode === 'view') {
    return `/xe09725e2e5673c42591875254a98e3c9/detail/${window.encodeURI(`${Children_ID}`)}/${window.encodeURI(`${ID}`)}`
  } else {
    return `/xe09725e2e5673c42591875254a98e3c9/edit/${window.encodeURI(`${Children_ID}`)}/${window.encodeURI(`${ID}`)}`
  }
}

export const get参照先SingleViewUrl = (key: ItemKey | undefined, mode: 'new' | 'view' | 'edit'): string => {
  if (!key) {
    return ''
  }
  if (mode === 'new') {
    return `/x0980ef37494eb0089d5695ded11e38fa/new/${window.encodeURI(`${key}`)}`
  }
  const [参照先ID] = JSON.parse(key) as [string | undefined]
  if (mode === 'view') {
    return `/x0980ef37494eb0089d5695ded11e38fa/detail/${window.encodeURI(`${参照先ID}`)}`
  } else {
    return `/x0980ef37494eb0089d5695ded11e38fa/edit/${window.encodeURI(`${参照先ID}`)}`
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

