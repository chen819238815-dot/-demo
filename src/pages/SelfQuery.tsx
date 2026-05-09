import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  DatePicker,
  Input,
  Select,
  Table,
  Tag,
  message,
  Dropdown,
} from 'antd'
import {
  PlusOutlined,
  AppstoreOutlined,
  DownOutlined,
  CodeOutlined,
  ReloadOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  MOCK_REPORTS,
  MOCK_TEMPLATES,
  QueryReport,
  findDimension,
  findMetric,
  findTemplate,
} from '../store/dashboard'
import TemplateModal from '../components/TemplateModal'

export default function SelfQuery() {
  const navigate = useNavigate()
  const [reports, setReports] = useState<QueryReport[]>(MOCK_REPORTS)
  const [tplModalOpen, setTplModalOpen] = useState(false)

  // 筛选
  const [createRange, setCreateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(
    null,
  )
  const [updateRange, setUpdateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(
    null,
  )
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState<string>('all')

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (keyword && !r.name.includes(keyword)) return false
      if (type !== 'all' && r.type !== type) return false
      return true
    })
  }, [reports, keyword, type])

  const reset = () => {
    setKeyword('')
    setType('all')
    setCreateRange(null)
    setUpdateRange(null)
  }

  // 用模板创建报表
  const onUseTemplate = (tplId: string) => {
    const tpl = findTemplate(tplId)
    if (!tpl) return
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const newReport: QueryReport = {
      id: 'rpt-' + Math.random().toString(36).slice(2, 8),
      name: tpl.name + ' 副本',
      type: tpl.dimensions.length > 1 ? '明细报表' : '汇总报表',
      templateId: tpl.id,
      metrics: tpl.metrics,
      dimensions: tpl.dimensions,
      owner: '15381035876',
      status: '执行成功',
      createdAt: now,
      updatedAt: now,
    }
    setReports((list) => [newReport, ...list])
    setTplModalOpen(false)
    message.success(`已创建报表：${newReport.name}`)
  }

  // 列定义（参考图1样式）
  const columns = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      render: (n: string, r: QueryReport) => (
        <div>
          <div style={{ fontWeight: 500, color: '#1f2329' }}>{n}</div>
          {r.templateId && (
            <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 2 }}>
              来源：{findTemplate(r.templateId)?.name}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '报表类型',
      dataIndex: 'type',
      key: 'type',
      render: (t: string) => <span style={{ color: '#4e5969' }}>{t}</span>,
    },
    {
      title: '操作人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === '执行成功' ? 'green' : s === '执行中' ? 'blue' : 'red'}>
          {s}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (t: string) => (
        <div style={{ fontSize: 12, color: '#4e5969', whiteSpace: 'pre-line' }}>
          {t.split(' ').join('\n')}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      render: (_: any, r: QueryReport) => (
        <div className="row gap-12" style={{ alignItems: 'center' }}>
          <Button type="link" size="small" style={{ padding: 0 }}>
            下载
          </Button>
          <Button type="link" size="small" style={{ padding: 0 }}>
            下载记录
          </Button>
          <Button
            type="link"
            size="small"
            style={{ padding: 0 }}
            onClick={() => message.info(`查看「${r.name}」详情`)}
          >
            详情
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'analysis',
                  label: '基于此报表创建仪表盘',
                  icon: <AppstoreOutlined />,
                  onClick: () => navigate('/analysis/dashboards/new'),
                },
                {
                  key: 'rerun',
                  label: '重新执行',
                  icon: <ReloadOutlined />,
                },
                { key: 'rename', label: '重命名' },
                {
                  key: 'delete',
                  label: '删除',
                  danger: true,
                  onClick: () => {
                    setReports((list) => list.filter((x) => x.id !== r.id))
                    message.success('已删除')
                  },
                },
              ],
            }}
          >
            <MoreOutlined style={{ color: '#86909c', cursor: 'pointer' }} />
          </Dropdown>
        </div>
      ),
    },
  ]

  return (
    <div>
      {/* 顶部 */}
      <div className="page-header">
        <div>
          <div className="page-title">
            <CodeOutlined style={{ color: '#4f7cff' }} /> 自助报表
          </div>
          <div className="page-subtitle">
            通过模板或自由组合维度、指标快速生成报表，可作为自助仪表盘的数据源
          </div>
        </div>
      </div>

      {/* 操作行 */}
      <div className="row gap-8 mb-16" style={{ alignItems: 'center' }}>
        <Dropdown
          menu={{
            items: [
              { key: 'detail', label: '明细报表' },
              { key: 'summary', label: '汇总报表' },
            ],
            onClick: ({ key }) => {
              const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
              const r: QueryReport = {
                id: 'rpt-' + Math.random().toString(36).slice(2, 8),
                name: '未命名报表',
                type: key === 'detail' ? '明细报表' : '汇总报表',
                metrics: [],
                dimensions: [],
                owner: '15381035876',
                status: '执行成功',
                createdAt: now,
                updatedAt: now,
              }
              setReports((list) => [r, ...list])
              message.success('新建空白报表，请前往详情配置维度与指标')
            },
          }}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            新建报表 <DownOutlined />
          </Button>
        </Dropdown>
        <Button onClick={() => setTplModalOpen(true)}>从模板新建</Button>

        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#4f7cff', cursor: 'pointer' }}>
          使用手册
        </div>
      </div>

      {/* 筛选区（参考图1） */}
      <div className="filter-bar">
        <div className="filter-row">
          <span className="filter-label">创建时间：</span>
          <DatePicker
            placeholder="开始日期"
            value={createRange?.[0] || null}
            onChange={(d) => setCreateRange([d, createRange?.[1] || null])}
            style={{ flex: 1 }}
          />
          <span style={{ color: '#86909c' }}>至</span>
          <DatePicker
            placeholder="结束日期"
            value={createRange?.[1] || null}
            onChange={(d) => setCreateRange([createRange?.[0] || null, d])}
            style={{ flex: 1 }}
          />
        </div>
        <div className="filter-row">
          <span className="filter-label">报表名称：</span>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="请输入报表名称"
            style={{ flex: 1 }}
          />
        </div>
        <div className="filter-row">
          <span className="filter-label">报表类型：</span>
          <Select
            value={type}
            onChange={setType}
            style={{ flex: 1 }}
            options={[
              { value: 'all', label: '全部' },
              { value: '明细报表', label: '明细报表' },
              { value: '汇总报表', label: '汇总报表' },
            ]}
          />
        </div>
        <div className="filter-row">
          <span className="filter-label">更新时间：</span>
          <DatePicker
            placeholder="开始日期"
            value={updateRange?.[0] || null}
            onChange={(d) => setUpdateRange([d, updateRange?.[1] || null])}
            style={{ flex: 1 }}
          />
          <span style={{ color: '#86909c' }}>至</span>
          <DatePicker
            placeholder="结束日期"
            value={updateRange?.[1] || null}
            onChange={(d) => setUpdateRange([updateRange?.[0] || null, d])}
            style={{ flex: 1 }}
          />
        </div>
        <div className="filter-actions-row">
          <Button type="primary">筛选</Button>
          <Button onClick={reset}>重置</Button>
        </div>
      </div>

      {/* 列表 */}
      <div className="section-card">
        <div className="section-head">
          <h3>
            <span style={{ color: '#1f2329' }}>报表列表</span>
            <span style={{ fontSize: 12, color: '#bfbfbf', fontWeight: 400, marginLeft: 8 }}>
              共 {filtered.length} 条
            </span>
          </h3>
          <span style={{ fontSize: 13, color: '#4f7cff', cursor: 'pointer' }}>
            查看已导出报表
          </span>
        </div>
        <Table
          dataSource={filtered.map((r) => ({ ...r, key: r.id }))}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          className="compact-table"
          expandable={{
            expandedRowRender: (r: QueryReport) => (
              <div style={{ padding: '0 12px 8px' }}>
                <div className="row gap-8 mb-8" style={{ flexWrap: 'wrap' }}>
                  <span className="muted-12">维度：</span>
                  {r.dimensions.length === 0 ? (
                    <span className="muted-12">未配置</span>
                  ) : (
                    r.dimensions.map((id) => (
                      <span key={id} className="field-chip dimension">
                        {findDimension(id)?.name}
                      </span>
                    ))
                  )}
                </div>
                <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
                  <span className="muted-12">指标：</span>
                  {r.metrics.length === 0 ? (
                    <span className="muted-12">未配置</span>
                  ) : (
                    r.metrics.map((id) => (
                      <span key={id} className="field-chip metric">
                        {findMetric(id)?.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ),
          }}
        />
        <div style={{ padding: '8px 16px', fontSize: 12, color: '#bfbfbf' }}>
          系统提供 {MOCK_TEMPLATES.length} 个模板，可一键创建报表
        </div>
      </div>

      {/* 模板对话框 */}
      <TemplateModal
        open={tplModalOpen}
        onClose={() => setTplModalOpen(false)}
        onUse={(t) => onUseTemplate(t.id)}
      />
    </div>
  )
}
