import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { ArrowRightOutlined, BarChartOutlined } from '@ant-design/icons'

const TITLE_MAP: Record<string, Record<string, string>> = {
  dashboard: {
    overview: '营业概况',
    product: '商品概况',
    customer: '客户概况',
    'biz-report': '经营报表',
    finance: '财务报表',
  },
  biz: {
    'product-insight': '商品洞察',
    'stock-analysis': '库存分析',
  },
  customer: {
    insight: '客户洞察',
    member: '会员分析',
    points: '积分分析',
    storage: '储值分析',
  },
  marketing: {
    overview: '营销概况',
    plugin: '插件分析',
  },
  traffic: {
    overview: '流量概况',
    page: '页面分析',
    promotion: '推广分析',
    heatmap: '热力图分析',
  },
  more: {
    scan: '扫码统计',
    transaction: '交易分析',
    realtime: '实时分析',
    'data-overview': '数据概况',
    sales: '增量业绩',
    video: '视频号分析',
    distributor: '分销员分析',
  },
}

export default function Placeholder({ kind }: { kind: string }) {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const section = params.section
  const title =
    kind === 'agent'
      ? '经营报表智能体'
      : (section && TITLE_MAP[kind]?.[section]) || '功能模块'

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-subtitle">该模块为系统内置看板，您也可以前往「自助分析」基于该数据自由组合自己的看板</div>
        </div>
        <div className="page-actions">
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/analysis/dashboards/new')}
          >
            基于此创建自助分析
          </Button>
        </div>
      </div>

      <div className="empty-state" style={{ minHeight: 400 }}>
        <div className="es-icon">
          <BarChartOutlined />
        </div>
        <div className="es-title">「{title}」展示位</div>
        <div className="es-desc">
          当前位置：{location.pathname}
          ，您正在浏览的是系统内置数据看板。本次需求重点已实现于「自助仪表盘」与「自助报表」。
        </div>
        <Button type="link" onClick={() => navigate('/analysis')}>
          前往自助仪表盘 <ArrowRightOutlined />
        </Button>
      </div>
    </div>
  )
}
