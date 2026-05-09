import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Analysis from './pages/Analysis'
import DashboardBuilder from './pages/DashboardBuilder'
import DashboardView from './pages/DashboardView'
import SelfQuery from './pages/SelfQuery'
import Placeholder from './pages/Placeholder'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/analysis" replace />} />

        {/* 自助分析 */}
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/analysis/dashboards/new" element={<DashboardBuilder />} />
        <Route path="/analysis/dashboards/:id/edit" element={<DashboardBuilder />} />
        <Route path="/analysis/dashboards/:id" element={<DashboardView />} />

        {/* 自助取数 */}
        <Route path="/self-query" element={<SelfQuery />} />

        {/* 顶部新建仪表盘按钮兼容路由 */}
        <Route path="/dashboards/new" element={<DashboardBuilder />} />

        {/* 概况、商品交易、客户分析、营销、流量、更多：作为占位页 */}
        <Route path="/dashboard/:section" element={<Placeholder kind="dashboard" />} />
        <Route path="/biz/:section" element={<Placeholder kind="biz" />} />
        <Route path="/customer/:section" element={<Placeholder kind="customer" />} />
        <Route path="/marketing/:section" element={<Placeholder kind="marketing" />} />
        <Route path="/traffic/:section" element={<Placeholder kind="traffic" />} />
        <Route path="/more/:section" element={<Placeholder kind="more" />} />

        {/* AI */}
        <Route path="/agent" element={<Placeholder kind="agent" />} />

        <Route path="*" element={<Navigate to="/analysis" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App
