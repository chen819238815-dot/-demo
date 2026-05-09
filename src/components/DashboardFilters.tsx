import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Select,
  Tag,
  Tooltip,
  message,
} from 'antd'
import {
  CloseCircleFilled,
  QuestionCircleOutlined,
  SearchOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'

// =================== 数据 ===================
export type TimeKind = 'realtime' | 'day' | 'week' | 'month' | 'custom'

export interface ShopItem {
  id: string
  name: string
  type: '门店' | '商城' | '直播'
  closed?: boolean
}

const SHOP_ALL_ID = '__ALL__'

export const MOCK_SHOPS: ShopItem[] = [
  { id: 's-1', name: '商城迁移成一体化商品未迁移', type: '门店' },
  { id: 's-2', name: '我的门店77', type: '门店' },
  { id: 's-3', name: '我的门店33260305', type: '门店' },
  { id: 's-4', name: 'ysq-zy先款后货独立销售门店-15264...', type: '门店' },
  { id: 's-5', name: '果盘的一体化1017', type: '门店' },
  { id: 's-6', name: '上海中山公园店', type: '门店' },
  { id: 's-7', name: '北京三里屯店', type: '门店' },
  { id: 's-8', name: '广州天河店', type: '门店' },
  { id: 's-9', name: '深圳福田店', type: '门店' },
  { id: 's-10', name: '杭州万象城店', type: '门店' },
  { id: 's-11', name: '果果泥呀官方旗舰店', type: '商城' },
  { id: 's-12', name: '抖音直播间', type: '直播' },
  { id: 's-13', name: '南京新街口店（打烊）', type: '门店', closed: true },
  { id: 's-14', name: '成都春熙路店（打烊）', type: '门店', closed: true },
]

const CHANNEL_OPTIONS = [
  { value: 'web', label: '网店渠道' },
  { value: 'retail', label: '门店渠道' },
  { value: 'live', label: '直播渠道' },
  { value: 'all', label: '全渠道' },
]

// =================== 组件主体 ===================
export interface FilterValue {
  timeKind: TimeKind
  date: Dayjs
  shopIds: string[] // 含 SHOP_ALL_ID 表示"全部店铺"
  channel: string
}

export const DEFAULT_FILTER: FilterValue = {
  timeKind: 'day',
  date: dayjs(),
  shopIds: [SHOP_ALL_ID],
  channel: 'web',
}

export default function DashboardFilters({
  value,
  onChange,
}: {
  value: FilterValue
  onChange: (next: FilterValue) => void
}) {
  return (
    <div className="dash-filters">
      <div className="dash-filter-row">
        <span className="dash-filter-label">统计时间：</span>
        <StatTimePicker
          kind={value.timeKind}
          date={value.date}
          onChange={(timeKind, date) => onChange({ ...value, timeKind, date })}
        />
      </div>

      <div className="dash-filter-row">
        <span className="dash-filter-label">选择店铺：</span>
        <ShopPicker
          value={value.shopIds}
          onChange={(shopIds) => onChange({ ...value, shopIds })}
        />
      </div>

      <div className="dash-filter-row">
        <span className="dash-filter-label">选择渠道：</span>
        <Select
          size="middle"
          style={{ width: 180 }}
          value={value.channel}
          options={CHANNEL_OPTIONS}
          onChange={(channel) => onChange({ ...value, channel })}
        />
        <Tooltip title="筛选不同业务渠道的数据">
          <QuestionCircleOutlined style={{ color: '#bfbfbf', fontSize: 14, marginLeft: 4 }} />
        </Tooltip>
      </div>
    </div>
  )
}

// =================== 统计时间组件 ===================
function StatTimePicker({
  kind,
  date,
  onChange,
}: {
  kind: TimeKind
  date: Dayjs
  onChange: (kind: TimeKind, date: Dayjs) => void
}) {
  const kindOptions = [
    { value: 'realtime' as const, label: '实时' },
    { value: 'day' as const, label: '自然日' },
    { value: 'week' as const, label: '自然周' },
    { value: 'month' as const, label: '自然月' },
    { value: 'custom' as const, label: '自定义' },
  ]

  const renderPicker = () => {
    if (kind === 'realtime') {
      return (
        <Input
          readOnly
          value={dayjs().format('YYYY-MM-DD HH:mm')}
          style={{ width: 200, color: '#4e5969' }}
          suffix={
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#00b42a',
                animation: 'dashPulse 1.4s infinite',
              }}
            />
          }
        />
      )
    }
    if (kind === 'week') {
      return (
        <DatePicker
          picker="week"
          value={date}
          onChange={(d) => d && onChange(kind, d)}
          style={{ width: 200 }}
        />
      )
    }
    if (kind === 'month') {
      return (
        <DatePicker
          picker="month"
          value={date}
          onChange={(d) => d && onChange(kind, d)}
          style={{ width: 200 }}
        />
      )
    }
    if (kind === 'custom') {
      return (
        <DatePicker.RangePicker
          value={[date.subtract(6, 'day'), date] as any}
          onChange={(v) => v?.[1] && onChange(kind, v[1] as Dayjs)}
          style={{ width: 280 }}
        />
      )
    }
    // day（默认）
    return (
      <DatePicker
        value={date}
        onChange={(d) => d && onChange(kind, d)}
        style={{ width: 200 }}
        format="YYYY-MM-DD"
      />
    )
  }

  return (
    <div className="row gap-8" style={{ alignItems: 'center' }}>
      <Select
        value={kind}
        onChange={(v) => onChange(v as TimeKind, date)}
        options={kindOptions}
        style={{ width: 96 }}
      />
      {renderPicker()}
      <Button
        type="link"
        size="small"
        style={{ padding: '4px 6px', fontSize: 13 }}
        onClick={() => onChange(kind === 'realtime' ? 'day' : kind, dayjs().subtract(1, 'day'))}
      >
        昨日
      </Button>
      <Button
        type="link"
        size="small"
        style={{ padding: '4px 6px', fontSize: 13 }}
        onClick={() => onChange(kind === 'realtime' ? 'day' : kind, dayjs().subtract(2, 'day'))}
      >
        前天
      </Button>
    </div>
  )
}

// =================== 店铺选择组件 ===================
function ShopPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [tempSelected, setTempSelected] = useState<string[]>(value)
  const [showClosed, setShowClosed] = useState(false)
  const [kw, setKw] = useState('')
  const [batchOpen, setBatchOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  // 同步外部 value
  useEffect(() => {
    setTempSelected(value)
  }, [value])

  // 点击外部关闭
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setTempSelected(value) // 取消时回滚
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open, value])

  const isAll = value.includes(SHOP_ALL_ID)
  const tempIsAll = tempSelected.includes(SHOP_ALL_ID)

  const visibleShops = useMemo(() => {
    return MOCK_SHOPS.filter((s) => (showClosed ? true : !s.closed)).filter(
      (s) => !kw.trim() || s.name.includes(kw.trim()),
    )
  }, [showClosed, kw])

  const tagsToShow = (() => {
    if (isAll) return [{ id: SHOP_ALL_ID, name: '全部店铺', type: '门店' as const }]
    return MOCK_SHOPS.filter((s) => value.includes(s.id))
  })()

  const onToggle = (id: string) => {
    if (id === SHOP_ALL_ID) {
      setTempSelected(tempIsAll ? [] : [SHOP_ALL_ID])
      return
    }
    if (tempIsAll) {
      setTempSelected([id])
      return
    }
    if (tempSelected.includes(id)) {
      setTempSelected(tempSelected.filter((x) => x !== id))
    } else {
      setTempSelected([...tempSelected, id])
    }
  }

  const onConfirm = () => {
    if (tempSelected.length === 0) {
      message.warning('请至少选择一个店铺')
      return
    }
    onChange(tempSelected)
    setOpen(false)
  }

  const onClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([SHOP_ALL_ID])
  }

  return (
    <div className="row gap-8" style={{ alignItems: 'center', position: 'relative' }} ref={wrapRef}>
      {/* 触发器 */}
      <div
        className={`shop-trigger ${open ? 'focused' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="shop-trigger-tags">
          {tagsToShow.length === 0 ? (
            <span className="shop-trigger-placeholder">请选择店铺</span>
          ) : (
            tagsToShow.slice(0, 3).map((s) => (
              <Tag
                key={s.id}
                closable={s.id !== SHOP_ALL_ID || tagsToShow.length > 1}
                onClose={(e) => {
                  e.preventDefault()
                  if (s.id === SHOP_ALL_ID) {
                    onChange([])
                  } else {
                    const rest = value.filter((x) => x !== s.id)
                    onChange(rest.length === 0 ? [SHOP_ALL_ID] : rest)
                  }
                }}
                style={{
                  background: '#f0f5ff',
                  borderColor: '#c7d6ff',
                  color: '#4f7cff',
                  margin: 0,
                }}
              >
                {s.name}
              </Tag>
            ))
          )}
          {tagsToShow.length > 3 && (
            <span className="shop-trigger-more">+{tagsToShow.length - 3}</span>
          )}
        </div>

        {!isAll && tagsToShow.length > 0 && (
          <Tooltip title="清空">
            <CloseCircleFilled className="shop-trigger-clear" onClick={onClear} />
          </Tooltip>
        )}
        <span className="shop-trigger-divider" />
        <Button
          type="link"
          size="small"
          style={{ padding: 0, height: 22, fontSize: 13 }}
          onClick={(e) => {
            e.stopPropagation()
            setBatchOpen(true)
          }}
        >
          批量选择
        </Button>
      </div>

      {/* 弹出层 */}
      {open && (
        <div className="shop-pop" onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: 8 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="请输入店铺名称"
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              size="middle"
              style={{ background: '#fafbfc' }}
            />
          </div>

          <div className="shop-pop-list">
            {/* 全部店铺 */}
            <div
              className={`shop-pop-row ${tempIsAll ? 'active' : ''}`}
              onClick={() => onToggle(SHOP_ALL_ID)}
            >
              <span style={{ flex: 1, fontWeight: tempIsAll ? 500 : 400 }}>
                全部店铺
              </span>
              {tempIsAll && (
                <CheckOutlined style={{ color: '#4f7cff', fontSize: 13 }} />
              )}
            </div>

            {/* 店铺列表 */}
            {visibleShops.map((s) => {
              const sel = tempSelected.includes(s.id) && !tempIsAll
              return (
                <div
                  key={s.id}
                  className={`shop-pop-row ${sel ? 'active' : ''}`}
                  onClick={() => onToggle(s.id)}
                >
                  <span className={`shop-tag-mini shop-tag-${s.type}`}>{s.type}</span>
                  <span
                    style={{
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.name}
                  </span>
                  {sel && <CheckOutlined style={{ color: '#4f7cff', fontSize: 13 }} />}
                </div>
              )
            })}

            {visibleShops.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: '#bfbfbf', fontSize: 13 }}>
                暂无匹配店铺
              </div>
            )}
          </div>

          <div className="shop-pop-foot">
            <Checkbox checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)}>
              显示打烊店铺
            </Checkbox>
            <Tooltip title="勾选后会显示已打烊或停业的店铺">
              <QuestionCircleOutlined style={{ color: '#bfbfbf', fontSize: 12, marginLeft: 4 }} />
            </Tooltip>
            <div style={{ flex: 1 }} />
            <Button size="small" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="primary" size="small" onClick={onConfirm}>
              确认
            </Button>
          </div>
        </div>
      )}

      {/* 批量选择 Modal */}
      <BatchShopModal
        open={batchOpen}
        initial={value}
        onClose={() => setBatchOpen(false)}
        onConfirm={(ids) => {
          onChange(ids)
          setBatchOpen(false)
        }}
      />
    </div>
  )
}

// =================== 批量选择对话框 ===================
function BatchShopModal({
  open,
  initial,
  onClose,
  onConfirm,
}: {
  open: boolean
  initial: string[]
  onClose: () => void
  onConfirm: (ids: string[]) => void
}) {
  const [text, setText] = useState('')
  const [hits, setHits] = useState<{ matched: ShopItem[]; missed: string[] }>({
    matched: [],
    missed: [],
  })
  const [showClosed, setShowClosed] = useState(false)

  useEffect(() => {
    if (open) {
      // 把当前已选回填到文本框
      const isAll = initial.includes(SHOP_ALL_ID)
      const lines = isAll
        ? '全部店铺'
        : MOCK_SHOPS.filter((s) => initial.includes(s.id))
            .map((s) => s.name)
            .join('\n')
      setText(lines)
      setHits({ matched: [], missed: [] })
    }
  }, [open, initial])

  const parse = () => {
    const lines = text
      .split(/[\n,，;；]/)
      .map((s) => s.trim())
      .filter(Boolean)
    const matched: ShopItem[] = []
    const missed: string[] = []
    lines.forEach((l) => {
      if (l === '全部店铺') {
        matched.push(...MOCK_SHOPS.filter((s) => showClosed || !s.closed))
        return
      }
      const m = MOCK_SHOPS.find((s) => s.name === l || s.name.includes(l))
      if (m && (showClosed || !m.closed)) matched.push(m)
      else missed.push(l)
    })
    // 去重
    const uniq: ShopItem[] = []
    matched.forEach((m) => {
      if (!uniq.find((u) => u.id === m.id)) uniq.push(m)
    })
    setHits({ matched: uniq, missed })
  }

  return (
    <Modal
      title="批量选择店铺"
      open={open}
      onCancel={onClose}
      width={680}
      destroyOnClose
      okText="确认"
      cancelText="取消"
      onOk={() => {
        if (hits.matched.length === 0) {
          message.warning('请先解析，并确保有匹配到的店铺')
          return
        }
        onConfirm(hits.matched.map((s) => s.id))
      }}
    >
      <div className="muted-13 mb-8">
        每行一个店铺名称，或使用逗号、分号分隔；点击「解析」匹配后再确认。
      </div>
      <Input.TextArea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="例如：&#10;我的门店77&#10;果盘的一体化1017"
      />
      <div className="row gap-12 mt-12" style={{ alignItems: 'center' }}>
        <Checkbox checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)}>
          解析时包含打烊店铺
        </Checkbox>
        <Button type="primary" ghost onClick={parse} style={{ marginLeft: 'auto' }}>
          解析
        </Button>
      </div>

      <div className="row gap-8 mt-16" style={{ flexWrap: 'wrap' }}>
        <span className="text-strong" style={{ fontSize: 13 }}>
          匹配成功（{hits.matched.length}）：
        </span>
        {hits.matched.length === 0 ? (
          <span className="muted-12">暂未解析</span>
        ) : (
          hits.matched.map((m) => (
            <Tag key={m.id} color="blue">
              {m.name}
            </Tag>
          ))
        )}
      </div>

      {hits.missed.length > 0 && (
        <div className="row gap-8 mt-12" style={{ flexWrap: 'wrap' }}>
          <span className="text-strong" style={{ fontSize: 13, color: '#f53f3f' }}>
            未匹配（{hits.missed.length}）：
          </span>
          {hits.missed.map((m) => (
            <Tag key={m} color="red">
              {m}
            </Tag>
          ))}
        </div>
      )}
    </Modal>
  )
}

