import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

// =============== 类型定义 ===============
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'kpi' | 'table' | 'funnel' | 'scatter' | 'gauge'

export interface MetricDef {
  id: string
  name: string
  code: string
  category: string
  unit?: string
  formula?: string
}

export interface DimensionDef {
  id: string
  name: string
  code: string
  category: string
}

export interface DataSource {
  id: string
  name: string
  // 三种创建方式
  type: 'template' | 'report' | 'direct'
  templateId?: string
  reportId?: string
  metrics: string[] // metric ids
  dimensions: string[] // dimension ids
  rowCount: number
  preview?: any[]
  createdAt: string
}

export interface ChartCard {
  id: string
  name: string
  type: ChartType
  dataSourceId: string
  metrics: string[]
  dimensions: string[]
  // 网格大小
  w: 1 | 2 | 3 | 4 // 1=1/4 宽, 2=1/2, 3=3/4, 4=全宽
  h: 1 | 2 | 3 // 高度倍数
  config?: Record<string, any>
}

export interface Board {
  id: string
  name: string
  charts: ChartCard[]
}

export type DashboardKind = 'system' | 'shop' | 'mine'

export interface Dashboard {
  id: string
  name: string
  desc?: string
  kind: DashboardKind // 系统模板 / 店铺模板 / 我的
  fromTemplateId?: string
  dataSources: DataSource[]
  boards: Board[]
  owner: string
  ownerAvatar?: string
  collaborators: { name: string; color: string }[]
  permission: {
    roles: string[]
    users: string[]
    public: boolean
  }
  shared: boolean
  syncedToShop: boolean
  updatedAt: string
  createdAt: string
}

// =============== Mock 数据 ===============
export const MOCK_METRICS: MetricDef[] = [
  { id: 'm-gmv', name: '营业收入', code: 'gmv', category: '业绩', unit: '元' },
  { id: 'm-pay-amt', name: '支付金额', code: 'pay_amt', category: '业绩', unit: '元' },
  { id: 'm-orders', name: '支付笔数', code: 'orders', category: '业绩', unit: '单' },
  { id: 'm-aov', name: '客单价', code: 'aov', category: '业绩', unit: '元' },
  { id: 'm-discount', name: '折扣率', code: 'discount', category: '业绩', unit: '%' },
  { id: 'm-refund-amt', name: '退款金额', code: 'refund_amt', category: '业绩', unit: '元' },
  { id: 'm-refund-orders', name: '退款笔数', code: 'refund_orders', category: '业绩', unit: '单' },
  { id: 'm-uv', name: '访客数', code: 'uv', category: '流量', unit: '人' },
  { id: 'm-pv', name: '浏览量', code: 'pv', category: '流量', unit: '次' },
  { id: 'm-conv', name: '支付转化率', code: 'conv', category: '流量', unit: '%' },
  { id: 'm-new-user', name: '新增客户', code: 'new_user', category: '客户', unit: '人' },
  { id: 'm-active-user', name: '活跃客户', code: 'active_user', category: '客户', unit: '人' },
  { id: 'm-member-orders', name: '会员订单数', code: 'member_orders', category: '客户', unit: '单' },
  { id: 'm-storage-amt', name: '储值金额', code: 'storage_amt', category: '储值', unit: '元' },
  { id: 'm-storage-times', name: '储值笔数', code: 'storage_times', category: '储值', unit: '次' },
  { id: 'm-coupon-used', name: '优惠券使用数', code: 'coupon_used', category: '营销', unit: '张' },
  { id: 'm-campaign-roi', name: '活动 ROI', code: 'campaign_roi', category: '营销', unit: '' },
  { id: 'm-stock', name: '库存量', code: 'stock', category: '商品', unit: '件' },
  { id: 'm-sales-qty', name: '销售件数', code: 'sales_qty', category: '商品', unit: '件' },
]

export const MOCK_DIMENSIONS: DimensionDef[] = [
  { id: 'd-date', name: '日期', code: 'date', category: '时间' },
  { id: 'd-hour', name: '小时', code: 'hour', category: '时间' },
  { id: 'd-week', name: '周', code: 'week', category: '时间' },
  { id: 'd-month', name: '月', code: 'month', category: '时间' },
  { id: 'd-shop', name: '分店店铺', code: 'shop', category: '门店' },
  { id: 'd-shop-mode', name: '经营模式', code: 'shop_mode', category: '门店' },
  { id: 'd-region', name: '区域', code: 'region', category: '门店' },
  { id: 'd-channel-1', name: '一级销售渠道', code: 'channel_1', category: '渠道' },
  { id: 'd-channel-2', name: '二级销售渠道', code: 'channel_2', category: '渠道' },
  { id: 'd-product', name: '商品名称', code: 'product', category: '商品' },
  { id: 'd-sku', name: '商品条码', code: 'sku', category: '商品' },
  { id: 'd-cat-1', name: '一级分类', code: 'cat_1', category: '商品' },
  { id: 'd-cat-2', name: '二级分类', code: 'cat_2', category: '商品' },
  { id: 'd-brand', name: '商品品牌', code: 'brand', category: '商品' },
  { id: 'd-customer', name: '客户标签', code: 'customer_tag', category: '客户' },
  { id: 'd-member-level', name: '会员等级', code: 'member_level', category: '客户' },
  { id: 'd-payment', name: '支付方式', code: 'payment', category: '订单' },
]

export interface QueryReport {
  id: string
  name: string
  type: '明细报表' | '汇总报表'
  templateId?: string
  metrics: string[]
  dimensions: string[]
  owner: string
  status: '执行成功' | '执行中' | '失败'
  createdAt: string
  updatedAt: string
}

export interface QueryTemplate {
  id: string
  name: string
  desc: string
  category: '业绩' | '商品' | '财务核算' | '进销存' | '营销' | '客户' | '储值' | '流量'
  dimensions: string[]
  metrics: string[]
}

export const MOCK_TEMPLATES: QueryTemplate[] = [
  {
    id: 'tpl-001', name: '店铺业绩报表(销售单元)', category: '业绩',
    desc: '店铺业绩统计必看数据，提供整体销售、商品销售、储值、退款等关键指标，帮助监控店铺运营状况。',
    dimensions: ['d-shop', 'd-shop-mode'],
    metrics: ['m-orders', 'm-pay-amt', 'm-gmv', 'm-discount', 'm-aov', 'm-refund-orders', 'm-refund-amt'],
  },
  {
    id: 'tpl-002', name: '店铺业绩报表(销售渠道)', category: '业绩',
    desc: '店铺业绩统计必看数据，提供整体销售、商品销售、储值、退款等关键指标，帮助监控店铺运营状况。',
    dimensions: ['d-shop', 'd-shop-mode', 'd-channel-1', 'd-channel-2'],
    metrics: ['m-orders', 'm-pay-amt', 'm-gmv', 'm-discount', 'm-aov', 'm-refund-orders', 'm-refund-amt'],
  },
  {
    id: 'tpl-003', name: '店铺分时段业绩报表', category: '业绩',
    desc: '店铺业绩分时段数据，提供整体销售、商品销售、储值、退款等关键指标，帮助监控店铺运营状况。',
    dimensions: ['d-hour', 'd-shop', 'd-shop-mode', 'd-channel-1', 'd-channel-2'],
    metrics: ['m-orders', 'm-pay-amt', 'm-gmv', 'm-discount', 'm-aov', 'm-refund-orders', 'm-refund-amt'],
  },
  {
    id: 'tpl-004', name: '桌台统计报表', category: '业绩',
    desc: '统计门店桌台消费数据。',
    dimensions: ['d-shop', 'd-region'],
    metrics: ['m-orders', 'm-pay-amt'],
  },
  {
    id: 'tpl-005', name: '商品销售报表(商品名称)', category: '商品',
    desc: '商品粒度关键数据，提供商品效果关键指标，包括退货、优惠等，可以帮助您综合监控与判断商品。',
    dimensions: ['d-product', 'd-sku', 'd-cat-1', 'd-cat-2', 'd-channel-1', 'd-channel-2', 'd-brand'],
    metrics: ['m-sales-qty', 'm-pay-amt', 'm-gmv', 'm-refund-orders', 'm-discount', 'm-aov'],
  },
  {
    id: 'tpl-006', name: '商品销售报表(商品ID)', category: '商品',
    desc: '商品粒度关键数据，提供商品效果关键指标，包括退货、优惠等，可以帮助您综合监控与判断商品。',
    dimensions: ['d-product', 'd-sku', 'd-cat-1', 'd-shop', 'd-channel-1', 'd-channel-2', 'd-brand'],
    metrics: ['m-sales-qty', 'm-pay-amt', 'm-gmv', 'm-refund-orders', 'm-discount', 'm-aov'],
  },
  {
    id: 'tpl-007', name: '商品库存周转报表', category: '进销存',
    desc: '商品入库、出库与周转情况，识别滞销与畅销商品。',
    dimensions: ['d-product', 'd-sku', 'd-cat-1', 'd-shop'],
    metrics: ['m-stock', 'm-sales-qty'],
  },
  {
    id: 'tpl-008', name: '客户消费明细报表', category: '客户',
    desc: '客户维度的消费、复购、积分情况，识别高价值客户。',
    dimensions: ['d-customer', 'd-member-level', 'd-shop'],
    metrics: ['m-active-user', 'm-member-orders', 'm-pay-amt', 'm-aov'],
  },
  {
    id: 'tpl-009', name: '会员储值报表', category: '储值',
    desc: '会员储值充值、消耗与剩余统计。',
    dimensions: ['d-member-level', 'd-shop', 'd-month'],
    metrics: ['m-storage-amt', 'm-storage-times'],
  },
  {
    id: 'tpl-010', name: '营销活动效果报表', category: '营销',
    desc: '不同营销活动的核销率、ROI 与拉新表现。',
    dimensions: ['d-shop', 'd-channel-1', 'd-month'],
    metrics: ['m-coupon-used', 'm-pay-amt', 'm-campaign-roi', 'm-new-user'],
  },
  {
    id: 'tpl-011', name: '财务收支汇总报表', category: '财务核算',
    desc: '账期内的收入、退款、净额与税务相关核对数据。',
    dimensions: ['d-shop', 'd-month'],
    metrics: ['m-pay-amt', 'm-gmv', 'm-refund-amt', 'm-refund-orders'],
  },
  {
    id: 'tpl-012', name: '流量来源分析报表', category: '流量',
    desc: '不同流量入口的访客与转化情况，定位优质渠道。',
    dimensions: ['d-channel-1', 'd-channel-2', 'd-date'],
    metrics: ['m-uv', 'm-pv', 'm-conv'],
  },
]

export const MOCK_REPORTS: QueryReport[] = [
  { id: 'rpt-001', name: '订单+商品测试', type: '明细报表', templateId: 'tpl-005', dimensions: ['d-product', 'd-sku', 'd-cat-1'], metrics: ['m-sales-qty', 'm-pay-amt', 'm-gmv'], owner: '15381035876', status: '执行成功', createdAt: '2026-04-29 16:50:46', updatedAt: '2026-04-29 16:50:46' },
  { id: 'rpt-002', name: '订单+商品测试', type: '明细报表', templateId: 'tpl-005', dimensions: ['d-product', 'd-sku'], metrics: ['m-sales-qty', 'm-pay-amt'], owner: '15381035876', status: '执行成功', createdAt: '2026-04-29 16:49:56', updatedAt: '2026-04-29 16:49:56' },
  { id: 'rpt-003', name: '华东大区销售明细', type: '明细报表', templateId: 'tpl-001', dimensions: ['d-shop', 'd-region'], metrics: ['m-orders', 'm-pay-amt', 'm-gmv'], owner: '王明', status: '执行成功', createdAt: '2026-04-29 16:40:59', updatedAt: '2026-04-29 16:40:59' },
  { id: 'rpt-004', name: '门店分时段业绩', type: '汇总报表', templateId: 'tpl-003', dimensions: ['d-hour', 'd-shop'], metrics: ['m-orders', 'm-pay-amt', 'm-gmv'], owner: '李雪', status: '执行成功', createdAt: '2026-04-29 16:42:58', updatedAt: '2026-04-29 16:42:58' },
  { id: 'rpt-005', name: '618 大促渠道分析', type: '明细报表', templateId: 'tpl-002', dimensions: ['d-channel-1', 'd-channel-2'], metrics: ['m-orders', 'm-pay-amt', 'm-gmv', 'm-aov'], owner: '陈娜', status: '执行成功', createdAt: '2026-04-28 19:49:23', updatedAt: '2026-04-28 19:49:23' },
  { id: 'rpt-006', name: '订单报表测试', type: '明细报表', templateId: 'tpl-001', dimensions: ['d-shop'], metrics: ['m-orders', 'm-pay-amt'], owner: '15381035876', status: '执行成功', createdAt: '2026-04-28 19:45:07', updatedAt: '2026-04-28 19:45:07' },
  { id: 'rpt-007', name: '会员储值月度', type: '汇总报表', templateId: 'tpl-009', dimensions: ['d-member-level', 'd-month'], metrics: ['m-storage-amt', 'm-storage-times'], owner: '张伟', status: '执行成功', createdAt: '2026-04-27 10:32:14', updatedAt: '2026-04-27 10:32:14' },
  { id: 'rpt-008', name: '商品库存周转', type: '明细报表', templateId: 'tpl-007', dimensions: ['d-product', 'd-shop'], metrics: ['m-stock', 'm-sales-qty'], owner: '王明', status: '执行中', createdAt: '2026-04-27 09:22:08', updatedAt: '2026-04-27 09:22:08' },
]

// =============== 默认仪表盘种子数据 ===============
function seedBoard(name: string, charts: Omit<ChartCard, 'id'>[]): Board {
  return {
    id: 'b-' + Math.random().toString(36).slice(2, 8),
    name,
    charts: charts.map((c) => ({ ...c, id: 'c-' + Math.random().toString(36).slice(2, 8) })),
  }
}

const DEFAULT_DASHBOARDS: Dashboard[] = [
  {
    id: 'dash-system-1', name: '营业概况', desc: '系统提供的营业必看仪表盘',
    kind: 'system', fromTemplateId: 'tpl-001',
    dataSources: [
      {
        id: 'ds-sys-1', name: '店铺业绩数据', type: 'template', templateId: 'tpl-001',
        metrics: ['m-gmv', 'm-pay-amt', 'm-orders', 'm-aov', 'm-discount'],
        dimensions: ['d-date', 'd-shop'], rowCount: 30 * 12,
        createdAt: '2026-04-01 10:00:00',
      },
    ],
    boards: [
      seedBoard('核心指标', [
        { name: 'GMV', type: 'kpi', dataSourceId: 'ds-sys-1', metrics: ['m-gmv'], dimensions: [], w: 1, h: 1 },
        { name: '订单数', type: 'kpi', dataSourceId: 'ds-sys-1', metrics: ['m-orders'], dimensions: [], w: 1, h: 1 },
        { name: '客单价', type: 'kpi', dataSourceId: 'ds-sys-1', metrics: ['m-aov'], dimensions: [], w: 1, h: 1 },
        { name: '折扣率', type: 'kpi', dataSourceId: 'ds-sys-1', metrics: ['m-discount'], dimensions: [], w: 1, h: 1 },
        { name: 'GMV 趋势', type: 'line', dataSourceId: 'ds-sys-1', metrics: ['m-gmv', 'm-pay-amt'], dimensions: ['d-date'], w: 4, h: 2 },
        { name: '门店分布', type: 'bar', dataSourceId: 'ds-sys-1', metrics: ['m-gmv'], dimensions: ['d-shop'], w: 2, h: 2 },
        { name: '订单结构', type: 'pie', dataSourceId: 'ds-sys-1', metrics: ['m-orders'], dimensions: ['d-shop'], w: 2, h: 2 },
      ]),
      seedBoard('明细数据', [
        { name: '门店明细', type: 'table', dataSourceId: 'ds-sys-1', metrics: ['m-gmv', 'm-orders', 'm-aov'], dimensions: ['d-shop'], w: 4, h: 3 },
      ]),
    ],
    owner: '系统模板', ownerAvatar: '系',
    collaborators: [],
    permission: { roles: ['全员'], users: [], public: true },
    shared: true, syncedToShop: false,
    updatedAt: '今天 09:14', createdAt: '2026-03-01',
  },
  {
    id: 'dash-shop-1', name: '果果泥呀 · 旗舰仪表盘', desc: '店铺级模板，可被门店复用',
    kind: 'shop', fromTemplateId: 'tpl-001',
    dataSources: [
      {
        id: 'ds-shop-1', name: '门店业绩', type: 'template', templateId: 'tpl-002',
        metrics: ['m-gmv', 'm-pay-amt', 'm-orders'],
        dimensions: ['d-date', 'd-channel-1'], rowCount: 30 * 5,
        createdAt: '2026-04-15 10:00:00',
      },
    ],
    boards: [
      seedBoard('渠道业绩', [
        { name: 'GMV', type: 'kpi', dataSourceId: 'ds-shop-1', metrics: ['m-gmv'], dimensions: [], w: 1, h: 1 },
        { name: '渠道分布', type: 'pie', dataSourceId: 'ds-shop-1', metrics: ['m-gmv'], dimensions: ['d-channel-1'], w: 3, h: 2 },
        { name: '渠道趋势', type: 'line', dataSourceId: 'ds-shop-1', metrics: ['m-gmv'], dimensions: ['d-date'], w: 4, h: 2 },
      ]),
    ],
    owner: '陈娜 · CEO办', ownerAvatar: '陈',
    collaborators: [{ name: '李雪', color: '#a259ff' }],
    permission: { roles: ['区域运营总监', '城市运营经理'], users: [], public: false },
    shared: true, syncedToShop: true,
    updatedAt: '昨天 18:24', createdAt: '2026-04-15',
  },
  {
    id: 'dash-mine-1', name: '618 大促作战室', desc: '618 战役实时数据',
    kind: 'mine',
    dataSources: [
      {
        id: 'ds-mine-1', name: '618 实时业绩', type: 'report', reportId: 'rpt-005',
        metrics: ['m-gmv', 'm-orders', 'm-aov'],
        dimensions: ['d-channel-1', 'd-channel-2', 'd-date'], rowCount: 30 * 8,
        createdAt: '2026-04-28 19:00:00',
      },
      {
        id: 'ds-mine-2', name: '商品销售明细', type: 'direct',
        metrics: ['m-sales-qty', 'm-pay-amt'],
        dimensions: ['d-product', 'd-cat-1'], rowCount: 50,
        createdAt: '2026-04-29 14:00:00',
      },
    ],
    boards: [
      seedBoard('战役总览', [
        { name: 'GMV', type: 'kpi', dataSourceId: 'ds-mine-1', metrics: ['m-gmv'], dimensions: [], w: 1, h: 1 },
        { name: '订单数', type: 'kpi', dataSourceId: 'ds-mine-1', metrics: ['m-orders'], dimensions: [], w: 1, h: 1 },
        { name: '客单价', type: 'kpi', dataSourceId: 'ds-mine-1', metrics: ['m-aov'], dimensions: [], w: 1, h: 1 },
        { name: '渠道转化', type: 'pie', dataSourceId: 'ds-mine-1', metrics: ['m-gmv'], dimensions: ['d-channel-1'], w: 1, h: 1 },
        { name: '小时趋势', type: 'area', dataSourceId: 'ds-mine-1', metrics: ['m-gmv', 'm-orders'], dimensions: ['d-date'], w: 4, h: 2 },
        { name: '渠道排行', type: 'bar', dataSourceId: 'ds-mine-1', metrics: ['m-gmv'], dimensions: ['d-channel-2'], w: 2, h: 2 },
        { name: '商品 TOP10', type: 'table', dataSourceId: 'ds-mine-2', metrics: ['m-sales-qty', 'm-pay-amt'], dimensions: ['d-product'], w: 2, h: 2 },
      ]),
      seedBoard('品类深挖', [
        { name: '品类分布', type: 'bar', dataSourceId: 'ds-mine-2', metrics: ['m-pay-amt'], dimensions: ['d-cat-1'], w: 4, h: 2 },
      ]),
    ],
    owner: '陈 · CEO办', ownerAvatar: '陈',
    collaborators: [
      { name: '王明', color: '#4f7cff' },
      { name: '李雪', color: '#a259ff' },
    ],
    permission: { roles: ['CEO', '区域运营总监'], users: [], public: false },
    shared: true, syncedToShop: false,
    updatedAt: '今天 09:32', createdAt: '2026-04-25',
  },
  {
    id: 'dash-mine-2', name: '私域增长分析', desc: '微商城私域流量与转化',
    kind: 'mine',
    dataSources: [
      {
        id: 'ds-mine-3', name: '私域流量', type: 'direct',
        metrics: ['m-uv', 'm-conv', 'm-pay-amt'],
        dimensions: ['d-channel-1', 'd-date'], rowCount: 60,
        createdAt: '2026-04-20 10:00:00',
      },
    ],
    boards: [
      seedBoard('总览', [
        { name: '访客数', type: 'kpi', dataSourceId: 'ds-mine-3', metrics: ['m-uv'], dimensions: [], w: 1, h: 1 },
        { name: '转化率', type: 'kpi', dataSourceId: 'ds-mine-3', metrics: ['m-conv'], dimensions: [], w: 1, h: 1 },
        { name: 'GMV', type: 'kpi', dataSourceId: 'ds-mine-3', metrics: ['m-pay-amt'], dimensions: [], w: 2, h: 1 },
        { name: '渠道访客', type: 'pie', dataSourceId: 'ds-mine-3', metrics: ['m-uv'], dimensions: ['d-channel-1'], w: 2, h: 2 },
        { name: '日访问趋势', type: 'line', dataSourceId: 'ds-mine-3', metrics: ['m-uv'], dimensions: ['d-date'], w: 2, h: 2 },
      ]),
    ],
    owner: '张伟 · 增长', ownerAvatar: '张',
    collaborators: [],
    permission: { roles: [], users: ['张伟', '陈娜'], public: false },
    shared: false, syncedToShop: false,
    updatedAt: '今天 11:14', createdAt: '2026-04-20',
  },
]

// =============== Context ===============
interface DashboardCtx {
  dashboards: Dashboard[]
  getById: (id: string) => Dashboard | undefined
  create: (d: Partial<Dashboard> & { name: string }) => Dashboard
  update: (id: string, patch: Partial<Dashboard>) => void
  remove: (id: string) => void
  duplicate: (id: string) => Dashboard | undefined
  useTemplate: (templateDashboardId: string) => Dashboard | undefined
  syncToShop: (id: string) => void
}

const DashCtx = createContext<DashboardCtx | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboards, setDashboards] = useState<Dashboard[]>(DEFAULT_DASHBOARDS)

  const getById = useCallback(
    (id: string) => dashboards.find((d) => d.id === id),
    [dashboards],
  )

  const create = useCallback((d: Partial<Dashboard> & { name: string }) => {
    const now = new Date()
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const next: Dashboard = {
      id: 'dash-' + Math.random().toString(36).slice(2, 8),
      name: d.name,
      desc: d.desc || '',
      kind: d.kind || 'mine',
      fromTemplateId: d.fromTemplateId,
      dataSources: d.dataSources || [],
      boards: d.boards || [seedBoard('看板1', [])],
      owner: d.owner || '陈 · CEO办',
      ownerAvatar: d.ownerAvatar || '陈',
      collaborators: d.collaborators || [],
      permission: d.permission || { roles: [], users: [], public: false },
      shared: d.shared || false,
      syncedToShop: d.syncedToShop || false,
      updatedAt: stamp,
      createdAt: stamp,
    }
    setDashboards((prev) => [next, ...prev])
    return next
  }, [])

  const update = useCallback((id: string, patch: Partial<Dashboard>) => {
    setDashboards((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, ...patch, updatedAt: '刚刚' }
          : d,
      ),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setDashboards((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const duplicate = useCallback(
    (id: string) => {
      const src = dashboards.find((d) => d.id === id)
      if (!src) return undefined
      const copy: Dashboard = {
        ...src,
        id: 'dash-' + Math.random().toString(36).slice(2, 8),
        name: src.name + ' 副本',
        kind: 'mine',
        updatedAt: '刚刚',
        createdAt: '刚刚',
        boards: src.boards.map((b) => ({
          ...b,
          id: 'b-' + Math.random().toString(36).slice(2, 8),
          charts: b.charts.map((c) => ({
            ...c,
            id: 'c-' + Math.random().toString(36).slice(2, 8),
          })),
        })),
      }
      setDashboards((prev) => [copy, ...prev])
      return copy
    },
    [dashboards],
  )

  const useTemplate = useCallback(
    (templateDashboardId: string) => {
      const src = dashboards.find((d) => d.id === templateDashboardId)
      if (!src) return undefined
      const copy: Dashboard = {
        ...src,
        id: 'dash-' + Math.random().toString(36).slice(2, 8),
        name: src.name + ' 副本',
        kind: 'mine',
        fromTemplateId: src.id,
        updatedAt: '刚刚',
        createdAt: '刚刚',
        owner: '陈 · CEO办',
        ownerAvatar: '陈',
        boards: src.boards.map((b) => ({
          ...b,
          id: 'b-' + Math.random().toString(36).slice(2, 8),
          charts: b.charts.map((c) => ({
            ...c,
            id: 'c-' + Math.random().toString(36).slice(2, 8),
          })),
        })),
      }
      setDashboards((prev) => [copy, ...prev])
      return copy
    },
    [dashboards],
  )

  const syncToShop = useCallback((id: string) => {
    setDashboards((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, syncedToShop: true, updatedAt: '刚刚' }
          : d,
      ),
    )
  }, [])

  return (
    <DashCtx.Provider
      value={{ dashboards, getById, create, update, remove, duplicate, useTemplate, syncToShop }}
    >
      {children}
    </DashCtx.Provider>
  )
}

export function useDashboards() {
  const ctx = useContext(DashCtx)
  if (!ctx) throw new Error('useDashboards must be used inside DashboardProvider')
  return ctx
}

// =============== Helpers ===============
export function findMetric(id: string) {
  return MOCK_METRICS.find((m) => m.id === id)
}
export function findDimension(id: string) {
  return MOCK_DIMENSIONS.find((d) => d.id === id)
}
export function findTemplate(id: string) {
  return MOCK_TEMPLATES.find((t) => t.id === id)
}
export function findReport(id: string) {
  return MOCK_REPORTS.find((r) => r.id === id)
}
