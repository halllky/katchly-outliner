import RowCreateView from './pages/Row/new'
import RowMultiView from './pages/Row/list'
import RowDetailView from './pages/Row/detail'
import RowEditView from './pages/Row/edit'
import RowOrderCreateView from './pages/RowOrder/new'
import RowOrderMultiView from './pages/RowOrder/list'
import RowOrderDetailView from './pages/RowOrder/detail'
import RowOrderEditView from './pages/RowOrder/edit'
import RowTypeCreateView from './pages/RowType/new'
import RowTypeMultiView from './pages/RowType/list'
import RowTypeDetailView from './pages/RowType/detail'
import RowTypeEditView from './pages/RowType/edit'
import CommentCreateView from './pages/Comment/new'
import CommentMultiView from './pages/Comment/list'
import CommentDetailView from './pages/Comment/detail'
import CommentEditView from './pages/Comment/edit'
import ChangeLogCreateView from './pages/ChangeLog/new'
import ChangeLogMultiView from './pages/ChangeLog/list'
import ChangeLogDetailView from './pages/ChangeLog/detail'
import ChangeLogEditView from './pages/ChangeLog/edit'

export const THIS_APPLICATION_NAME = 'Katchly' as const

export const routes: { url: string, el: JSX.Element }[] = [
  { url: '/xc431ca892f0ec48c9bbc3311bb00c38c/new/:key0?', el: <RowCreateView /> },
  { url: '/xaa6703a7b77c514e0f4f9413ccf059d3', el: <RowMultiView /> },
  { url: '/xc431ca892f0ec48c9bbc3311bb00c38c/detail/:key0', el: <RowDetailView /> },
  { url: '/xc431ca892f0ec48c9bbc3311bb00c38c/edit/:key0', el: <RowEditView /> },
  { url: '/x29a9c912e5efa23f5781a3a7e18e9808/new/:key0?', el: <RowOrderCreateView /> },
  { url: '/x1827ce8197ce65dd7400e6eeb2155790', el: <RowOrderMultiView /> },
  { url: '/x29a9c912e5efa23f5781a3a7e18e9808/detail/:key0', el: <RowOrderDetailView /> },
  { url: '/x29a9c912e5efa23f5781a3a7e18e9808/edit/:key0', el: <RowOrderEditView /> },
  { url: '/x482f568abd9568fda9b360b0bf991835/new/:key0?', el: <RowTypeCreateView /> },
  { url: '/x32605e58c9870700a3a2652f36a5c4b5', el: <RowTypeMultiView /> },
  { url: '/x482f568abd9568fda9b360b0bf991835/detail/:key0', el: <RowTypeDetailView /> },
  { url: '/x482f568abd9568fda9b360b0bf991835/edit/:key0', el: <RowTypeEditView /> },
  { url: '/xcc9c15b1503ef15d999d64ce6d5fe189/new/:key0?', el: <CommentCreateView /> },
  { url: '/x6940e80bcd51a8fd2f00f79328cf4efc', el: <CommentMultiView /> },
  { url: '/xcc9c15b1503ef15d999d64ce6d5fe189/detail/:key0', el: <CommentDetailView /> },
  { url: '/xcc9c15b1503ef15d999d64ce6d5fe189/edit/:key0', el: <CommentEditView /> },
  { url: '/x2f89be282c4027a76b6857544038122c/new/:key0?', el: <ChangeLogCreateView /> },
  { url: '/x47b5f00277c2259dcff89672135f20e3', el: <ChangeLogMultiView /> },
  { url: '/x2f89be282c4027a76b6857544038122c/detail/:key0', el: <ChangeLogDetailView /> },
  { url: '/x2f89be282c4027a76b6857544038122c/edit/:key0', el: <ChangeLogEditView /> },
]
export const menuItems: { url: string, text: string }[] = [
  { url: '/xaa6703a7b77c514e0f4f9413ccf059d3', text: 'Row' },
  { url: '/x1827ce8197ce65dd7400e6eeb2155790', text: 'RowOrder' },
  { url: '/x32605e58c9870700a3a2652f36a5c4b5', text: 'RowType' },
  { url: '/x6940e80bcd51a8fd2f00f79328cf4efc', text: 'Comment' },
  { url: '/x47b5f00277c2259dcff89672135f20e3', text: 'ChangeLog' },
]

export const SHOW_LOCAL_REPOSITORY_MENU = true
