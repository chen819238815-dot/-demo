import { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  Table,
  Input,
  Button,
  Tag,
  Dropdown,
  Tooltip,
  Checkbox,
  Tabs,
  message,
} from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { SorterResult } from 'antd/es/table/interface'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import {
  SearchOutlined,
  SettingOutlined,
  DownloadOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  FileSearchOutlined,
  FormOutlined,
  PlusOutlined,
  HolderOutlined,
} from '@ant-design/icons'
import {
  DataSource,
  findDimension,
  findMetric,
  findReport,
  findTemplate,
} from '../store/dashboard'
import { makeTableData } from '../data/chartMock'

const TYPE_META = {
  template: { label: '模板创建', color: '#4f7cff', icon: <AppstoreOutlined /> },
  report: { label: '已有报表', color: '#a259ff', icon: <FileSearchOutlined /> },
  direct: { label: '直接创建', color: '#00b42a', icon: <FormOutlined /> },
}

type ColumnType = 'dim' | 'metric'

interface ColumnMeta {
  id: string // dimension/metric id
  name: string
  kind: ColumnType
  unit?: string
}

export default function DataSourceDetailModal({
  dataSources,
  initialId,
  open,
  onClose,
}: {
  dataSources: DataSource[]
  initialId?: string | null
  open: boolean
  onClose: () => void
}) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (open) {
      setActiveId(initialId || dataSources[0]?.id || '')
    }
  }, [open, initialId, dataSources])

  return (
    <Modal
      title="数据源详情"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1100}
      destroyOnClose
      style={{ top: 36 }}
    >
      {dataSources.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#86909c' }}>暂无数据源</div>
      ) : (
        <Tabs
          activeKey={activeId}
          onChange={setActiveId}
          items={dataSources.map((d) => ({
            key: d.id,
            label: (
              <span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    color: TYPE_META[d.type].color,
                  }}
                >
                  {TYPE_META[d.type].icon}
                </span>{' '}
                {d.name}
              </span>
            ),
            children: <DataSourceTablePanel ds={d} />,
          }))}
        />
      )}
    </Modal>
  )
}

// =================== 单个数据源表格 ===================
function DataSourceTablePanel({ ds }: { ds: DataSource }) {
  // 全部可用列
  const allColumns: ColumnMeta[] = useMemo(
    () => [
      ...ds.dimensions.map(
        (id): ColumnMeta => ({
          id,
          name: findDimension(id)?.name || id,
          kind: 'dim',
        }),
      ),
      ...ds.metrics.map(
        (id): ColumnMeta => ({
          id,
          name: findMetric(id)?.name || id,
          kind: 'metric',
          unit: findMetric(id)?.unit,
        }),
      ),
    ],
    [ds.dimensions, ds.metrics],
  )

  // 显示哪些列（默认全显示）
  const [visibleIds, setVisibleIds] = useState<string[]>(allColumns.map((c) => c.id))
  // 列顺序（用户拖动 / 上移 / 下移）
  const [orderIds, setOrderIds] = useState<string[]>(allColumns.map((c) => c.id))
  // 关键字搜索
  const [kw, setKw] = useState('')
  // 自定义字段抽屉
  const [customOpen, setCustomOpen] = useState(false)

  useEffect(() => {
    setVisibleIds(allColumns.map((c) => c.id))
    setOrderIds(allColumns.map((c) => c.id))
    setKw('')
  }, [ds.id])

  // 数据生成
  const rawData = useMemo<Record<string, any>[]>(
    () =>
      makeTableData(ds.metrics, ds.dimensions, Math.min(80, Math.max(20, ds.rowCount / 6))).map(
        (r, i) => ({ ...r, __key: i }),
      ),
    [ds.id, ds.metrics, ds.dimensions, ds.rowCount],
  )

  // 关键字筛选（对所有维度列做模糊查询）
  const filteredData = useMemo(() => {
    if (!kw.trim()) return rawData
    const s = kw.trim().toLowerCase()
    return rawData.filter((row) =>
      ds.dimensions.some((d) => String(row[d] ?? '').toLowerCase().includes(s)),
    )
  }, [rawData, kw, ds.dimensions])

  // 表格列（按 orderIds + visibleIds 决定）
  const columns: ColumnsType<any> = useMemo(() => {
    return orderIds
      .filter((id) => visibleIds.includes(id))
      .map((id) => {
        const meta = allColumns.find((c) => c.id === id)!
        return {
          title: (
            <span>
              <span
                style={{
                  fontSize: 10,
                  color: meta.kind === 'dim' ? '#00b42a' : '#4f7cff',
                  marginRight: 4,
                }}
              >
                {meta.kind === 'dim' ? 'D' : 'M'}
              </span>
              {meta.name}
              {meta.unit && (
                <span style={{ color: '#bfbfbf', marginLeft: 3, fontSize: 11 }}>
                  / {meta.unit}
                </span>
              )}
            </span>
          ),
          dataIndex: id,
          key: id,
          align: meta.kind === 'metric' ? ('right' as const) : ('left' as const),
          sorter: (a: any, b: any) => {
            const va = a[id]
            const vb = b[id]
            if (typeof va === 'number' && typeof vb === 'number') return va - vb
            return String(va ?? '').localeCompare(String(vb ?? ''))
          },
          render: (v: any) => {
            if (typeof v === 'number')
              return v.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
            return v ?? '—'
          },
        }
      })
  }, [orderIds, visibleIds, allColumns])

  const onExport = () => {
    message.success('已生成下载任务，请前往「自助报表 - 已导出报表」查看')
  }

  return (
    <div>
      {/* 概况信息 */}
      <div
        style={{
          background: '#fafbfc',
          border: '1px solid #eef0f3',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div className="row gap-8" style={{ alignItems: 'center' }}>
          <Tag
            color={
              ds.type === 'template' ? 'blue' : ds.type === 'report' ? 'purple' : 'green'
            }
            style={{ margin: 0 }}
          >
            {TYPE_META[ds.type].label}
          </Tag>
          <span className="text-strong">{ds.name}</span>
        </div>

        {ds.templateId && (
          <div className="muted-12">
            来源模板：<span style={{ color: '#4e5969' }}>{findTemplate(ds.templateId)?.name}</span>
          </div>
        )}
        {ds.reportId && (
          <div className="muted-12">
            来源报表：<span style={{ color: '#4e5969' }}>{findReport(ds.reportId)?.name}</span>
          </div>
        )}
        <div className="muted-12">维度 {ds.dimensions.length}</div>
        <div className="muted-12">指标 {ds.metrics.length}</div>
        <div className="muted-12">预估行数 {ds.rowCount.toLocaleString()}</div>
        <div className="muted-12">创建时间 {ds.createdAt}</div>
      </div>

      {/* 工具栏 */}
      <div
        className="row gap-8 mb-12"
        style={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          placeholder="搜索维度内容…"
          allowClear
          size="middle"
          style={{ width: 240 }}
          value={kw}
          onChange={(e) => setKw(e.target.value)}
        />
        <span className="muted-12">
          共 {filteredData.length} 条 · 显示 {columns.length} / {allColumns.length} 列
        </span>

        <div style={{ marginLeft: 'auto' }} className="row gap-8">
          <Tooltip title="刷新">
            <Button icon={<ReloadOutlined />} />
          </Tooltip>
          <Tooltip title="导出 Excel">
            <Button icon={<DownloadOutlined />} onClick={onExport} />
          </Tooltip>
          <Dropdown
            trigger={['click']}
            open={customOpen}
            onOpenChange={setCustomOpen}
            placement="bottomRight"
            dropdownRender={() => (
              <CustomColumnsPanel
                allColumns={allColumns}
                visibleIds={visibleIds}
                orderIds={orderIds}
                onChange={(v, o) => {
                  setVisibleIds(v)
                  setOrderIds(o)
                }}
              />
            )}
          >
            <Button icon={<SettingOutlined />} type="primary" ghost>
              自定义字段
            </Button>
          </Dropdown>
        </div>
      </div>

      {/* 表格 */}
      <Table
        rowKey="__key"
        size="small"
        className="compact-table"
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: 'max-content', y: 420 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (t) => `共 ${t} 条`,
        }}
        sortDirections={['descend', 'ascend']}
        onChange={(_p: TablePaginationConfig, _f, sorter: SorterResult<any> | SorterResult<any>[]) => {
          // 仅用于消除未使用变量提示
          void _p
          void _f
          void sorter
        }}
      />
    </div>
  )
}

// =================== 自定义字段面板 ===================
function CustomColumnsPanel({
  allColumns,
  visibleIds,
  orderIds,
  onChange,
}: {
  allColumns: ColumnMeta[]
  visibleIds: string[]
  orderIds: string[]
  onChange: (visible: string[], order: string[]) => void
}) {
  const dims = orderIds
    .map((id) => allColumns.find((c) => c.id === id))
    .filter((c): c is ColumnMeta => !!c && c.kind === 'dim')
  const metrics = orderIds
    .map((id) => allColumns.find((c) => c.id === id))
    .filter((c): c is ColumnMeta => !!c && c.kind === 'metric')

  const toggle = (id: string, checked: boolean) => {
    onChange(
      checked ? [...visibleIds, id] : visibleIds.filter((x) => x !== id),
      orderIds,
    )
  }

  const move = (id: string, dir: -1 | 1) => {
    const idx = orderIds.indexOf(id)
    if (idx < 0) return
    const t = idx + dir
    if (t < 0 || t >= orderIds.length) return
    const next = [...orderIds]
    ;[next[idx], next[t]] = [next[t], next[idx]]
    onChange(visibleIds, next)
  }

  const onAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) onChange(allColumns.map((c) => c.id), orderIds)
    else onChange([], orderIds)
  }

  const reset = () => {
    onChange(
      allColumns.map((c) => c.id),
      allColumns.map((c) => c.id),
    )
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 24px rgba(15,23,42,0.12)',
        padding: 12,
        width: 320,
        maxHeight: 460,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="row mb-8"
        style={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Checkbox
          checked={visibleIds.length === allColumns.length}
          indeterminate={visibleIds.length > 0 && visibleIds.length < allColumns.length}
          onChange={onAll}
        >
          全选
        </Checkbox>
        <Button type="link" size="small" onClick={reset} style={{ padding: 0 }}>
          重置
        </Button>
      </div>

      <div style={{ overflow: 'auto', maxHeight: 380 }}>
        <SectionGroup title="维度" color="#00b42a">
          {dims.length === 0 && <div className="muted-12">无可选维度</div>}
          {dims.map((c) => (
            <FieldItem
              key={c.id}
              col={c}
              checked={visibleIds.includes(c.id)}
              onToggle={(v) => toggle(c.id, v)}
              onUp={() => move(c.id, -1)}
              onDown={() => move(c.id, 1)}
            />
          ))}
        </SectionGroup>

        <SectionGroup title="指标" color="#4f7cff">
          {metrics.length === 0 && <div className="muted-12">无可选指标</div>}
          {metrics.map((c) => (
            <FieldItem
              key={c.id}
              col={c}
              checked={visibleIds.includes(c.id)}
              onToggle={(v) => toggle(c.id, v)}
              onUp={() => move(c.id, -1)}
              onDown={() => move(c.id, 1)}
            />
          ))}
        </SectionGroup>
      </div>

      <div className="muted-12 mt-8" style={{ fontSize: 11 }}>
        提示：点击行右侧的「上下箭头」可调整列顺序
      </div>
    </div>
  )
}

function SectionGroup({
  title,
  color,
  children,
}: {
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontSize: 11,
          color,
          fontWeight: 600,
          padding: '4px 6px',
          marginBottom: 2,
        }}
      >
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

function FieldItem({
  col,
  checked,
  onToggle,
  onUp,
  onDown,
}: {
  col: ColumnMeta
  checked: boolean
  onToggle: (checked: boolean) => void
  onUp: () => void
  onDown: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 6px',
        borderRadius: 6,
        gap: 8,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f7fa')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <HolderOutlined style={{ color: '#bfbfbf', cursor: 'grab' }} />
      <Checkbox checked={checked} onChange={(e) => onToggle(e.target.checked)} />
      <span style={{ fontSize: 13, flex: 1 }}>
        {col.name}
        {col.unit && <span style={{ color: '#bfbfbf', marginLeft: 4, fontSize: 11 }}>/ {col.unit}</span>}
      </span>
      <Button
        type="text"
        size="small"
        icon={<span style={{ fontSize: 10 }}>↑</span>}
        onClick={onUp}
      />
      <Button
        type="text"
        size="small"
        icon={<span style={{ fontSize: 10 }}>↓</span>}
        onClick={onDown}
      />
    </div>
  )
}

// 防止未使用图标警告
export const __unused = { PlusOutlined }
