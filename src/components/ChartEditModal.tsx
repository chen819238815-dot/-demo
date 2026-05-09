import { useEffect, useMemo, useState } from 'react'
import { Modal, Input, Select, Tag, message, Radio, Empty } from 'antd'
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  TableOutlined,
  DashboardOutlined,
  FunnelPlotOutlined,
  DotChartOutlined,
  FundOutlined,
} from '@ant-design/icons'
import {
  ChartCard,
  ChartType,
  DataSource,
  findDimension,
  findMetric,
} from '../store/dashboard'
import ChartView from './ChartView'

const CHART_OPTIONS: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  { value: 'line', label: '曲线图', icon: <LineChartOutlined /> },
  { value: 'bar', label: '柱状图', icon: <BarChartOutlined /> },
  { value: 'pie', label: '饼图', icon: <PieChartOutlined /> },
  { value: 'area', label: '面积图', icon: <AreaChartOutlined /> },
  { value: 'kpi', label: '指标卡', icon: <FundOutlined /> },
  { value: 'table', label: '明细表', icon: <TableOutlined /> },
  { value: 'funnel', label: '漏斗图', icon: <FunnelPlotOutlined /> },
  { value: 'scatter', label: '散点图', icon: <DotChartOutlined /> },
  { value: 'gauge', label: '仪表盘', icon: <DashboardOutlined /> },
]

const SIZE_OPTIONS: { w: 1 | 2 | 3 | 4; h: 1 | 2 | 3; label: string }[] = [
  { w: 1, h: 1, label: '小（1/4 宽）' },
  { w: 2, h: 1, label: '中（1/2 宽）' },
  { w: 2, h: 2, label: '中（1/2 宽 · 高）' },
  { w: 3, h: 2, label: '大（3/4 宽 · 高）' },
  { w: 4, h: 2, label: '超大（全宽）' },
]

export default function ChartEditModal({
  open,
  onClose,
  onConfirm,
  initial,
  dataSources,
  defaultDataSourceId,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (chart: ChartCard) => void
  initial?: ChartCard | null
  dataSources: DataSource[]
  defaultDataSourceId?: string
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<ChartType>('line')
  const [dsId, setDsId] = useState<string | undefined>()
  const [metrics, setMetrics] = useState<string[]>([])
  const [dimensions, setDimensions] = useState<string[]>([])
  const [w, setW] = useState<1 | 2 | 3 | 4>(2)
  const [h, setH] = useState<1 | 2 | 3>(2)

  useEffect(() => {
    if (open) {
      if (initial) {
        setName(initial.name)
        setType(initial.type)
        setDsId(initial.dataSourceId)
        setMetrics(initial.metrics)
        setDimensions(initial.dimensions)
        setW(initial.w)
        setH(initial.h)
      } else {
        setName('')
        setType('line')
        setDsId(defaultDataSourceId || dataSources[0]?.id)
        setMetrics([])
        setDimensions([])
        setW(2)
        setH(2)
      }
    }
  }, [open, initial, defaultDataSourceId, dataSources])

  const ds = dataSources.find((d) => d.id === dsId)
  const availMetrics = ds?.metrics || []
  const availDims = ds?.dimensions || []

  const previewChart: ChartCard = useMemo(
    () => ({
      id: 'preview',
      name: name || '预览',
      type,
      dataSourceId: dsId || '',
      metrics,
      dimensions,
      w,
      h,
    }),
    [name, type, dsId, metrics, dimensions, w, h],
  )

  const handleOk = () => {
    if (!name.trim()) {
      message.warning('请填写图表名称')
      return
    }
    if (!dsId) {
      message.warning('请选择数据源')
      return
    }
    if (metrics.length === 0) {
      message.warning('至少选择一个指标')
      return
    }
    if ((type === 'kpi' || type === 'gauge') && metrics.length > 1) {
      message.warning('指标卡 / 仪表盘仅支持 1 个指标')
      return
    }
    if (type !== 'kpi' && type !== 'gauge' && dimensions.length === 0) {
      message.warning('请至少选择一个维度')
      return
    }
    const chart: ChartCard = {
      id: initial?.id || 'c-' + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      type,
      dataSourceId: dsId,
      metrics,
      dimensions,
      w,
      h,
    }
    onConfirm(chart)
  }

  return (
    <Modal
      title={initial ? '编辑图表' : '新增图表'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="保存"
      cancelText="取消"
      width={900}
      destroyOnClose
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* 左：配置 */}
        <div>
          <div className="row gap-12 mb-12" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: 13, width: 70, textAlign: 'right' }}>
              图表名称<span style={{ color: '#f53f3f' }}>*</span>
            </span>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入图表名称"
            />
          </div>

          <div className="row gap-12 mb-12" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: 13, width: 70, textAlign: 'right' }}>
              数据源<span style={{ color: '#f53f3f' }}>*</span>
            </span>
            <Select
              style={{ flex: 1 }}
              value={dsId}
              onChange={(v) => {
                setDsId(v)
                setMetrics([])
                setDimensions([])
              }}
              options={dataSources.map((d) => ({ value: d.id, label: d.name }))}
              placeholder="请选择数据源"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="text-strong mb-8" style={{ fontSize: 13 }}>
              图表类型
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}
            >
              {CHART_OPTIONS.map((c) => (
                <div
                  key={c.value}
                  onClick={() => setType(c.value)}
                  style={{
                    border:
                      type === c.value
                        ? '1.5px solid #4f7cff'
                        : '1px solid #e6eaf2',
                    background: type === c.value ? '#f0f5ff' : '#fff',
                    color: type === c.value ? '#4f7cff' : '#4e5969',
                    borderRadius: 6,
                    padding: '10px 8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: 12.5,
                    fontWeight: type === c.value ? 500 : 400,
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{c.icon}</div>
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {!ds && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="先选择一个数据源以配置指标维度"
            />
          )}

          {ds && (
            <>
              <div className="text-strong mb-8" style={{ fontSize: 13 }}>
                选择指标<span style={{ color: '#f53f3f', marginLeft: 4 }}>*</span>{' '}
                <span className="muted-12">（来自数据源「{ds.name}」）</span>
              </div>
              <div className="row gap-4 mb-12" style={{ flexWrap: 'wrap' }}>
                {availMetrics.map((id) => {
                  const sel = metrics.includes(id)
                  return (
                    <Tag.CheckableTag
                      key={id}
                      checked={sel}
                      onChange={() =>
                        setMetrics(
                          sel ? metrics.filter((x) => x !== id) : [...metrics, id],
                        )
                      }
                      style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 12,
                        border: sel ? '1px solid #4f7cff' : '1px solid #d4dcec',
                      }}
                    >
                      {findMetric(id)?.name}
                    </Tag.CheckableTag>
                  )
                })}
              </div>

              {type !== 'kpi' && type !== 'gauge' && (
                <>
                  <div className="text-strong mb-8" style={{ fontSize: 13 }}>
                    选择维度<span style={{ color: '#f53f3f', marginLeft: 4 }}>*</span>
                  </div>
                  <div className="row gap-4 mb-12" style={{ flexWrap: 'wrap' }}>
                    {availDims.map((id) => {
                      const sel = dimensions.includes(id)
                      return (
                        <Tag.CheckableTag
                          key={id}
                          checked={sel}
                          onChange={() =>
                            setDimensions(
                              sel
                                ? dimensions.filter((x) => x !== id)
                                : [...dimensions, id],
                            )
                          }
                          style={{
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontSize: 12,
                            border: sel ? '1px solid #00b42a' : '1px solid #d4dcec',
                          }}
                        >
                          {findDimension(id)?.name}
                        </Tag.CheckableTag>
                      )
                    })}
                  </div>
                </>
              )}

              <div className="text-strong mb-8" style={{ fontSize: 13 }}>
                卡片大小
              </div>
              <Radio.Group
                value={`${w}-${h}`}
                onChange={(e) => {
                  const [nw, nh] = e.target.value.split('-').map(Number) as [
                    1 | 2 | 3 | 4,
                    1 | 2 | 3,
                  ]
                  setW(nw)
                  setH(nh)
                }}
              >
                {SIZE_OPTIONS.map((s) => (
                  <Radio.Button key={`${s.w}-${s.h}`} value={`${s.w}-${s.h}`}>
                    {s.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </>
          )}
        </div>

        {/* 右：预览 */}
        <div>
          <div className="text-strong mb-8" style={{ fontSize: 13 }}>
            预览
          </div>
          <div
            className="chart-tile"
            style={{ minHeight: 300 }}
          >
            <div className="tile-head">
              <div className="tile-name">{name || '图表名称预览'}</div>
            </div>
            <div className="tile-body">
              {metrics.length === 0 ? (
                <div
                  style={{
                    height: 240,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#bfbfbf',
                  }}
                >
                  请选择指标后查看预览
                </div>
              ) : (
                <ChartView chart={previewChart} height={260} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
