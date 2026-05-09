import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button, Dropdown, Tag, Tooltip, Empty, message } from 'antd'
import {
  EditOutlined,
  CopyOutlined,
  ShareAltOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  CloudUploadOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  CheckCircleFilled,
  TableOutlined,
  DownloadOutlined,
  FileImageOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { exportElementAsPng, exportElementAsPdf, exportBoardAsExcel } from '../utils/export'
import DashboardFilters, {
  DEFAULT_FILTER,
  FilterValue,
  MOCK_SHOPS,
} from '../components/DashboardFilters'
import { useDashboards, findTemplate, findReport } from '../store/dashboard'
import ChartView from '../components/ChartView'
import PermissionDrawer from '../components/PermissionDrawer'
import ShareModal from '../components/ShareModal'
import CollaborateModal from '../components/CollaborateModal'
import DataSourceDetailModal from '../components/DataSourceDetailModal'

export default function DashboardView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, duplicate, syncToShop } = useDashboards()
  const dash = id ? getById(id) : undefined
  const [boardId, setBoardId] = useState<string>('')

  const [permOpen, setPermOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [collabOpen, setCollabOpen] = useState(false)
  const [dsModalOpen, setDsModalOpen] = useState(false)
  const [dsModalId, setDsModalId] = useState<string | null>(null)
  const [exporting, setExporting] = useState<'png' | 'pdf' | 'excel' | null>(null)
  const boardGridRef = useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState<FilterValue>(DEFAULT_FILTER)

  useEffect(() => {
    if (dash && !boardId) setBoardId(dash.boards[0]?.id || '')
  }, [dash?.id, dash?.boards, boardId])

  if (!dash) {
    return <Navigate to="/analysis" replace />
  }

  const activeBoard = dash.boards.find((b) => b.id === boardId)

  // ============ 导出 ============
  const filenameBase = () => {
    const ts = new Date().toISOString().slice(0, 10)
    const safe = (dash.name + '-' + (activeBoard?.name || '看板')).replace(/[\\/?*<>|:"]/g, '_')
    return `${safe}_${ts}`
  }

  const handleExport = async (kind: 'png' | 'pdf' | 'excel') => {
    if (!activeBoard) return
    if (kind === 'excel') {
      try {
        setExporting('excel')
        exportBoardAsExcel(activeBoard, dash.dataSources, filenameBase())
        message.success('Excel 已导出')
      } catch (e) {
        message.error('Excel 导出失败：' + (e as Error).message)
      } finally {
        setExporting(null)
      }
      return
    }
    const target = boardGridRef.current
    if (!target) {
      message.error('未找到看板内容')
      return
    }
    try {
      setExporting(kind)
      message.loading({ content: '正在生成...', key: 'export', duration: 0 })
      // 等下一帧，避免 loading 状态影响截图
      await new Promise((r) => setTimeout(r, 80))
      if (kind === 'png') {
        await exportElementAsPng(target, filenameBase())
      } else {
        await exportElementAsPdf(
          target,
          filenameBase(),
          `${dash.name} · ${activeBoard.name}`,
        )
      }
      message.success({ content: kind.toUpperCase() + ' 已导出', key: 'export' })
    } catch (e) {
      message.error({ content: '导出失败：' + (e as Error).message, key: 'export' })
    } finally {
      setExporting(null)
    }
  }

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
              {dash.name}
              {dash.kind === 'system' && <Tag color="orange">系统模板</Tag>}
              {dash.kind === 'shop' && <Tag color="blue">店铺模板</Tag>}
              {dash.syncedToShop && (
                <Tag color="green" icon={<CheckCircleFilled />}>
                  已同步店铺模板
                </Tag>
              )}
            </div>
            <div className="page-subtitle">
              {dash.desc || '——'} · {dash.owner} · 更新于 {dash.updatedAt}
            </div>
          </div>
        </div>
        <div className="page-actions">
          {dash.collaborators.length > 0 && (
            <div className="avatar-stack" style={{ marginRight: 8 }}>
              {dash.collaborators.map((c) => (
                <span
                  key={c.name}
                  className="avatar"
                  style={{ background: c.color }}
                  title={c.name}
                >
                  {c.name[0]}
                </span>
              ))}
            </div>
          )}
          <Tooltip title="刷新数据">
            <Button icon={<ReloadOutlined />} />
          </Tooltip>
          <Button
            icon={<TeamOutlined />}
            onClick={() => setCollabOpen(true)}
          >
            协同
          </Button>
          <Button icon={<ShareAltOutlined />} onClick={() => setShareOpen(true)}>
            分享
          </Button>
          <Dropdown
            disabled={!activeBoard || activeBoard.charts.length === 0}
            menu={{
              onClick: ({ key }) => handleExport(key as 'png' | 'pdf' | 'excel'),
              items: [
                {
                  key: 'png',
                  label: '导出 PNG',
                  icon: <FileImageOutlined />,
                  disabled: exporting !== null,
                },
                {
                  key: 'excel',
                  label: '导出 Excel',
                  icon: <FileExcelOutlined />,
                  disabled: exporting !== null,
                },
                {
                  key: 'pdf',
                  label: '导出 PDF',
                  icon: <FilePdfOutlined />,
                  disabled: exporting !== null,
                },
              ],
            }}
          >
            <Button icon={<DownloadOutlined />} loading={exporting !== null}>
              导出 <DownOutlined style={{ fontSize: 10 }} />
            </Button>
          </Dropdown>
          {dash.kind === 'mine' && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/analysis/dashboards/${dash.id}/edit`)}
            >
              编辑
            </Button>
          )}
          <Dropdown
            menu={{
              onClick: ({ key }) => {
                if (key === 'duplicate') {
                  const c = duplicate(dash.id)
                  if (c) navigate(`/analysis/dashboards/${c.id}`)
                }
                if (key === 'permission') setPermOpen(true)
                if (key === 'sync-shop') {
                  syncToShop(dash.id)
                }
              },
              items: [
                { key: 'duplicate', label: '复制仪表盘', icon: <CopyOutlined /> },
                { key: 'permission', label: '权限设置', icon: <SafetyCertificateOutlined /> },
                {
                  key: 'sync-shop',
                  label: dash.syncedToShop ? '已同步到店铺模板' : '同步到店铺模板',
                  icon: <CloudUploadOutlined />,
                  disabled: dash.syncedToShop,
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* 数据源摘要 */}
      <div className="section-card">
        <div
          className="section-body"
          style={{
            padding: '14px 20px',
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div className="row gap-8" style={{ alignItems: 'center' }}>
            <span className="muted-13">数据源：</span>
            <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
              {dash.dataSources.map((ds) => (
                <Tag
                  key={ds.id}
                  color={ds.type === 'template' ? 'blue' : ds.type === 'report' ? 'purple' : 'green'}
                  style={{
                    borderRadius: 12,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => {
                    setDsModalId(ds.id)
                    setDsModalOpen(true)
                  }}
                  title="点击查看数据源明细"
                >
                  {ds.type === 'template' ? '模板 · ' : ds.type === 'report' ? '报表 · ' : '直建 · '}
                  {ds.name}
                  {ds.templateId && (
                    <span style={{ color: '#bfbfbf', marginLeft: 4 }}>
                      · {findTemplate(ds.templateId)?.name}
                    </span>
                  )}
                  {ds.reportId && (
                    <span style={{ color: '#bfbfbf', marginLeft: 4 }}>
                      · {findReport(ds.reportId)?.name}
                    </span>
                  )}
                </Tag>
              ))}
            </div>
          </div>
          <div
            className="row gap-12"
            style={{ alignItems: 'center', marginLeft: 'auto' }}
          >
            <span className="muted-13">
              {dash.boards.length} 个看板 · {dash.boards.reduce((s, b) => s + b.charts.length, 0)} 个图表
            </span>
            <Button
              size="small"
              icon={<TableOutlined />}
              onClick={() => {
                setDsModalId(dash.dataSources[0]?.id || null)
                setDsModalOpen(true)
              }}
              disabled={dash.dataSources.length === 0}
            >
              查看明细数据
            </Button>
          </div>
        </div>
      </div>

      {/* 全局筛选器：统计时间 + 选择店铺 + 选择渠道 */}
      <DashboardFilters value={filter} onChange={setFilter} />

      {/* 当前筛选信息提示 */}
      <FilterBadge filter={filter} />

      {/* 看板 Tabs */}
      <div className="builder-tabs">
        {dash.boards.map((b) => (
          <div
            key={b.id}
            className={`builder-tab ${boardId === b.id ? 'active' : ''}`}
            onClick={() => setBoardId(b.id)}
          >
            {b.name}
            <span style={{ color: '#bfbfbf', marginLeft: 4, fontSize: 12 }}>
              {b.charts.length}
            </span>
          </div>
        ))}
      </div>

      {/* 图表网格 */}
      {!activeBoard ? (
        <Empty description="请选择一个看板" />
      ) : activeBoard.charts.length === 0 ? (
        <Empty description="该看板暂无图表" style={{ marginTop: 80 }} />
      ) : (
        <div className="boards-grid" ref={boardGridRef}>
          {activeBoard.charts.map((c) => (
            <div
              key={c.id}
              className={`chart-tile tile-w-${c.w}`}
              style={{ gridRow: `span ${c.h}`, minHeight: c.h * 110 + 36 }}
            >
              <div className="tile-head">
                <div className="tile-name">{c.name}</div>
                <div className="tile-actions">
                  <Tooltip title="刷新">
                    <button className="btn">
                      <ReloadOutlined />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="tile-body">
                <ChartView chart={c} height={c.h * 110 - 18} />
              </div>
            </div>
          ))}
        </div>
      )}

      <PermissionDrawer
        dashboard={dash}
        open={permOpen}
        onClose={() => setPermOpen(false)}
      />
      <ShareModal dashboard={dash} open={shareOpen} onClose={() => setShareOpen(false)} />
      <CollaborateModal
        dashboard={dash}
        open={collabOpen}
        onClose={() => setCollabOpen(false)}
      />
      <DataSourceDetailModal
        dataSources={dash.dataSources}
        initialId={dsModalId}
        open={dsModalOpen}
        onClose={() => setDsModalOpen(false)}
      />
    </div>
  )
}

// =================== 筛选条件提示徽标 ===================
function FilterBadge({ filter }: { filter: FilterValue }) {
  const isAll = filter.shopIds.includes('__ALL__')
  const shopText = isAll
    ? '全部店铺'
    : filter.shopIds
        .map((id) => MOCK_SHOPS.find((s) => s.id === id)?.name || '')
        .filter(Boolean)
        .slice(0, 2)
        .join('、') +
      (filter.shopIds.length > 2 ? ` 等 ${filter.shopIds.length} 个店铺` : '')

  const timeText = (() => {
    if (filter.timeKind === 'realtime') return '实时数据'
    if (filter.timeKind === 'week') return `${filter.date.format('YYYY 年 第 W 周')}`
    if (filter.timeKind === 'month') return `${filter.date.format('YYYY 年 M 月')}`
    if (filter.timeKind === 'custom')
      return `${filter.date.subtract(6, 'day').format('MM-DD')} ~ ${filter.date.format('MM-DD')}`
    return filter.date.format('YYYY-MM-DD')
  })()

  const channelText = (
    {
      web: '网店渠道',
      retail: '门店渠道',
      live: '直播渠道',
      all: '全渠道',
    } as Record<string, string>
  )[filter.channel]

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(79,124,255,0.06), rgba(110,92,255,0.02))',
        border: '1px dashed #c7d6ff',
        borderRadius: 8,
        padding: '8px 14px',
        marginBottom: 12,
        fontSize: 12.5,
        color: '#4e5969',
        display: 'flex',
        gap: 18,
        flexWrap: 'wrap',
      }}
    >
      <span>
        <span style={{ color: '#86909c' }}>当前筛选：</span>
        <span className="text-strong">{timeText}</span>
      </span>
      <span>· {shopText}</span>
      <span>· {channelText}</span>
      <span style={{ marginLeft: 'auto', color: '#bfbfbf' }}>
        所有图表均按以上条件统计
      </span>
    </div>
  )
}

