import 親集約CreateView from './pages/親集約/new'
import 親集約MultiView from './pages/親集約/list'
import 親集約DetailView from './pages/親集約/detail'
import 親集約EditView from './pages/親集約/edit'
import 参照先CreateView from './pages/参照先/new'
import 参照先MultiView from './pages/参照先/list'
import 参照先DetailView from './pages/参照先/detail'
import 参照先EditView from './pages/参照先/edit'

export const THIS_APPLICATION_NAME = 'FlexTree' as const

export const routes: { url: string, el: JSX.Element }[] = [
  { url: '/xe09725e2e5673c42591875254a98e3c9/new/:key0?', el: <親集約CreateView /> },
  { url: '/xe213acbb917da6e275692e24574a1c42', el: <親集約MultiView /> },
  { url: '/xe09725e2e5673c42591875254a98e3c9/detail/:key0', el: <親集約DetailView /> },
  { url: '/xe09725e2e5673c42591875254a98e3c9/edit/:key0', el: <親集約EditView /> },
  { url: '/x0980ef37494eb0089d5695ded11e38fa/new/:key0?', el: <参照先CreateView /> },
  { url: '/xb058decf0b0181492825cc0c048c524b', el: <参照先MultiView /> },
  { url: '/x0980ef37494eb0089d5695ded11e38fa/detail/:key0', el: <参照先DetailView /> },
  { url: '/x0980ef37494eb0089d5695ded11e38fa/edit/:key0', el: <参照先EditView /> },
]
export const menuItems: { url: string, text: string }[] = [
  { url: '/xe213acbb917da6e275692e24574a1c42', text: '親集約' },
  { url: '/xb058decf0b0181492825cc0c048c524b', text: '参照先' },
]
