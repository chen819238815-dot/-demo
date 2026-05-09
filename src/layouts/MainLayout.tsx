import { useNavigate, useLocation } from 'react-router-dom'
import { Badge, Tooltip } from 'antd'
import {
  BellOutlined,
  AppstoreOutlined,
  CodeOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import { useDashboards } from '../store/dashboard'

// =================== 菜单结构（参考图1：双列分组 + 自助报表/自定义仪表盘独立一列） ===================
interface MenuLeaf {
  key: string
  label: string
  badge?: string | number
}

interface MenuGroup {
  group: string
  // 'two-col' = 双列分组（如概况、商品交易等），'single-col' = 单列（自助报表/自定义仪表盘）
  layout: 'two-col' | 'single-col'
  items: MenuLeaf[]
}

const baseMenus: MenuGroup[] = [
  {
    group: '概况',
    layout: 'two-col',
    items: [
      { key: '/dashboard/overview', label: '营业概况' },
      { key: '/dashboard/product', label: '商品概况' },
      { key: '/dashboard/customer', label: '客户概况' },
      { key: '/dashboard/biz-report', label: '经营报表' },
      { key: '/dashboard/finance', label: '财务报表' },
    ],
  },
  {
    group: '商品交易',
    layout: 'two-col',
    items: [
      { key: '/biz/product-insight', label: '商品洞察' },
      { key: '/biz/stock-analysis', label: '库存分析' },
    ],
  },
  {
    group: '客户分析',
    layout: 'two-col',
    items: [
      { key: '/customer/insight', label: '客户洞察' },
      { key: '/customer/member', label: '会员分析' },
      { key: '/customer/points', label: '积分分析' },
      { key: '/customer/storage', label: '储值分析' },
    ],
  },
  {
    group: '营销分析',
    layout: 'two-col',
    items: [
      { key: '/marketing/overview', label: '营销概况' },
      { key: '/marketing/plugin', label: '插件分析' },
    ],
  },
  {
    group: '流量分析',
    layout: 'two-col',
    items: [
      { key: '/traffic/overview', label: '流量概况' },
      { key: '/traffic/page', label: '页面分析' },
      { key: '/traffic/promotion', label: '推广分析' },
      { key: '/traffic/heatmap', label: '热力图分析' },
    ],
  },
  {
    group: '更多',
    layout: 'two-col',
    items: [
      { key: '/more/scan', label: '扫码统计' },
      { key: '/more/transaction', label: '交易分析' },
      { key: '/more/realtime', label: '实时分析' },
      { key: '/more/data-overview', label: '数据概况' },
      { key: '/more/sales', label: '增量业绩' },
      { key: '/more/video', label: '视频号分析' },
      { key: '/more/distributor', label: '分销员分析' },
    ],
  },
]

// =================== Layout ===================
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { dashboards } = useDashboards()

  const isActive = (key: string) => {
    if (location.pathname === key) return true
    return location.pathname.startsWith(key + '/')
  }

  // 自定义仪表盘：我的仪表盘列表显示在二级菜单
  const myDashboards = dashboards.filter((d) => d.kind === 'mine')

  return (
    <div className="app-shell">
      {/* ============== Top Bar ============== */}
      <div className="app-header">
        <div className="row gap-24" style={{ alignItems: 'center' }}>
          <div
            className="brand"
            onClick={() => navigate('/analysis')}
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-logo">B</div>
            <span>经营分析中心</span>
          </div>
        </div>

        <div className="row gap-16" style={{ alignItems: 'center' }}>
          <Tooltip title="智能洞察通知">
            <Badge count={5} size="small" offset={[-2, 4]}>
              <BellOutlined style={{ fontSize: 18, color: '#4e5969', cursor: 'pointer' }} />
            </Badge>
          </Tooltip>
          <div className="user-avatar">陈</div>
        </div>
      </div>

      {/* ============== Body ============== */}
      <div className="app-body">
        {/* 左侧菜单 */}
        <div className="app-sider">
          {baseMenus.map((group) => (
            <div key={group.group} className="menu-group">
              <div className="menu-group-title">{group.group}</div>
              <div className={group.layout === 'two-col' ? 'menu-grid-2' : 'menu-grid-1'}>
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className={`menu-cell ${isActive(item.key) ? 'active' : ''}`}
                    onClick={() => navigate(item.key)}
                    title={item.label}
                  >
                    <span className="menu-cell-label">{item.label}</span>
                    {item.badge != null && (
                      <span className="menu-cell-badge">{item.badge}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ======= 自助分析（独立分组：自助报表 / 自定义仪表盘 单独成列） ======= */}
          <div className="menu-group menu-group-feature">
            <div className="menu-group-title">自助分析</div>
            <div className="menu-grid-1">
              <div
                className={`menu-cell solo ${isActive('/self-query') ? 'active' : ''}`}
                onClick={() => navigate('/self-query')}
              >
                <CodeOutlined className="menu-icon" />
                <span className="menu-cell-label">自助报表</span>
              </div>
              <div
                className={`menu-cell solo ${isActive('/analysis') ? 'active' : ''}`}
                onClick={() => navigate('/analysis')}
              >
                <AppstoreOutlined className="menu-icon" />
                <span className="menu-cell-label">自助仪表盘</span>
              </div>
              {/* 二级菜单：仪表盘名称 */}
              {myDashboards.length > 0 && (
                <div className="dashboard-submenu">
                  {myDashboards.map((d) => (
                    <div
                      key={d.id}
                      className={`submenu-cell ${
                        isActive(`/analysis/dashboards/${d.id}`) ? 'active' : ''
                      }`}
                      onClick={() => navigate(`/analysis/dashboards/${d.id}`)}
                      title={d.name}
                    >
                      <span className="submenu-dot" />
                      <span className="submenu-label">{d.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ height: 12 }} />

          {/* AI 入口悬浮 */}
          <div className="ai-launcher" onClick={() => navigate('/agent')}>
            <RobotOutlined className="ai-launcher-icon" />
            <span>智能体</span>
            <span className="ai-launcher-plus">+</span>
          </div>
        </div>

        <div className="app-content">{children}</div>
      </div>

      {/* Zion 水印按钮 */}
      <a
        href="https://www.functorz.com/vibe-architect-cursor?utm_source=showcase&utm_medium=referral&utm_campaign=cursor&utm_content=watermark"
        target="_blank"
        rel="noopener noreferrer"
        className="zion-watermark"
      >
        <img
          src="https://zion-static-public.functorz.com/powered_by_zion.svg"
          alt="Powered by Zion"
          width="160"
          height="42"
        />
      </a>
    </div>
  )
}
