import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Input,
  Modal,
  Tag,
  Tooltip,
  message,
  Popconfirm,
} from 'antd'
import {
  PlusOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  DragOutlined,
  ArrowLeftOutlined as ArrowL,
  ArrowRightOutlined as ArrowR,
  DatabaseOutlined,
  AppstoreOutlined,
  FormOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  ExpandOutlined,
  CompressOutlined,
} from '@ant-design/icons'
import {
  Board,
  ChartCard,
  Dashboard,
  DataSource,
  findDimension,
  findMetric,
  findReport,
  findTemplate,
  useDashboards,
} from '../store/dashboard'
import DataSourceModal from '../components/DataSourceModal'
import ChartEditModal from '../components/ChartEditModal'
import ChartView from '../components/ChartView'

type Step = 'basic' | 'source' | 'board'

export default function DashboardBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, create, update } = useDashboards()
  const isEdit = !!id
  const existing = isEdit ? getById(id!) : undefined

  const [step, setStep] = useState<Step>('basic')

  // 基本信息
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  // 数据源
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [dsModalOpen, setDsModalOpen] = useState(false)
  const [editingDs, setEditingDs] = useState<DataSource | null>(null)

  // 看板
  const [boards, setBoards] = useState<Board[]>([])
  const [activeBoardId, setActiveBoardId] = useState<string>('')
  const [chartModalOpen, setChartModalOpen] = useState(false)
  const [editingChart, setEditingChart] = useState<ChartCard | null>(null)

  useEffect(() => {
    if (existing) {
      setName(existing.name)
      setDesc(existing.desc || '')
      setDataSources(existing.dataSources)
      setBoards(existing.boards)
      setActiveBoardId(existing.boards[0]?.id || '')
    } else {
      const initBoard: Board = {
        id: 'b-' + Math.random().toString(36).slice(2, 8),
        name: '看板1',
        charts: [],
      }
      setBoards([initBoard])
      setActiveBoardId(initBoard.id)
    }
  }, [existing?.id])

  const activeBoard = boards.find((b) => b.id === activeBoardId)

  // ============= Step Helpers =============
  const goNext = () => {
    if (step === 'basic') {
      if (!name.trim()) {
        message.warning('请填写仪表盘名称')
        return
      }
      setStep('source')
    } else if (step === 'source') {
      if (dataSources.length === 0) {
        message.warning('请至少创建一个数据源')
        return
      }
      setStep('board')
    }
  }

  const goPrev = () => {
    if (step === 'board') setStep('source')
    else if (step === 'source') setStep('basic')
  }

  // ============= 数据源 =============
  const onSaveDs = (ds: DataSource) => {
    if (editingDs) {
      setDataSources((list) => list.map((d) => (d.id === ds.id ? ds : d)))
      message.success('数据源已更新')
    } else {
      setDataSources((list) => [...list, ds])
      message.success('数据源创建成功')
    }
    setDsModalOpen(false)
    setEditingDs(null)
  }

  const onDeleteDs = (dsId: string) => {
    // 检查是否有图表引用
    const used = boards.some((b) => b.charts.some((c) => c.dataSourceId === dsId))
    if (used) {
      message.error('该数据源已被图表引用，请先删除相关图表')
      return
    }
    setDataSources((list) => list.filter((d) => d.id !== dsId))
    message.success('已删除')
  }

  // ============= 看板 =============
  const addBoard = () => {
    const board: Board = {
      id: 'b-' + Math.random().toString(36).slice(2, 8),
      name: `看板${boards.length + 1}`,
      charts: [],
    }
    setBoards((list) => [...list, board])
    setActiveBoardId(board.id)
  }

  const renameBoard = (boardId: string) => {
    const target = boards.find((b) => b.id === boardId)
    if (!target) return
    let nextName = target.name
    Modal.confirm({
      title: '重命名看板',
      content: (
        <Input
          defaultValue={target.name}
          autoFocus
          onChange={(e) => (nextName = e.target.value)}
          placeholder="请输入看板名称"
        />
      ),
      onOk: () => {
        if (!nextName.trim()) {
          message.warning('看板名称不能为空')
          return
        }
        setBoards((list) =>
          list.map((b) => (b.id === boardId ? { ...b, name: nextName.trim() } : b)),
        )
      },
    })
  }

  const deleteBoard = (boardId: string) => {
    if (boards.length === 1) {
      message.warning('至少保留一个看板')
      return
    }
    setBoards((list) => list.filter((b) => b.id !== boardId))
    if (activeBoardId === boardId) {
      setActiveBoardId(boards.find((b) => b.id !== boardId)!.id)
    }
  }

  const moveBoard = (boardId: string, dir: -1 | 1) => {
    setBoards((list) => {
      const idx = list.findIndex((b) => b.id === boardId)
      if (idx < 0) return list
      const t = idx + dir
      if (t < 0 || t >= list.length) return list
      const arr = [...list]
      ;[arr[idx], arr[t]] = [arr[t], arr[idx]]
      return arr
    })
  }

  // ============= 图表 =============
  const onSaveChart = (chart: ChartCard) => {
    setBoards((list) =>
      list.map((b) => {
        if (b.id !== activeBoardId) return b
        const exist = b.charts.find((c) => c.id === chart.id)
        if (exist) {
          return { ...b, charts: b.charts.map((c) => (c.id === chart.id ? chart : c)) }
        }
        return { ...b, charts: [...b.charts, chart] }
      }),
    )
    setChartModalOpen(false)
    setEditingChart(null)
    message.success(editingChart ? '图表已更新' : '图表已新增')
  }

  const onDeleteChart = (chartId: string) => {
    setBoards((list) =>
      list.map((b) =>
        b.id === activeBoardId
          ? { ...b, charts: b.charts.filter((c) => c.id !== chartId) }
          : b,
      ),
    )
    message.success('已删除图表')
  }

  const moveChart = (chartId: string, dir: -1 | 1) => {
    setBoards((list) =>
      list.map((b) => {
        if (b.id !== activeBoardId) return b
        const idx = b.charts.findIndex((c) => c.id === chartId)
        if (idx < 0) return b
        const t = idx + dir
        if (t < 0 || t >= b.charts.length) return b
        const arr = [...b.charts]
        ;[arr[idx], arr[t]] = [arr[t], arr[idx]]
        return { ...b, charts: arr }
      }),
    )
  }

  const resizeChart = (chartId: string, dir: 'wider' | 'narrower' | 'taller' | 'shorter') => {
    setBoards((list) =>
      list.map((b) => {
        if (b.id !== activeBoardId) return b
        return {
          ...b,
          charts: b.charts.map((c) => {
            if (c.id !== chartId) return c
            let { w, h } = c
            if (dir === 'wider') w = Math.min(4, w + 1) as 1 | 2 | 3 | 4
            if (dir === 'narrower') w = Math.max(1, w - 1) as 1 | 2 | 3 | 4
            if (dir === 'taller') h = Math.min(3, h + 1) as 1 | 2 | 3
            if (dir === 'shorter') h = Math.max(1, h - 1) as 1 | 2 | 3
            return { ...c, w, h }
          }),
        }
      }),
    )
  }

  // ============= 保存 =============
  const onSaveAll = () => {
    if (!name.trim()) {
      message.warning('请填写仪表盘名称')
      setStep('basic')
      return
    }
    if (dataSources.length === 0) {
      message.warning('请至少创建一个数据源')
      setStep('source')
      return
    }
    const cleanBoards = boards
    const payload: Partial<Dashboard> & { name: string } = {
      name: name.trim(),
      desc,
      dataSources,
      boards: cleanBoards,
    }
    if (existing) {
      update(existing.id, payload)
      message.success('仪表盘已保存')
      navigate(`/analysis/dashboards/${existing.id}`)
    } else {
      const next = create(payload)
      message.success('仪表盘创建成功')
      navigate(`/analysis/dashboards/${next.id}`)
    }
  }

  // ============= Render =============
  return (
    <div>
      <div className="page-header">
        <div className="row gap-12" style={{ alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/analysis')}
            type="text"
          />
          <div>
            <div className="page-title">
              {isEdit ? '编辑仪表盘' : '新建仪表盘'}
              {name && <span style={{ fontSize: 14, color: '#86909c', marginLeft: 6, fontWeight: 400 }}>· {name}</span>}
            </div>
            <div className="page-subtitle">
              三步完成：基本信息 → 创建数据源 → 创建看板
            </div>
          </div>
        </div>
        <div className="page-actions">
          <Button onClick={() => navigate('/analysis')}>取消</Button>
          {step !== 'basic' && (
            <Button onClick={goPrev} icon={<ArrowL />}>
              上一步
            </Button>
          )}
          {step !== 'board' && (
            <Button type="primary" onClick={goNext}>
              下一步 <ArrowR />
            </Button>
          )}
          {step === 'board' && (
            <Button type="primary" icon={<SaveOutlined />} onClick={onSaveAll}>
              保存仪表盘
            </Button>
          )}
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="section-card">
        <div className="section-body" style={{ padding: '14px 20px' }}>
          <div className="row gap-24" style={{ alignItems: 'center' }}>
            <StepBadge active={step === 'basic'} done={step !== 'basic'} no={1} icon={<FormOutlined />} label="基本信息" />
            <span style={{ flex: 1, height: 1, background: step === 'basic' ? '#eef0f3' : '#4f7cff' }} />
            <StepBadge active={step === 'source'} done={step === 'board'} no={2} icon={<DatabaseOutlined />} label="创建数据源" />
            <span style={{ flex: 1, height: 1, background: step === 'board' ? '#4f7cff' : '#eef0f3' }} />
            <StepBadge active={step === 'board'} done={false} no={3} icon={<AppstoreOutlined />} label="创建看板" />
          </div>
        </div>
      </div>

      {/* === Step 1 基本信息 === */}
      {step === 'basic' && (
        <div className="section-card">
          <div className="section-head">
            <h3>
              <FormOutlined style={{ color: '#4f7cff' }} /> 基本信息
            </h3>
          </div>
          <div className="section-body" style={{ maxWidth: 640 }}>
            <div className="row gap-12 mb-16" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: 13, width: 96, textAlign: 'right' }}>
                仪表盘名称 <span style={{ color: '#f53f3f' }}>*</span>
              </span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：618 大促作战室"
                size="large"
                style={{ flex: 1 }}
                showCount
                maxLength={40}
              />
            </div>
            <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 13, width: 96, textAlign: 'right', paddingTop: 6 }}>
                描述
              </span>
              <Input.TextArea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="一句话描述这个仪表盘的用途，便于团队成员快速理解"
                rows={3}
                style={{ flex: 1 }}
                showCount
                maxLength={120}
              />
            </div>
          </div>
        </div>
      )}

      {/* === Step 2 数据源 === */}
      {step === 'source' && (
        <div className="section-card">
          <div className="section-head">
            <h3>
              <DatabaseOutlined style={{ color: '#4f7cff' }} /> 创建数据源
              <span style={{ fontSize: 12, color: '#86909c', fontWeight: 400, marginLeft: 8 }}>
                可创建多个数据源，看板会从其中选择
              </span>
            </h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingDs(null)
                setDsModalOpen(true)
              }}
            >
              新建数据源
            </Button>
          </div>
          <div className="section-body">
            {dataSources.length === 0 ? (
              <div className="empty-state">
                <div className="es-icon">
                  <DatabaseOutlined />
                </div>
                <div className="es-title">还没有数据源</div>
                <div className="es-desc">
                  以下三种方式任选其一：① 模板创建　② 已有报表　③ 直接选择指标维度
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingDs(null)
                    setDsModalOpen(true)
                  }}
                >
                  立即创建
                </Button>
              </div>
            ) : (
              <DataSourceTable
                items={dataSources}
                onEdit={(ds) => {
                  setEditingDs(ds)
                  setDsModalOpen(true)
                }}
                onDelete={onDeleteDs}
              />
            )}
          </div>
        </div>
      )}

      {/* === Step 3 看板 === */}
      {step === 'board' && (
        <div>
          <div className="section-card">
            <div className="section-head">
              <h3>
                <AppstoreOutlined style={{ color: '#4f7cff' }} /> 看板编辑
                <span style={{ fontSize: 12, color: '#86909c', fontWeight: 400, marginLeft: 8 }}>
                  支持创建多个看板，每个看板可包含多个图表
                </span>
              </h3>
              <div className="row gap-8">
                <Button icon={<PlusOutlined />} onClick={addBoard}>
                  新增看板
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    if (dataSources.length === 0) {
                      message.warning('请先创建数据源')
                      return
                    }
                    setEditingChart(null)
                    setChartModalOpen(true)
                  }}
                >
                  新增图表
                </Button>
              </div>
            </div>
            <div className="section-body" style={{ paddingTop: 8 }}>
              {/* 看板 Tabs（支持顺序调整） */}
              <div
                className="row gap-4 mb-16"
                style={{
                  flexWrap: 'wrap',
                  borderBottom: '1px solid #eef0f3',
                  paddingBottom: 8,
                }}
              >
                {boards.map((b, i) => (
                  <div
                    key={b.id}
                    className={`builder-tab ${activeBoardId === b.id ? 'active' : ''}`}
                    style={{
                      padding: '8px 12px',
                      fontSize: 13,
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onClick={() => setActiveBoardId(b.id)}
                  >
                    <span>{b.name}</span>
                    <span
                      style={{
                        fontSize: 11,
                        color: '#bfbfbf',
                        background: activeBoardId === b.id ? '#e6efff' : '#f5f7fa',
                        padding: '0 6px',
                        borderRadius: 8,
                      }}
                    >
                      {b.charts.length}
                    </span>
                    {activeBoardId === b.id && (
                      <span className="row gap-4" style={{ marginLeft: 4 }}>
                        <Tooltip title="左移">
                          <ArrowL
                            onClick={(e) => {
                              e.stopPropagation()
                              moveBoard(b.id, -1)
                            }}
                            style={{ fontSize: 11, color: i === 0 ? '#d4dcec' : '#86909c', cursor: 'pointer' }}
                          />
                        </Tooltip>
                        <Tooltip title="右移">
                          <ArrowR
                            onClick={(e) => {
                              e.stopPropagation()
                              moveBoard(b.id, 1)
                            }}
                            style={{
                              fontSize: 11,
                              color: i === boards.length - 1 ? '#d4dcec' : '#86909c',
                              cursor: 'pointer',
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="重命名">
                          <EditOutlined
                            onClick={(e) => {
                              e.stopPropagation()
                              renameBoard(b.id)
                            }}
                            style={{ fontSize: 11, color: '#86909c', cursor: 'pointer' }}
                          />
                        </Tooltip>
                        <Tooltip title="删除看板">
                          <DeleteOutlined
                            onClick={(e) => {
                              e.stopPropagation()
                              if (boards.length === 1) {
                                message.warning('至少保留一个看板')
                                return
                              }
                              Modal.confirm({
                                title: `确定删除「${b.name}」？`,
                                onOk: () => deleteBoard(b.id),
                              })
                            }}
                            style={{ fontSize: 11, color: '#f53f3f', cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 当前看板的图表网格 */}
              {activeBoard && (
                <BoardGrid
                  board={activeBoard}
                  onAddChart={() => {
                    setEditingChart(null)
                    setChartModalOpen(true)
                  }}
                  onEditChart={(c) => {
                    setEditingChart(c)
                    setChartModalOpen(true)
                  }}
                  onDeleteChart={onDeleteChart}
                  onMoveChart={moveChart}
                  onResizeChart={resizeChart}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 数据源弹窗 */}
      <DataSourceModal
        open={dsModalOpen}
        initial={editingDs}
        onClose={() => {
          setDsModalOpen(false)
          setEditingDs(null)
        }}
        onConfirm={onSaveDs}
      />

      {/* 图表弹窗 */}
      <ChartEditModal
        open={chartModalOpen}
        initial={editingChart}
        dataSources={dataSources}
        onClose={() => {
          setChartModalOpen(false)
          setEditingChart(null)
        }}
        onConfirm={onSaveChart}
      />
    </div>
  )
}

// =============== Step Badge ===============
function StepBadge({
  active,
  done,
  no,
  icon,
  label,
}: {
  active: boolean
  done: boolean
  no: number
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="row gap-8" style={{ alignItems: 'center' }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: done ? '#4f7cff' : active ? 'linear-gradient(135deg, #4f7cff, #6e5cff)' : '#f0f2f6',
          color: done || active ? '#fff' : '#86909c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 600,
          boxShadow: active ? '0 4px 12px rgba(79,124,255,0.3)' : 'none',
        }}
      >
        {done ? <CheckCircleOutlined /> : icon || no}
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#86909c' }}>第 {no} 步</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: active || done ? '#1f2329' : '#86909c' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

// =============== 数据源表格 ===============
function DataSourceTable({
  items,
  onEdit,
  onDelete,
}: {
  items: DataSource[]
  onEdit: (ds: DataSource) => void
  onDelete: (id: string) => void
}) {
  const TYPE_LABEL: Record<DataSource['type'], { label: string; abbr: string; color: string }> = {
    template: { label: '模板创建', abbr: '模', color: '#4f7cff' },
    report: { label: '已有报表', abbr: '报', color: '#a259ff' },
    direct: { label: '直接创建', abbr: '建', color: '#00b42a' },
  }
  return (
    <div className="row" style={{ flexDirection: 'column', gap: 10 }}>
      {items.map((ds) => {
        const t = TYPE_LABEL[ds.type]
        const tpl = ds.templateId ? findTemplate(ds.templateId) : null
        const rpt = ds.reportId ? findReport(ds.reportId) : null
        return (
          <div
            key={ds.id}
            style={{
              border: '1px solid #eef0f3',
              borderRadius: 10,
              padding: 14,
              background: '#fff',
              display: 'grid',
              gridTemplateColumns: '32px 1fr auto',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: t.color + '14',
                color: t.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t.abbr}
            </div>
            <div>
              <div className="row gap-8" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="text-strong" style={{ fontSize: 14 }}>
                  {ds.name}
                </span>
                <Tag color={ds.type === 'template' ? 'blue' : ds.type === 'report' ? 'purple' : 'green'}>
                  {t.label}
                </Tag>
                {tpl && (
                  <span className="muted-12">
                    源自模板：{tpl.name}（{tpl.category}）
                  </span>
                )}
                {rpt && <span className="muted-12">源自报表：{rpt.name}</span>}
              </div>
              <div className="row gap-8 mt-8" style={{ flexWrap: 'wrap' }}>
                <span className="muted-12">维度：</span>
                {ds.dimensions.length === 0 ? (
                  <span className="muted-12">—</span>
                ) : (
                  ds.dimensions.map((id) => (
                    <span key={id} className="field-chip dimension">
                      {findDimension(id)?.name}
                    </span>
                  ))
                )}
              </div>
              <div className="row gap-8 mt-8" style={{ flexWrap: 'wrap' }}>
                <span className="muted-12">指标：</span>
                {ds.metrics.map((id) => (
                  <span key={id} className="field-chip metric">
                    {findMetric(id)?.name}
                  </span>
                ))}
              </div>
              <div className="muted-12 mt-8">
                预估行数：{ds.rowCount.toLocaleString()} · 创建时间：{ds.createdAt}
              </div>
            </div>
            <div className="row gap-4">
              <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(ds)}>
                编辑
              </Button>
              <Popconfirm
                title="确定删除该数据源吗？"
                onConfirm={() => onDelete(ds.id)}
                okText="删除"
                okType="danger"
              >
                <Button size="small" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// =============== 看板网格 ===============
function BoardGrid({
  board,
  onAddChart,
  onEditChart,
  onDeleteChart,
  onMoveChart,
  onResizeChart,
}: {
  board: Board
  onAddChart: () => void
  onEditChart: (c: ChartCard) => void
  onDeleteChart: (id: string) => void
  onMoveChart: (id: string, dir: -1 | 1) => void
  onResizeChart: (id: string, dir: 'wider' | 'narrower' | 'taller' | 'shorter') => void
}) {
  if (board.charts.length === 0) {
    return (
      <div className="empty-state">
        <div className="es-icon">
          <LineChartOutlined />
        </div>
        <div className="es-title">还没有图表</div>
        <div className="es-desc">从数据源中选择指标和维度，新增第一个图表</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddChart}>
          新增图表
        </Button>
      </div>
    )
  }
  return (
    <div className="boards-grid">
      {board.charts.map((c, idx) => (
        <div
          key={c.id}
          className={`chart-tile editable tile-w-${c.w}`}
          style={{ gridRow: `span ${c.h}`, minHeight: c.h * 110 + 36 }}
        >
          <div className="tile-head">
            <div className="tile-name">
              <DragOutlined style={{ color: '#bfbfbf', fontSize: 11 }} />
              {c.name}
              <Tag style={{ marginLeft: 6, fontSize: 11 }}>{chartLabel(c.type)}</Tag>
            </div>
            <div className="tile-actions">
              <Tooltip title="向左移">
                <button
                  className="btn"
                  disabled={idx === 0}
                  onClick={() => onMoveChart(c.id, -1)}
                >
                  <ArrowL />
                </button>
              </Tooltip>
              <Tooltip title="向右移">
                <button
                  className="btn"
                  disabled={idx === board.charts.length - 1}
                  onClick={() => onMoveChart(c.id, 1)}
                >
                  <ArrowR />
                </button>
              </Tooltip>
              <Tooltip title="变窄">
                <button className="btn" disabled={c.w <= 1} onClick={() => onResizeChart(c.id, 'narrower')}>
                  <CompressOutlined />
                </button>
              </Tooltip>
              <Tooltip title="变宽">
                <button className="btn" disabled={c.w >= 4} onClick={() => onResizeChart(c.id, 'wider')}>
                  <ExpandOutlined />
                </button>
              </Tooltip>
              <Tooltip title="变矮">
                <button className="btn" disabled={c.h <= 1} onClick={() => onResizeChart(c.id, 'shorter')}>
                  ↑
                </button>
              </Tooltip>
              <Tooltip title="变高">
                <button className="btn" disabled={c.h >= 3} onClick={() => onResizeChart(c.id, 'taller')}>
                  ↓
                </button>
              </Tooltip>
              <Tooltip title="编辑">
                <button className="btn" onClick={() => onEditChart(c)}>
                  <EditOutlined />
                </button>
              </Tooltip>
              <Popconfirm
                title={`删除图表「${c.name}」？`}
                onConfirm={() => onDeleteChart(c.id)}
                okText="删除"
                okType="danger"
              >
                <Tooltip title="删除">
                  <button className="btn" style={{ color: '#f53f3f' }}>
                    <DeleteOutlined />
                  </button>
                </Tooltip>
              </Popconfirm>
            </div>
          </div>
          <div className="tile-body">
            <ChartView chart={c} height={c.h * 110 - 18} />
          </div>
        </div>
      ))}
      {/* 添加占位卡片 */}
      <div
        className="chart-tile editable tile-w-1"
        style={{
          minHeight: 130,
          border: '1.5px dashed #d4dcec',
          background: '#fafbfc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#86909c',
          flexDirection: 'column',
          gap: 4,
        }}
        onClick={onAddChart}
      >
        <PlusOutlined style={{ fontSize: 18 }} />
        <span style={{ fontSize: 12 }}>新增图表</span>
      </div>
    </div>
  )
}

function chartLabel(t: string) {
  const map: Record<string, string> = {
    line: '曲线',
    bar: '柱状',
    pie: '饼图',
    area: '面积',
    kpi: 'KPI',
    table: '表格',
    funnel: '漏斗',
    scatter: '散点',
    gauge: '仪表',
  }
  return map[t] || t
}

// 防止外部使用未引入的图标
export const _Unused = { CopyOutlined }
