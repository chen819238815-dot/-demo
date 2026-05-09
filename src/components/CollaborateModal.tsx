import { useEffect, useState } from 'react'
import { Modal, Select, Tag, message, Empty } from 'antd'
import { TeamOutlined, UserAddOutlined } from '@ant-design/icons'
import { Dashboard, useDashboards } from '../store/dashboard'

const CANDIDATES = [
  { name: '王明', role: '运营', color: '#4f7cff' },
  { name: '李雪', role: '营销', color: '#a259ff' },
  { name: '张伟', role: '增长', color: '#00b42a' },
  { name: '陈娜', role: 'CEO办', color: '#ff7d00' },
  { name: '赵强', role: '华东总监', color: '#722ed1' },
  { name: '钱磊', role: '商品中心', color: '#13c2c2' },
]

export default function CollaborateModal({
  dashboard,
  open,
  onClose,
}: {
  dashboard: Dashboard | null
  open: boolean
  onClose: () => void
}) {
  const { update } = useDashboards()
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (dashboard) setSelected(dashboard.collaborators.map((c) => c.name))
  }, [dashboard])

  if (!dashboard) return null

  const onSave = () => {
    const next = CANDIDATES.filter((c) => selected.includes(c.name)).map((c) => ({
      name: c.name,
      color: c.color,
    }))
    update(dashboard.id, { collaborators: next })
    message.success(`已邀请 ${next.length} 位协同编辑者`)
    onClose()
  }

  return (
    <Modal
      title={
        <span>
          <TeamOutlined style={{ color: '#4f7cff', marginRight: 6 }} />
          协同编辑 · {dashboard.name}
        </span>
      }
      open={open}
      onCancel={onClose}
      onOk={onSave}
      okText={
        <span>
          <UserAddOutlined /> 确认邀请
        </span>
      }
      width={520}
    >
      <div className="muted-13 mb-12">
        添加成员后，他们可以同时编辑该仪表盘的数据源、看板与图表，所有操作实时同步。
      </div>

      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="搜索成员姓名 / 部门"
        value={selected}
        onChange={setSelected}
        options={CANDIDATES.map((c) => ({
          label: `${c.name}（${c.role}）`,
          value: c.name,
        }))}
      />

      {selected.length > 0 ? (
        <div
          className="section-card mt-16"
          style={{ marginBottom: 0 }}
        >
          <div className="section-body">
            <div className="text-strong mb-12" style={{ fontSize: 13 }}>
              当前协作者
            </div>
            <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
              {CANDIDATES.filter((c) => selected.includes(c.name)).map((c) => (
                <Tag
                  key={c.name}
                  closable
                  onClose={() => setSelected(selected.filter((n) => n !== c.name))}
                  style={{
                    padding: '4px 10px',
                    fontSize: 12,
                    background: c.color + '14',
                    color: c.color,
                    border: `1px solid ${c.color}40`,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: c.color,
                      color: '#fff',
                      marginRight: 4,
                      fontSize: 10,
                    }}
                  >
                    {c.name[0]}
                  </span>
                  {c.name} · {c.role}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-16">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="尚未邀请协作者"
          />
        </div>
      )}
    </Modal>
  )
}
