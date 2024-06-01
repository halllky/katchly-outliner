import RowCreateView from './pages/Row/new'
import RowMultiView from './pages/Row/list'
import RowDetailView from './pages/Row/detail'
import RowEditView from './pages/Row/edit'
import RowTypeCreateView from './pages/RowType/new'
import RowTypeMultiView from './pages/RowType/list'
import RowTypeDetailView from './pages/RowType/detail'
import RowTypeEditView from './pages/RowType/edit'

export const THIS_APPLICATION_NAME = 'Katchly' as const

export const routes: { url: string, el: JSX.Element }[] = [
  { url: '/xc431ca892f0ec48c9bbc3311bb00c38c/new/:key0?', el: <RowCreateView /> },
  { url: '/xaa6703a7b77c514e0f4f9413ccf059d3', el: <RowMultiView /> },
  { url: '/xc431ca892f0ec48c9bbc3311bb00c38c/detail/:key0', el: <RowDetailView /> },
  { url: '/xc431ca892f0ec48c9bbc3311bb00c38c/edit/:key0', el: <RowEditView /> },
  { url: '/x482f568abd9568fda9b360b0bf991835/new/:key0?', el: <RowTypeCreateView /> },
  { url: '/x32605e58c9870700a3a2652f36a5c4b5', el: <RowTypeMultiView /> },
  { url: '/x482f568abd9568fda9b360b0bf991835/detail/:key0', el: <RowTypeDetailView /> },
  { url: '/x482f568abd9568fda9b360b0bf991835/edit/:key0', el: <RowTypeEditView /> },
]
export const menuItems: { url: string, text: string }[] = [
  { url: '/xaa6703a7b77c514e0f4f9413ccf059d3', text: 'Row' },
  { url: '/x32605e58c9870700a3a2652f36a5c4b5', text: 'RowType' },
]
