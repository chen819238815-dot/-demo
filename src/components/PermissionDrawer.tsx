import { useEffect, useState } from 'react'
import { Drawer, Button, Switch, Select, Tag, message, Divider, Empty } from 'antd'
import { SafetyCertificateOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Dashboard, useDashboards } from '../store/dashboard'

const ROLES = [
  'CEO',
  '区域运营总监',
  '城市运营经理',
  '门店店长',
  '营销专员',
  '商品运营',
  '财务',
  '数据分析师',
]

const USERS = [
  '王明（运营）',
  '李雪（营销）',
  '张伟（增长）',
  '陈娜（CEO办）',
  '赵强（华东总监）',
  '钱磊（商品中心）',
]

export default function PermissionDrawer({
  dashboard,
  open,
  onClose,
}: {
  dashboard: Dashboard | null
  open: boolean
  onClose: () => void
}) {
  const { update } = useDashboards()
  const [pub, setPub] = useState(false)
  const [roles, setRoles] = useState<string[]>([])
  const [users, setUsers] = useState<string[]>([])

  useEffect(() => {
    if (dashboard) {
      setPub(dashboard.permission.public)
      setRoles(dashboard.permission.roles)
      setUsers(dashboard.permission.users)
    }
  }, [dashboard])

  if (!dashboard) return null

  const onSave = () => {
    update(dashboard.id, {
      permission: { public: pub, roles, users },
    })
    message.success('权限已保存')
    onClose()
  }

  return (
    <Drawer
      title={
        <span>
          <SafetyCertificateOutlined style={{ color: '#4f7cff', marginRight: 6 }} />
          仪表盘权限设置 · {dashboard.name}
        </span>
      }
      open={open}
      onClose={onClose}
      width={460}
      footer={
        <div className="row gap-8" style={{ justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={onSave}>
            保存权限
          </Button>
        </div>
      }
    >
      <div className="section-card" style={{ marginBottom: 12 }}>
        <div className="section-body">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="text-strong" style={{ fontSize: 14 }}>
                公开范围
              </div>
              <div className="muted-12 mt-8">开启后，店铺内所有员工都可查看此仪表盘</div>
            </div>
            <Switch checked={pub} onChange={setPub} />
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-body">
          <div className="row mb-12" style={{ alignItems: 'center', gap: 6 }}>
            <TeamOutlined style={{ color: '#4f7cff' }} />
            <span className="text-strong">按角色开放</span>
            <span className="muted-12">指定的角色将拥有查看权限</span>
          </div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="选择角色（可多选）"
            value={roles}
            onChange={setRoles}
            options={ROLES.map((r) => ({ label: r, value: r }))}
            disabled={pub}
          />
          {roles.length > 0 && (
            <div className="row mt-8" style={{ flexWrap: 'wrap', gap: 6 }}>
              {roles.map((r) => (
                <Tag key={r} color="blue">
                  {r}
                </Tag>
              ))}
            </div>
          )}

          <Divider style={{ margin: '14px 0' }} />

          <div className="row mb-12" style={{ alignItems: 'center', gap: 6 }}>
            <UserOutlined style={{ color: '#a259ff' }} />
            <span className="text-strong">按个人开放</span>
            <span className="muted-12">添加具体成员开放访问</span>
          </div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="搜索并添加成员"
            value={users}
            onChange={setUsers}
            options={USERS.map((u) => ({ label: u, value: u }))}
            disabled={pub}
          />
          {users.length > 0 && (
            <div className="row mt-8" style={{ flexWrap: 'wrap', gap: 6 }}>
              {users.map((u) => (
                <Tag key={u} color="purple">
                  {u}
                </Tag>
              ))}
            </div>
          )}

          {pub && (
            <div className="mt-12">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="已开启公开访问，无需配置角色与人员"
              />
            </div>
          )}
        </div>
      </div>
    </Drawer>
  )
}
