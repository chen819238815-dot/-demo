import { useMemo, useState } from 'react'
import { Modal, Input, Tag, Empty, message } from 'antd'
import {
  AppstoreOutlined,
  FileSearchOutlined,
  FormOutlined,
  PlusCircleFilled,
  MinusCircleFilled,
  SearchOutlined,
} from '@ant-design/icons'
import {
  DataSource,
  MOCK_DIMENSIONS,
  MOCK_METRICS,
  MOCK_REPORTS,
  MOCK_TEMPLATES,
  findDimension,
  findMetric,
} from '../store/dashboard'

type Method = 'template' | 'report' | 'direct'

const TEMPLATE_CATS = ['全部', '业绩', '商品', '财务核算', '进销存', '营销', '客户', '储值', '流量']

export default function DataSourceModal({
  open,
  onClose,
  onConfirm,
  initial,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (ds: DataSource) => void
  initial?: DataSource | null
}) {
  const [name, setName] = useState(initial?.name || '')
  const [method, setMethod] = useState<Method>(initial?.type || 'template')
  const [tplId, setTplId] = useState<string | undefined>(initial?.templateId)
  const [reportId, setReportId] = useState<string | undefined>(initial?.reportId)
  const [tplCat, setTplCat] = useState<string>('全部')
  const [tplKw, setTplKw] = useState('')
  const [rptKw, setRptKw] = useState('')
  const [metricSel, setMetricSel] = useState<string[]>(initial?.metrics || [])
  const [dimSel, setDimSel] = useState<string[]>(initial?.dimensions || [])

  const filteredTpls = useMemo(() => {
    return MOCK_TEMPLATES.filter(
      (t) =>
        (tplCat === '全部' || t.category === tplCat) &&
        (!tplKw || t.name.includes(tplKw) || t.desc.includes(tplKw)),
    )
  }, [tplCat, tplKw])

  const filteredReports = useMemo(
    () => MOCK_REPORTS.filter((r) => !rptKw || r.name.includes(rptKw)),
    [rptKw],
  )

  const onMethodChange = (m: Method) => {
    setMethod(m)
    setTplId(undefined)
    setReportId(undefined)
    if (m === 'direct') {
      // Keep current selection
    } else {
      setMetricSel([])
      setDimSel([])
    }
  }

  const onSelectTpl = (id: string) => {
    const tpl = MOCK_TEMPLATES.find((t) => t.id === id)
    if (!tpl) return
    setTplId(id)
    setMetricSel(tpl.metrics)
    setDimSel(tpl.dimensions)
    if (!name) setName(tpl.name)
  }

  const onSelectReport = (id: string) => {
    const r = MOCK_REPORTS.find((x) => x.id === id)
    if (!r) return
    setReportId(id)
    setMetricSel(r.metrics)
    setDimSel(r.dimensions)
    if (!name) setName(r.name)
  }

  const handleOk = () => {
    if (!name.trim()) {
      message.warning('请填写数据源名称')
      return
    }
    if (metricSel.length === 0) {
      message.warning('至少选择一个指标')
      return
    }
    if (method === 'template' && !tplId) {
      message.warning('请选择一个模板')
      return
    }
    if (method === 'report' && !reportId) {
      message.warning('请选择一个已有报表')
      return
    }
    const ds: DataSource = {
      id: initial?.id || 'ds-' + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      type: method,
      templateId: method === 'template' ? tplId : undefined,
      reportId: method === 'report' ? reportId : undefined,
      metrics: metricSel,
      dimensions: dimSel,
      rowCount: Math.max(20, dimSel.length * 30 + metricSel.length * 5),
      createdAt:
        initial?.createdAt ||
        new Date().toISOString().slice(0, 16).replace('T', ' '),
    }
    onConfirm(ds)
  }

  return (
    <Modal
      title={initial ? '编辑数据源' : '新建数据源'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="保存数据源"
      cancelText="取消"
      width={780}
      destroyOnClose
    >
      {/* 基础信息 */}
      <div className="row gap-12 mb-16" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#1f2329', width: 96, textAlign: 'right' }}>
          数据源名称 <span style={{ color: '#f53f3f' }}>*</span>
        </span>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：618 战役业绩数据"
          style={{ flex: 1 }}
        />
      </div>

      {/* 三种创建方式 */}
      <div className="method-row">
        <div
          className={`method-card ${method === 'template' ? 'active' : ''}`}
          onClick={() => onMethodChange('template')}
        >
          <span className="m-check" />
          <div className="m-icon">
            <AppstoreOutlined />
          </div>
          <div className="m-title">方式一 · 模板创建</div>
          <div className="m-desc">从自助取数模板库中选择，自动生成数据源</div>
        </div>
        <div
          className={`method-card ${method === 'report' ? 'active' : ''}`}
          onClick={() => onMethodChange('report')}
        >
          <span className="m-check" />
          <div className="m-icon">
            <FileSearchOutlined />
          </div>
          <div className="m-title">方式二 · 已有报表</div>
          <div className="m-desc">复用已经在自助取数中创建的报表</div>
        </div>
        <div
          className={`method-card ${method === 'direct' ? 'active' : ''}`}
          onClick={() => onMethodChange('direct')}
        >
          <span className="m-check" />
          <div className="m-icon">
            <FormOutlined />
          </div>
          <div className="m-title">方式三 · 直接创建</div>
          <div className="m-desc">从指标库与维度库中自由组合</div>
        </div>
      </div>

      {/* 不同方式的内容 */}
      {method === 'template' && (
        <div>
          <div
            className="row gap-8 mb-12"
            style={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="搜索模板名称"
              style={{ width: 220 }}
              value={tplKw}
              onChange={(e) => setTplKw(e.target.value)}
              size="small"
            />
            <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
              {TEMPLATE_CATS.map((c) => (
                <Tag.CheckableTag
                  key={c}
                  checked={tplCat === c}
                  onChange={() => setTplCat(c)}
                  style={{ fontSize: 12, padding: '2px 10px', borderRadius: 12 }}
                >
                  {c}
                </Tag.CheckableTag>
              ))}
            </div>
          </div>
          <div
            style={{
              maxHeight: 320,
              overflow: 'auto',
              padding: 4,
              border: '1px solid #eef0f3',
              borderRadius: 8,
              background: '#fafbfc',
            }}
          >
            {filteredTpls.length === 0 && <Empty description="暂无匹配模板" />}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 8,
                padding: 4,
              }}
            >
              {filteredTpls.map((t) => (
                <div
                  key={t.id}
                  className={`selectable-row ${tplId === t.id ? 'active' : ''}`}
                  onClick={() => onSelectTpl(t.id)}
                  style={{ marginBottom: 0 }}
                >
                  <div className="sr-icon">
                    <AppstoreOutlined />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="sr-name">{t.name}</div>
                    <div
                      className="sr-desc"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      维度 {t.dimensions.length} · 指标 {t.metrics.length}
                    </div>
                  </div>
                  <Tag color="blue" style={{ marginRight: 0 }}>
                    {t.category}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {method === 'report' && (
        <div>
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="搜索已有报表"
            style={{ width: 240, marginBottom: 12 }}
            value={rptKw}
            onChange={(e) => setRptKw(e.target.value)}
            size="small"
          />
          <div
            style={{
              maxHeight: 320,
              overflow: 'auto',
              padding: 4,
              border: '1px solid #eef0f3',
              borderRadius: 8,
              background: '#fafbfc',
            }}
          >
            {filteredReports.length === 0 && <Empty description="暂无匹配报表" />}
            {filteredReports.map((r) => (
              <div
                key={r.id}
                className={`selectable-row ${reportId === r.id ? 'active' : ''}`}
                onClick={() => onSelectReport(r.id)}
              >
                <div className="sr-icon">
                  <FileSearchOutlined />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="sr-name">{r.name}</div>
                  <div className="sr-desc">
                    {r.type} · 维度 {r.dimensions.length} · 指标 {r.metrics.length} · 创建于{' '}
                    {r.createdAt}
                  </div>
                </div>
                <Tag
                  color={r.status === '执行成功' ? 'green' : r.status === '执行中' ? 'blue' : 'red'}
                >
                  {r.status}
                </Tag>
              </div>
            ))}
          </div>
        </div>
      )}

      {method === 'direct' && (
        <DirectFieldPicker
          metricSel={metricSel}
          dimSel={dimSel}
          onMetric={setMetricSel}
          onDim={setDimSel}
        />
      )}

      {/* 已选预览 */}
      {(method === 'template' || method === 'report') && metricSel.length > 0 && (
        <div className="section-card mt-16" style={{ marginBottom: 0 }}>
          <div className="section-body">
            <div className="row gap-8 mb-8" style={{ alignItems: 'center' }}>
              <span className="text-strong" style={{ fontSize: 13 }}>
                已选维度（{dimSel.length}）：
              </span>
              <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
                {dimSel.map((id) => (
                  <span key={id} className="field-chip dimension">
                    {findDimension(id)?.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="row gap-8" style={{ alignItems: 'center' }}>
              <span className="text-strong" style={{ fontSize: 13 }}>
                已选指标（{metricSel.length}）：
              </span>
              <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
                {metricSel.map((id) => (
                  <span key={id} className="field-chip metric">
                    {findMetric(id)?.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

// =============== 直接创建 - 字段选择器 ===============
function DirectFieldPicker({
  metricSel,
  dimSel,
  onMetric,
  onDim,
}: {
  metricSel: string[]
  dimSel: string[]
  onMetric: (v: string[]) => void
  onDim: (v: string[]) => void
}) {
  const [tab, setTab] = useState<'dim' | 'metric'>('dim')

  const groupedDims = useMemo(() => {
    const m: Record<string, typeof MOCK_DIMENSIONS> = {}
    MOCK_DIMENSIONS.forEach((d) => {
      m[d.category] = m[d.category] || []
      m[d.category].push(d)
    })
    return m
  }, [])

  const groupedMetrics = useMemo(() => {
    const m: Record<string, typeof MOCK_METRICS> = {}
    MOCK_METRICS.forEach((d) => {
      m[d.category] = m[d.category] || []
      m[d.category].push(d)
    })
    return m
  }, [])

  return (
    <div>
      <div className="builder-tabs" style={{ marginBottom: 8 }}>
        <div
          className={`builder-tab ${tab === 'dim' ? 'active' : ''}`}
          onClick={() => setTab('dim')}
          style={{ padding: '8px 14px', fontSize: 13 }}
        >
          维度（{dimSel.length}）
        </div>
        <div
          className={`builder-tab ${tab === 'metric' ? 'active' : ''}`}
          onClick={() => setTab('metric')}
          style={{ padding: '8px 14px', fontSize: 13 }}
        >
          指标（{metricSel.length}）
        </div>
      </div>

      <div className="fields-tray">
        {/* 左侧：可选 */}
        <div className="pane">
          <div className="pane-head">
            <span>{tab === 'dim' ? '维度库' : '指标库'}</span>
            <span className="muted-12">点击 + 添加</span>
          </div>
          <div className="pane-body">
            {tab === 'dim' &&
              Object.entries(groupedDims).map(([cat, list]) => (
                <div key={cat} style={{ marginBottom: 6 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#bfbfbf',
                      fontWeight: 500,
                      padding: '6px 8px 2px',
                    }}
                  >
                    {cat}
                  </div>
                  {list.map((d) => {
                    const sel = dimSel.includes(d.id)
                    return (
                      <div
                        key={d.id}
                        className={`field-row ${sel ? 'selected' : ''}`}
                        onClick={() =>
                          sel
                            ? onDim(dimSel.filter((x) => x !== d.id))
                            : onDim([...dimSel, d.id])
                        }
                      >
                        <span style={{ color: '#00b42a', fontSize: 12 }}>D</span>
                        {d.name}
                        <span className="f-add">{sel ? <MinusCircleFilled style={{ color: '#f53f3f' }} /> : <PlusCircleFilled />}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            {tab === 'metric' &&
              Object.entries(groupedMetrics).map(([cat, list]) => (
                <div key={cat} style={{ marginBottom: 6 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#bfbfbf',
                      fontWeight: 500,
                      padding: '6px 8px 2px',
                    }}
                  >
                    {cat}
                  </div>
                  {list.map((m) => {
                    const sel = metricSel.includes(m.id)
                    return (
                      <div
                        key={m.id}
                        className={`field-row ${sel ? 'selected' : ''}`}
                        onClick={() =>
                          sel
                            ? onMetric(metricSel.filter((x) => x !== m.id))
                            : onMetric([...metricSel, m.id])
                        }
                      >
                        <span style={{ color: '#4f7cff', fontSize: 12 }}>M</span>
                        {m.name}
                        {m.unit && <span className="f-cat">/ {m.unit}</span>}
                        <span className="f-add">{sel ? <MinusCircleFilled style={{ color: '#f53f3f' }} /> : <PlusCircleFilled />}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
          </div>
        </div>

        {/* 右侧：已选 */}
        <div className="pane">
          <div className="pane-head">
            <span>已选字段</span>
            <span className="muted-12">维度 {dimSel.length} · 指标 {metricSel.length}</span>
          </div>
          <div className="pane-body">
            <div className="text-strong mb-8" style={{ fontSize: 12, color: '#00b42a' }}>
              维度
            </div>
            <div className="row gap-4 mb-12" style={{ flexWrap: 'wrap' }}>
              {dimSel.length === 0 && <span className="muted-12">尚未选择维度</span>}
              {dimSel.map((id) => (
                <span key={id} className="field-chip dimension">
                  {findDimension(id)?.name}
                  <span
                    className="close"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDim(dimSel.filter((x) => x !== id))
                    }}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>

            <div className="text-strong mb-8" style={{ fontSize: 12, color: '#4f7cff' }}>
              指标
            </div>
            <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
              {metricSel.length === 0 && <span className="muted-12">尚未选择指标</span>}
              {metricSel.map((id) => (
                <span key={id} className="field-chip metric">
                  {findMetric(id)?.name}
                  <span
                    className="close"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMetric(metricSel.filter((x) => x !== id))
                    }}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
