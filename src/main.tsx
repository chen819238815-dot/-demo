import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import { ScopeProvider } from './store/scope'
import { DashboardProvider } from './store/dashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#4f7cff',
          borderRadius: 8,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif",
        },
      }}
    >
      <ScopeProvider>
        <DashboardProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DashboardProvider>
      </ScopeProvider>
    </ConfigProvider>
  </React.StrictMode>,
)
