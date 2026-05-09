import ReactECharts from 'echarts-for-react'
import { Empty, Statistic, Table } from 'antd'
import { ChartCard, findDimension, findMetric } from '../store/dashboard'
import { makeKpiValue, makePieData, makeSeriesData, makeTableData } from '../data/chartMock'

const COLORS = ['#4f7cff', '#a259ff', '#00b42a', '#ff7d00', '#f53f3f', '#722ed1', '#13c2c2', '#eb2f96']

function metricName(id: string) {
  return findMetric(id)?.name || id
}
function dimensionName(id: string) {
  return findDimension(id)?.name || id
}

export default function ChartView({
  chart,
  height,
  compact,
}: {
  chart: ChartCard
  height?: number
  /** 列表卡片等小尺寸预览 */
  compact?: boolean
}) {
  const h = height ?? (compact ? 76 : 220)
  const { type, metrics, dimensions } = chart

  if (metrics.length === 0) {
    return (
      <div style={{ height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未配置指标" />
      </div>
    )
  }

  if (type === 'kpi') {
    const m = metrics[0]
    const v = makeKpiValue(m)
    const isPercent = v.unit === '%'
    return (
      <div
        style={{
          height: h,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: compact ? '2px 2px' : '4px 4px',
        }}
      >
        <div
          style={{
            fontSize: compact ? 11 : 12,
            color: '#86909c',
            marginBottom: compact ? 4 : 8,
          }}
        >
          {metricName(m)}
        </div>
        <Statistic
          value={v.value}
          precision={isPercent ? 1 : v.value > 1000 ? 0 : 2}
          suffix={
            <span style={{ fontSize: compact ? 11 : 14, color: '#86909c', marginLeft: 4 }}>
              {v.unit}
            </span>
          }
          valueStyle={{
            fontSize: compact ? 20 : 28,
            fontWeight: 700,
            color: '#1f2329',
            fontFamily: 'DIN Alternate, sans-serif',
          }}
        />
        <div
          style={{
            marginTop: compact ? 2 : 6,
            fontSize: compact ? 10 : 12,
            color: v.delta >= 0 ? '#f53f3f' : '#00b42a',
          }}
        >
          {v.delta >= 0 ? '↑' : '↓'} {Math.abs(v.delta)}%{' '}
          <span style={{ color: '#86909c', marginLeft: 4 }}>同比</span>
        </div>
      </div>
    )
  }

  if (type === 'table') {
    const data = makeTableData(metrics, dimensions, 8)
    if (compact) {
      return (
        <div
          style={{
            height: h,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            fontSize: 11,
            color: '#86909c',
          }}
        >
          <span style={{ color: '#4e5969', fontWeight: 500, marginBottom: 4 }}>明细表</span>
          <span>
            {metrics.length} 指标 · {data.length} 行
          </span>
        </div>
      )
    }
    const columns = [
      ...dimensions.map((d) => ({
        title: dimensionName(d),
        dataIndex: d,
        key: d,
      })),
      ...metrics.map((m) => ({
        title: metricName(m),
        dataIndex: m,
        key: m,
        align: 'right' as const,
        render: (v: number) => v?.toLocaleString('zh-CN', { maximumFractionDigits: 2 }),
      })),
    ]
    return (
      <Table
        size="small"
        dataSource={data.map((d, i) => ({ ...d, key: i }))}
        columns={columns}
        pagination={false}
        scroll={{ y: h - 50 }}
        className="compact-table"
      />
    )
  }

  if (type === 'pie') {
    const data = makePieData(metrics[0], dimensions[0] || 'd-shop')
    const option = {
      tooltip: { trigger: 'item' },
      legend: compact
        ? { show: false }
        : { orient: 'vertical', right: 8, top: 'middle', textStyle: { fontSize: 11 } },
      color: COLORS,
      series: [
        {
          name: metricName(metrics[0]),
          type: 'pie',
          radius: compact ? ['32%', '62%'] : ['38%', '68%'],
          center: compact ? ['50%', '52%'] : ['38%', '50%'],
          label: { show: !compact, formatter: '{d}%', fontSize: 11 },
          data,
        },
      ],
    }
    return <ReactECharts option={option} style={{ height: h }} />
  }

  if (type === 'funnel') {
    const data = makePieData(metrics[0], dimensions[0] || 'd-shop')
    const option = {
      tooltip: { trigger: 'item' },
      color: COLORS,
      series: [
        {
          type: 'funnel',
          left: compact ? 12 : 24,
          top: compact ? 8 : 16,
          bottom: compact ? 8 : 16,
          width: compact ? '78%' : '70%',
          label: { fontSize: compact ? 9 : 11 },
          data,
        },
      ],
    }
    return <ReactECharts option={option} style={{ height: h }} />
  }

  if (type === 'gauge') {
    const v = makeKpiValue(metrics[0])
    const max = v.unit === '%' ? 100 : v.value * 1.2
    const option = {
      series: [
        {
          type: 'gauge',
          radius: compact ? '88%' : '80%',
          center: ['50%', '60%'],
          progress: { show: true, width: compact ? 10 : 14 },
          axisLine: { lineStyle: { width: compact ? 10 : 14 } },
          axisTick: { show: false },
          splitLine: { length: 8 },
          axisLabel: { distance: 14, fontSize: compact ? 8 : 10 },
          pointer: { length: '60%', width: compact ? 3 : 4 },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, '70%'],
            fontSize: compact ? 14 : 18,
            color: '#1f2329',
            formatter: '{value}' + (v.unit ? v.unit : ''),
          },
          data: [{ value: v.value, name: metricName(metrics[0]) }],
          max,
        },
      ],
    }
    return <ReactECharts option={option} style={{ height: h }} />
  }

  if (type === 'scatter') {
    const xMetric = metrics[0]
    const yMetric = metrics[1] || metrics[0]
    const dimVals = makePieData(xMetric, dimensions[0] || 'd-shop')
    const data = dimVals.map((p) => [
      p.value,
      Math.round(p.value * (0.6 + Math.random() * 0.6) * 10) / 10,
      p.name,
    ])
    const option = {
      tooltip: {
        formatter: (p: any) =>
          `${p.value[2]}<br/>${metricName(xMetric)}: ${p.value[0]}<br/>${metricName(yMetric)}: ${p.value[1]}`,
      },
      grid: compact
        ? { left: 36, right: 8, top: 8, bottom: 22 }
        : { left: 50, right: 16, top: 20, bottom: 30 },
      xAxis: { type: 'value', name: metricName(xMetric), nameTextStyle: { fontSize: compact ? 9 : 11 } },
      yAxis: { type: 'value', name: metricName(yMetric), nameTextStyle: { fontSize: compact ? 9 : 11 } },
      color: COLORS,
      series: [{ type: 'scatter', symbolSize: compact ? 10 : 16, data }],
    }
    return <ReactECharts option={option} style={{ height: h }} />
  }

  // line / bar / area
  const { x, series } = makeSeriesData(metrics, dimensions.length ? dimensions : ['d-date'])
  const g = compact
    ? { left: 28, right: 4, top: 4, bottom: 14, containLabel: false }
    : { left: 56, right: 16, top: 28, bottom: 36, containLabel: false }
  const option = {
    color: COLORS,
    tooltip: { trigger: 'axis' },
    grid: g,
    legend: compact
      ? { show: false }
      : { top: 0, right: 8, textStyle: { fontSize: 11 }, type: 'scroll' },
    xAxis: {
      type: 'category',
      data: x,
      axisLabel: { fontSize: compact ? 8 : 10, color: '#86909c' },
      axisLine: { lineStyle: { color: '#eef0f3' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: compact ? 8 : 10, color: '#86909c' },
      splitLine: { lineStyle: { color: '#f1f3f6' } },
    },
    series: series.map((s) => ({
      name: metricName(s.name),
      type: type === 'bar' ? 'bar' : 'line',
      data: s.data,
      smooth: type !== 'bar',
      areaStyle: type === 'area' ? { opacity: 0.16 } : undefined,
      symbol: type === 'bar' ? undefined : 'circle',
      symbolSize: compact ? 4 : 6,
      barMaxWidth: compact ? 14 : 24,
    })),
  }
  return <ReactECharts option={option} style={{ height: h }} />
}
