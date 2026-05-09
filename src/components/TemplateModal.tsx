import { useMemo, useState } from 'react'
import { Modal, Input, Empty, message, Dropdown } from 'antd'
import { SearchOutlined, DownOutlined } from '@ant-design/icons'
import {
  MOCK_TEMPLATES,
  QueryTemplate,
  findDimension,
  findMetric,
} from '../store/dashboard'

const CATS: { key: string; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: '业绩', label: '业绩' },
  { key: '商品', label: '商品' },
  { key: '财务核算', label: '财务核算' },
  { key: '进销存', label: '进销存' },
  { key: '营销', label: '营销' },
  { key: '客户', label: '客户' },
  { key: '储值', label: '储值' },
  { key: '流量', label: '流量' },
]

export default function TemplateModal({
  open,
  onClose,
  onUse,
}: {
  open: boolean
  onClose: () => void
  onUse: (tpl: QueryTemplate) => void
}) {
  const [cat, setCat] = useState('all')
  const [kw, setKw] = useState('')

  const list = useMemo(() => {
    return MOCK_TEMPLATES.filter(
      (t) =>
        (cat === 'all' || t.category === cat) &&
        (!kw || t.name.includes(kw) || t.desc.includes(kw)),
    )
  }, [cat, kw])

  return (
    <Modal
      title="从模板新建"
      open={open}
      onCancel={onClose}
      footer={null}
      width={920}
      destroyOnClose
    >
      <Input
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        placeholder="请输入模板名称/关键字"
        value={kw}
        onChange={(e) => setKw(e.target.value)}
        style={{ marginBottom: 16 }}
        size="large"
      />

      {/* 分类 Tabs（参考图2） */}
      <div
        className="row gap-4 mb-16"
        style={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        <span className="muted-13" style={{ marginRight: 6 }}>
          模板分类
        </span>
        {CATS.map((c) => (
          <span
            key={c.key}
            onClick={() => setCat(c.key)}
            style={{
              padding: '4px 12px',
              fontSize: 13,
              borderRadius: 14,
              cursor: 'pointer',
              color: cat === c.key ? '#4f7cff' : '#4e5969',
              fontWeight: cat === c.key ? 500 : 400,
              background: cat === c.key ? '#f0f5ff' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            {c.label}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#4f7cff', cursor: 'pointer' }}>
          更多
        </span>
      </div>

      {/* 模板卡片 grid */}
      {list.length === 0 ? (
        <Empty description="暂无匹配模板" />
      ) : (
        <div
          style={{
            maxHeight: 540,
            overflow: 'auto',
            paddingRight: 4,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
            }}
          >
            {list.map((t) => (
              <TemplateCard
                key={t.id}
                tpl={t}
                onUse={() => {
                  onUse(t)
                  message.success(`已使用模板：${t.name}`)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}

function TemplateCard({ tpl, onUse }: { tpl: QueryTemplate; onUse: () => void }) {
  const dimNames = tpl.dimensions.map((d) => findDimension(d)?.name).filter(Boolean).join('、')
  const metricNames = tpl.metrics.map((m) => findMetric(m)?.name).filter(Boolean).join('、')

  return (
    <div className="template-card">
      <div className="tname">{tpl.name}</div>
      <div className="tdesc">{tpl.desc}</div>

      <div className="trow" style={{ marginTop: 14 }}>
        <span className="tlabel">维度：</span>
        <span className="tvalue">
          <strong style={{ color: '#1f2329' }}>{tpl.dimensions.length}个</strong>
          <span style={{ color: '#86909c', marginLeft: 4 }}>/ {dimNames || '—'}</span>
        </span>
      </div>
      <div className="trow">
        <span className="tlabel">指标：</span>
        <span className="tvalue">
          <strong style={{ color: '#1f2329' }}>{tpl.metrics.length}个</strong>
          <span style={{ color: '#86909c', marginLeft: 4 }}>/ {metricNames || '—'}</span>
        </span>
      </div>

      <Dropdown
        menu={{
          onClick: ({ key }) => {
            if (key === 'use') onUse()
          },
          items: [
            { key: 'use', label: '直接使用模板' },
            { key: 'preview', label: '预览模板字段' },
          ],
        }}
      >
        <button className="tbtn" onClick={onUse}>
          使用模板 <DownOutlined style={{ fontSize: 10 }} />
        </button>
      </Dropdown>
    </div>
  )
}
