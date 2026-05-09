import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Dropdown, Input, Modal, Tag, message } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  StarFilled,
  MoreOutlined,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  CloudUploadOutlined,
  CheckCircleFilled,
  ShopOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import { Dashboard, useDashboards, findMetric } from '../store/dashboard'
import ChartView from '../components/ChartView'
import PermissionDrawer from '../components/PermissionDrawer'
import ShareModal from '../components/ShareModal'
import CollaborateModal from '../components/CollaborateModal'

type TabKey = 'mine' | 'template'
type TemplateSubKind = 'all' | 'shop' | 'system'

export default function Analysis() {
  const navigate = useNavigate()
  const { dashboards, duplicate, remove, useTemplate, syncToShop } = useDashboards()
  const [tab, setTab] = useState<TabKey>('mine')
  const [tplSub, setTplSub] = useState<TemplateSubKind>('all')
  const [keyword, setKeyword] = useState('')

  // 协作 / 分享 / 权限抽屉
  const [permDash, setPermDash] = useState<Dashboard | null>(null)
  const [shareDash, setShareDash] = useState<Dashboard | null>(null)
  const [collabDash, setCollabDash] = useState<Dashboard | null>(null)

  const mineList = useMemo(
    () =>
      dashboards
        .filter((d) => d.kind === 'mine')
        .filter((d) => !keyword || d.name.includes(keyword) || (d.desc || '').includes(keyword)),
    [dashboards, keyword],
  )

  const templateList = useMemo(() => {
    let list = dashboards.filter((d) => d.kind !== 'mine')
    if (tplSub === 'shop') list = list.filter((d) => d.kind === 'shop')
    if (tplSub === 'system') list = list.filter((d) => d.kind === 'system')
    if (keyword) list = list.filter((d) => d.name.includes(keyword) || (d.desc || '').includes(keyword))
    return list
  }, [dashboards, tplSub, keyword])

  const onUseTemplate = (id: string) => {
    const next = useTemplate(id)
    if (next) {
      message.success(`已基于模板创建：${next.name}`)
      navigate(`/analysis/dashboards/${next.id}/edit`)
    }
  }

  const onDelete = (d: Dashboard) => {
    Modal.confirm({
      title: `确认删除「${d.name}」吗？`,
      content: '该操作不可撤销，仪表盘下的全部看板与配置将一并删除。',
      okType: 'danger',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        remove(d.id)
        message.success('已删除')
      },
    })
  }

  const onDuplicate = (d: Dashboard) => {
    const c = duplicate(d.id)
    if (c) message.success(`已复制为「${c.name}」`)
  }

  const onSyncToShop = (d: Dashboard) => {
    Modal.confirm({
      title: `同步「${d.name}」到店铺仪表盘模板？`,
      content: '同步后，该仪表盘将出现在店铺仪表盘模板中，店铺其他成员可以一键复用。',
      onOk: () => {
        syncToShop(d.id)
        message.success('已同步到店铺模板')
      },
    })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">
            <AppstoreOutlined style={{ color: '#4f7cff' }} /> 自助仪表盘
          </div>
          <div className="page-subtitle">
            自由组合数据源与图表，构建属于团队的多看板分析仪表盘
          </div>
        </div>
        <div className="page-actions">
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="搜索仪表盘名称 / 描述"
            style={{ width: 240 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/analysis/dashboards/new')}
          >
            新建仪表盘
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="builder-tabs" style={{ marginBottom: 12 }}>
        <div
          className={`builder-tab ${tab === 'mine' ? 'active' : ''}`}
          onClick={() => setTab('mine')}
        >
          我的仪表盘
          <span style={{ color: '#bfbfbf', marginLeft: 4, fontSize: 12 }}>
            {mineList.length}
          </span>
        </div>
        <div
          className={`builder-tab ${tab === 'template' ? 'active' : ''}`}
          onClick={() => setTab('template')}
        >
          仪表盘模板
          <span style={{ color: '#bfbfbf', marginLeft: 4, fontSize: 12 }}>
            {dashboards.filter((d) => d.kind !== 'mine').length}
          </span>
        </div>
      </div>

      {tab === 'template' && (
        <div className="row gap-8 mb-16">
          <Tag.CheckableTag
            checked={tplSub === 'all'}
            onChange={() => setTplSub('all')}
            style={{ padding: '4px 14px', fontSize: 13, borderRadius: 14 }}
          >
            全部
          </Tag.CheckableTag>
          <Tag.CheckableTag
            checked={tplSub === 'shop'}
            onChange={() => setTplSub('shop')}
            style={{ padding: '4px 14px', fontSize: 13, borderRadius: 14 }}
          >
            <ShopOutlined /> 店铺仪表盘
          </Tag.CheckableTag>
          <Tag.CheckableTag
            checked={tplSub === 'system'}
            onChange={() => setTplSub('system')}
            style={{ padding: '4px 14px', fontSize: 13, borderRadius: 14 }}
          >
            <StarFilled /> 系统模板
          </Tag.CheckableTag>
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}
      >
        {tab === 'mine' &&
          mineList.map((d) => (
            <DashboardCardItem
              key={d.id}
              dash={d}
              tab="mine"
              onOpen={() => navigate(`/analysis/dashboards/${d.id}`)}
              onEdit={() => navigate(`/analysis/dashboards/${d.id}/edit`)}
              onDuplicate={() => onDuplicate(d)}
              onDelete={() => onDelete(d)}
              onPermission={() => setPermDash(d)}
              onShare={() => setShareDash(d)}
              onCollab={() => setCollabDash(d)}
              onSyncToShop={() => onSyncToShop(d)}
            />
          ))}
        {tab === 'template' &&
          templateList.map((d) => (
            <DashboardCardItem
              key={d.id}
              dash={d}
              tab="template"
              onOpen={() => navigate(`/analysis/dashboards/${d.id}`)}
              onUseTemplate={() => onUseTemplate(d.id)}
            />
          ))}
      </div>

      {tab === 'mine' && mineList.length === 0 && (
        <div className="empty-state">
          <div className="es-icon">
            <LineChartOutlined />
          </div>
          <div className="es-title">还没有仪表盘</div>
          <div className="es-desc">从模板开始或直接新建一个属于您的分析仪表盘</div>
          <div className="row gap-8">
            <Button onClick={() => setTab('template')}>从模板创建</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/analysis/dashboards/new')}>
              新建仪表盘
            </Button>
          </div>
        </div>
      )}

      {/* Drawers / Modals */}
      <PermissionDrawer
        dashboard={permDash}
        open={!!permDash}
        onClose={() => setPermDash(null)}
      />
      <ShareModal dashboard={shareDash} open={!!shareDash} onClose={() => setShareDash(null)} />
      <CollaborateModal
        dashboard={collabDash}
        open={!!collabDash}
        onClose={() => setCollabDash(null)}
      />
    </div>
  )
}

// ================ 仪表盘卡片（顶部标题 + 多图表预览 2×2）================
function DashboardCardItem({
  dash,
  tab,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
  onPermission,
  onShare,
  onCollab,
  onSyncToShop,
  onUseTemplate,
}: {
  dash: Dashboard
  tab: TabKey
  onOpen: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onPermission?: () => void
  onShare?: () => void
  onCollab?: () => void
  onSyncToShop?: () => void
  onUseTemplate?: () => void
}) {
  const previewCharts = useMemo(
    () => dash.boards.flatMap((b) => b.charts).slice(0, 4),
    [dash],
  )

  const tileChartHeight = previewCharts.length <= 1 ? 108 : 92

  return (
    <div className="dashboard-card" onClick={onOpen}>
      <div className="dashboard-card-head">
        <div className="dashboard-card-title-row">
          <div className="dashboard-card-name" title={dash.name}>
            {dash.name}
          </div>
          <div className="dashboard-card-badges" onClick={(e) => e.stopPropagation()}>
            {dash.kind === 'system' && (
              <span className="dash-badge dash-badge-system">
                <StarFilled style={{ fontSize: 9, marginRight: 3 }} />
                系统模板
              </span>
            )}
            {dash.kind === 'shop' && (
              <span className="dash-badge dash-badge-shop">
                <ShopOutlined style={{ fontSize: 10, marginRight: 3 }} />
                店铺模板
              </span>
            )}
            {tab === 'mine' && dash.syncedToShop && (
              <span className="dash-badge dash-badge-sync">
                <CheckCircleFilled style={{ marginRight: 3 }} /> 已同步店铺
              </span>
            )}
          </div>
        </div>
        <div className="dashboard-card-desc">{dash.desc || '——'}</div>
      </div>

      <div
        className={`preview preview-multi preview-count-${Math.min(previewCharts.length, 4) || 0}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="preview-grid"
          style={{
            gridTemplateColumns: previewCharts.length === 1 ? '1fr' : '1fr 1fr',
          }}
        >
          {previewCharts.length > 0 ? (
            previewCharts.map((c) => (
              <div key={c.id} className="preview-tile">
                <div className="preview-tile-cap">
                  {c.name}
                  <span className="preview-tile-type"> · {chartTypeLabel(c.type)}</span>
                </div>
                <div className="preview-tile-body">
                  <ChartView chart={c} height={tileChartHeight} compact />
                </div>
              </div>
            ))
          ) : (
            <div className="preview-empty">
              暂未配置图表，进入编辑页添加图表卡片
            </div>
          )}
        </div>
      </div>

      <div className="info">
        <div className="meta">
          <span>
            {dash.boards.length} 个看板 · {dash.dataSources.length} 个数据源
          </span>
          {tab === 'mine' && (
            <Dropdown
              trigger={['click']}
              menu={{
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation()
                  if (key === 'edit') onEdit?.()
                  if (key === 'duplicate') onDuplicate?.()
                  if (key === 'delete') onDelete?.()
                  if (key === 'permission') onPermission?.()
                  if (key === 'share') onShare?.()
                  if (key === 'collab') onCollab?.()
                  if (key === 'sync-shop') onSyncToShop?.()
                },
                items: [
                  { key: 'edit', label: '编辑', icon: <EditOutlined /> },
                  { key: 'duplicate', label: '复制仪表盘', icon: <CopyOutlined /> },
                  { type: 'divider' as const },
                  { key: 'collab', label: '协同创建', icon: <TeamOutlined /> },
                  { key: 'share', label: '分享给他人', icon: <ShareAltOutlined /> },
                  {
                    key: 'sync-shop',
                    label: dash.syncedToShop ? '已同步到店铺模板' : '同步到店铺模板',
                    icon: <CloudUploadOutlined />,
                    disabled: dash.syncedToShop,
                  },
                  { key: 'permission', label: '权限设置', icon: <SafetyCertificateOutlined /> },
                  { type: 'divider' as const },
                  { key: 'delete', label: '删除', icon: <DeleteOutlined />, danger: true },
                ],
              }}
            >
              <span
                style={{ padding: 4, cursor: 'pointer', color: '#86909c' }}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreOutlined style={{ fontSize: 16 }} />
              </span>
            </Dropdown>
          )}
          {tab === 'template' && onUseTemplate && (
            <Button
              size="small"
              type="primary"
              ghost
              onClick={(e) => {
                e.stopPropagation()
                onUseTemplate()
              }}
            >
              使用模板
            </Button>
          )}
        </div>
        <div className="row gap-8 mt-8" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: '#bfbfbf' }}>
            {dash.owner} · 更新于 {dash.updatedAt}
          </div>
          {dash.collaborators.length > 0 && (
            <div className="avatar-stack">
              {dash.collaborators.slice(0, 3).map((c) => (
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
        </div>
      </div>
    </div>
  )
}

// ================ utils ================
export function chartTypeLabel(t: string) {
  const map: Record<string, string> = {
    line: '曲线图',
    bar: '柱状图',
    pie: '饼图',
    area: '面积图',
    kpi: '指标卡',
    table: '明细表',
    funnel: '漏斗图',
    scatter: '散点图',
    gauge: '仪表盘',
  }
  return map[t] || t
}

export function describeMetrics(ids: string[]) {
  return ids.map((id) => findMetric(id)?.name || id).join('、')
}
