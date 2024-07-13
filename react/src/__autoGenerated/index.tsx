import React from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as Icon from '@heroicons/react/24/outline'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import * as Util from './util'
import * as AutoGenerated from './autogenerated-menu'
import DashBoard from './pages/DashBoard'

export * from './collection'
export * from './input'
export * from './util'

import './nijo-default-style.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

function ApplicationRootInContext({ children }: {
  children?: React.ReactNode
}) {
  // ユーザー設定
  const { data: {
    darkMode,
    fontFamily,
  } } = Util.useUserSetting()

  // 変更（ローカルリポジトリ）
  const { changesCount } = Util.useLocalRepositoryChangeList()

  // サイドメニュー開閉
  const [{ collapsed }] = Util.useSideMenuContext()

  return (
    <PanelGroup
      direction='horizontal'
      autoSaveId="LOCAL_STORAGE_KEY.SIDEBAR_SIZE_X"
      className={darkMode ? 'dark' : undefined}
      style={{ fontFamily: fontFamily ? fontFamily : Util.DEFAULT_FONT_FAMILY }}>

      {/* サイドメニュー */}
      <Panel defaultSize={20} className={collapsed ? 'hidden' : ''}>
        <PanelGroup direction="vertical"
          className="bg-color-gutter text-color-12"
          autoSaveId="LOCAL_STORAGE_KEY.SIDEBAR_SIZE_Y">
          <Panel className="flex flex-col">
            <Link to='/' className="p-1 ellipsis-ex font-semibold select-none">
              {AutoGenerated.THIS_APPLICATION_NAME}
            </Link>
            <nav className="flex-1 overflow-y-auto leading-none">
              {AutoGenerated.menuItems.map(item =>
                <SideMenuLink key={item.url} url={item.url}>{item.text}</SideMenuLink>
              )}
            </nav>
          </Panel>

          <PanelResizeHandle className="h-1 bg-color-base" />

          <Panel className="flex flex-col">
            <nav className="flex-1 overflow-y-auto leading-none">
              {AutoGenerated.SHOW_LOCAL_REPOSITORY_MENU && (
                <SideMenuLink url="/changes" icon={Icon.ArrowsUpDownIcon}>
                  {changesCount === 0
                    ? <span>一時保存</span>
                    : <span className="font-bold">一時保存&nbsp;({changesCount})</span>}
                </SideMenuLink>
              )}
              <SideMenuLink url="/settings" icon={Icon.Cog8ToothIcon}>設定</SideMenuLink>
            </nav>
            <span className="p-1 text-sm whitespace-nowrap overflow-hidden">
              ver. 0.9.0.0
            </span>
          </Panel>
        </PanelGroup>
      </Panel>

      <PanelResizeHandle className={`w-1 bg-color-base ${collapsed ? 'hidden' : ''}`} />

      {/* コンテンツ */}
      <Panel className={`flex flex-col bg-color-base text-color-12`}>
        <Routes>
          <Route path='/' element={<DashBoard />} />
          {AutoGenerated.SHOW_LOCAL_REPOSITORY_MENU && (
            <Route path='/changes' element={<Util.LocalReposChangeListPage />} />
          )}
          <Route path='/settings' element={<Util.ServerSettingScreen />} />
          {AutoGenerated.routes.map(route =>
            <Route key={route.url} path={route.url} element={route.el} />
          )}
          {children}
          <Route path='*' element={<p> Not found.</p>} />
        </Routes>

        <Util.InlineMessageList />
      </Panel>
    </PanelGroup>
  )
}

export function DefaultNijoApp({ children }: {
  children?: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Util.MsgContextProvider>
          <Util.ToastContextProvider>
            <Util.LocalRepositoryContextProvider>
              <Util.UserSettingContextProvider>
                <Util.SideMenuContextProvider>
                  <ApplicationRootInContext>
                    {children}
                  </ApplicationRootInContext>
                  <Util.EnvNameRibbon />
                  <Util.Toast />
                </Util.SideMenuContextProvider>
              </Util.UserSettingContextProvider>
            </Util.LocalRepositoryContextProvider>
          </Util.ToastContextProvider>
        </Util.MsgContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const SideMenuLink = ({ url, icon, children }: {
  url: string
  icon?: React.ElementType
  children?: React.ReactNode
}) => {

  const location = useLocation()
  const className = location.pathname.startsWith(url)
    ? 'outline-none inline-block w-full p-1 ellipsis-ex font-bold bg-color-base'
    : 'outline-none inline-block w-full p-1 ellipsis-ex'

  return (
    <NavLink to={url} className={className}>
      {React.createElement(icon ?? Icon.CircleStackIcon, { className: 'inline w-4 mr-1 opacity-70 align-middle' })}
      <span className="text-sm align-middle select-none">{children}</span>
    </NavLink>
  )
}
