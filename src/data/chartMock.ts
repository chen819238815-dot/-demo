import dayjs from 'dayjs'

// 根据指标 id 生成模拟数值（确定性的：同 id 数值范围接近）
const seedFor = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000003
  return h
}

export function makeKpiValue(metricId: string): { value: number; delta: number; unit: string } {
  const seed = seedFor(metricId)
  let value = 0
  let unit = ''
  if (metricId.includes('gmv') || metricId.includes('pay-amt')) {
    value = 800000 + (seed % 800000)
    unit = '元'
  } else if (metricId.includes('orders') || metricId.includes('member-orders')) {
    value = 5000 + (seed % 18000)
    unit = '单'
  } else if (metricId.includes('aov')) {
    value = 50 + (seed % 80)
    unit = '元'
  } else if (metricId.includes('discount') || metricId.includes('conv')) {
    value = 5 + (seed % 30)
    unit = '%'
  } else if (metricId.includes('refund-amt')) {
    value = 20000 + (seed % 60000)
    unit = '元'
  } else if (metricId.includes('refund-orders')) {
    value = 100 + (seed % 800)
    unit = '单'
  } else if (metricId.includes('uv')) {
    value = 10000 + (seed % 80000)
    unit = '人'
  } else if (metricId.includes('pv')) {
    value = 30000 + (seed % 200000)
    unit = '次'
  } else if (metricId.includes('user')) {
    value = 1000 + (seed % 8000)
    unit = '人'
  } else if (metricId.includes('storage-amt')) {
    value = 100000 + (seed % 200000)
    unit = '元'
  } else if (metricId.includes('coupon')) {
    value = 1000 + (seed % 6000)
    unit = '张'
  } else if (metricId.includes('campaign-roi')) {
    value = 3 + ((seed % 100) / 10)
    unit = ''
  } else if (metricId.includes('stock')) {
    value = 200 + (seed % 1500)
    unit = '件'
  } else if (metricId.includes('sales-qty')) {
    value = 500 + (seed % 3000)
    unit = '件'
  } else {
    value = 100 + (seed % 1000)
  }
  const delta = ((seed % 250) - 100) / 10
  return { value: Math.round(value * 10) / 10, delta: Math.round(delta * 10) / 10, unit }
}

const SHOPS = ['上海中山店', '北京三里屯店', '广州天河店', '深圳福田店', '杭州万象城']
const CHANNELS = ['抖音', '小红书', '微信小程序', '门店扫码', '电商平台']
const CATEGORIES = ['美妆护肤', '服装配饰', '食品饮料', '母婴用品', '家居生活']
const PRODUCTS = [
  '雅诗兰黛小棕瓶 50ml', '兰蔻小黑瓶 30ml', '海蓝之谜面霜 30ml', 'SK-II 神仙水 230ml',
  '雅顿粉胶 90粒', '资生堂红腰子 50ml', '欧莱雅紫熨斗眼霜', '资生堂红妍肌活精华',
]

function dimensionValues(dimId: string, count = 6): string[] {
  if (dimId.includes('shop')) return SHOPS.slice(0, count)
  if (dimId.includes('channel')) return CHANNELS.slice(0, count)
  if (dimId.includes('cat')) return CATEGORIES.slice(0, count)
  if (dimId.includes('product')) return PRODUCTS.slice(0, count)
  if (dimId.includes('member-level')) return ['钻石', '金卡', '银卡', '普通', '游客']
  if (dimId.includes('region')) return ['华东', '华北', '华南', '西南', '华中', '西北']
  if (dimId.includes('hour')) return Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`)
  if (dimId.includes('week')) return ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  if (dimId.includes('month')) return Array.from({ length: 6 }, (_, i) => dayjs().subtract(5 - i, 'month').format('M月'))
  if (dimId.includes('payment')) return ['支付宝', '微信', '现金', '银行卡', '储值']
  if (dimId.includes('customer')) return ['新客', '老客', '高活', '沉睡', '流失']
  return ['项 A', '项 B', '项 C', '项 D', '项 E']
}

export function makeSeriesData(metricIds: string[], dimensionIds: string[]) {
  const dimId = dimensionIds[0] || 'd-date'
  if (dimId === 'd-date') {
    const days = 30
    const x = Array.from({ length: days }, (_, i) =>
      dayjs().subtract(days - 1 - i, 'day').format('MM-DD'),
    )
    const series = metricIds.map((mid) => {
      const seed = seedFor(mid)
      return {
        name: mid,
        data: x.map((_, i) => {
          const base = makeKpiValue(mid).value / 30
          return Math.round(
            (base * (0.6 + Math.sin(i / 3 + seed / 50) * 0.3 + Math.random() * 0.2)) * 100,
          ) / 100
        }),
      }
    })
    return { x, series }
  }

  const x = dimensionValues(dimId, 6)
  const series = metricIds.map((mid) => {
    return {
      name: mid,
      data: x.map((_, i) => {
        const base = makeKpiValue(mid).value / x.length
        const seed = seedFor(mid + i)
        return Math.round((base * (0.6 + (seed % 100) / 100)) * 10) / 10
      }),
    }
  })
  return { x, series }
}

export function makePieData(metricId: string, dimensionId: string) {
  const labels = dimensionValues(dimensionId, 5)
  const total = makeKpiValue(metricId).value
  return labels.map((label, i) => ({
    name: label,
    value: Math.round(total * (0.5 - i * 0.07) * (0.6 + Math.random() * 0.4) * 10) / 10,
  }))
}

export function makeTableData(metricIds: string[], dimensionIds: string[], rows = 8) {
  const dimVals: string[][] = dimensionIds.map((d) => dimensionValues(d, rows))
  const data: Record<string, any>[] = []
  for (let r = 0; r < rows; r++) {
    const row: Record<string, any> = {}
    dimensionIds.forEach((d, i) => {
      row[d] = dimVals[i][r % dimVals[i].length]
    })
    metricIds.forEach((m) => {
      const base = makeKpiValue(m).value / rows
      row[m] = Math.round(base * (0.4 + Math.random()) * 100) / 100
    })
    data.push(row)
  }
  return data
}
