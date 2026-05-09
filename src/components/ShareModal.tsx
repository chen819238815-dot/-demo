import { useEffect, useState } from 'react'
import {
  Modal,
  Tabs,
  Input,
  Button,
  message,
  Switch,
  Tag,
  QRCode,
  Checkbox,
} from 'antd'
import {
  ShareAltOutlined,
  LinkOutlined,
  MailOutlined,
  WechatOutlined,
} from '@ant-design/icons'
import { Dashboard } from '../store/dashboard'

/** 老板专线使用说明（请替换为实际的帮助中心 / 运营文档链接） */
const BOSS_HOTLINE_HELP_URL = 'https://www.youzan.com'

export default function ShareModal({
  dashboard,
  open,
  onClose,
}: {
  dashboard: Dashboard | null
  open: boolean
  onClose: () => void
}) {
  const [allowComment, setAllowComment] = useState(true)
  const [requireLogin, setRequireLogin] = useState(true)
  const [bossHotlineSubscribe, setBossHotlineSubscribe] = useState(false)
  const [bossQrImgError, setBossQrImgError] = useState(false)

  useEffect(() => {
    if (open) setBossQrImgError(false)
  }, [open, dashboard?.id])

  if (!dashboard) return null

  const link = `https://analytics.example.com/d/${dashboard.id}`
  /** 企业微信「老板专线」侧用于识别仪表盘、完成订阅绑定的深链（演示） */
  const bossSubscribeDeepLink = `weixin://wechat?qr=boss-hotline&dash=${encodeURIComponent(
    dashboard.id,
  )}&name=${encodeURIComponent(dashboard.name)}`

  const copy = (txt: string) => {
    navigator.clipboard?.writeText(txt)
    message.success('已复制')
  }

  const copySubscribeGuide = () => {
    const text = `请使用微信添加有赞「老板专线」企业微信账号为好友，便于订阅「${dashboard.name}」仪表盘报告。`
    copy(text)
  }

  return (
    <Modal
      title={
        <span>
          <ShareAltOutlined style={{ color: '#4f7cff', marginRight: 6 }} />
          分享 · {dashboard.name}
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      destroyOnClose
    >
      <Tabs
        defaultActiveKey="link"
        items={[
          {
            key: 'link',
            label: (
              <>
                <LinkOutlined /> 链接分享
              </>
            ),
            children: (
              <div>
                <Input
                  value={link}
                  readOnly
                  addonAfter={
                    <Button type="link" size="small" onClick={() => copy(link)}>
                      复制
                    </Button>
                  }
                />
                <div
                  className="row gap-8 mt-12"
                  style={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ fontSize: 13, color: '#4e5969' }}>仅团队登录后查看</span>
                  <Switch checked={requireLogin} onChange={setRequireLogin} />
                </div>
                <div
                  className="row gap-8 mt-8"
                  style={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ fontSize: 13, color: '#4e5969' }}>允许接收人评论</span>
                  <Switch checked={allowComment} onChange={setAllowComment} />
                </div>
              </div>
            ),
          },
          {
            key: 'qr',
            label: '二维码',
            children: (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <QRCode value={link} size={180} />
                <div style={{ marginTop: 8, color: '#86909c', fontSize: 12 }}>
                  扫描二维码在移动端查看
                </div>
              </div>
            ),
          },
          {
            key: 'boss',
            label: (
              <>
                <WechatOutlined /> 老板专线
              </>
            ),
            children: (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <Checkbox
                    checked={bossHotlineSubscribe}
                    onChange={(e) => setBossHotlineSubscribe(e.target.checked)}
                  >
                    <span style={{ fontSize: 13, color: '#1f2329', fontWeight: 500 }}>
                      个人微信（老板专线）
                    </span>
                  </Checkbox>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: '#86909c',
                    lineHeight: 1.7,
                    margin: '0 0 12px',
                    paddingLeft: 24,
                  }}
                >
                  通知对方微信添加有赞「老板专线」企业微信为好友，即可订阅本仪表盘「
                  {dashboard.name}」；对方在好友会话中确认后，将按推送策略收到报告摘要。
                  <a
                    href={BOSS_HOTLINE_HELP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: 4 }}
                  >
                    查看使用介绍
                  </a>
                </p>

                {bossHotlineSubscribe && (
                  <>
                    <div
                      style={{
                        border: '1px solid #eef0f3',
                        borderRadius: 10,
                        padding: '20px 16px 16px',
                        background: '#fff',
                        textAlign: 'center',
                        marginBottom: 12,
                      }}
                    >
                      {!bossQrImgError ? (
                        <img
                          src="/boss-hotline-qr.png"
                          alt="有赞「老板专线」账号二维码"
                          style={{
                            display: 'block',
                            margin: '0 auto',
                            maxWidth: 200,
                            height: 'auto',
                          }}
                          onError={() => setBossQrImgError(true)}
                        />
                      ) : (
                        <div style={{ display: 'inline-block', padding: 8 }}>
                          <QRCode
                            value={bossSubscribeDeepLink}
                            size={200}
                            errorLevel="H"
                          />
                          <div style={{ marginTop: 8, fontSize: 12, color: '#86909c' }}>
                            未找到静态二维码资源时，使用动态订阅码（演示）
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          marginTop: 12,
                          fontSize: 12,
                          color: '#86909c',
                          lineHeight: 1.5,
                        }}
                      >
                        有赞「老板专线」账号二维码
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '10px 12px',
                        background: '#f0f5ff',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#4e5969',
                        lineHeight: 1.6,
                        marginBottom: 10,
                      }}
                    >
                      将二维码或下方文案发给需要订阅的对象。对方添加「老板专线」后，系统将把你当前仪表盘加入其可订阅列表（实际以有赞企业微信配置为准）。
                    </div>
                    <div className="row gap-8" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                      <Button size="small" onClick={copySubscribeGuide}>
                        复制订阅引导文案
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        style={{ paddingLeft: 0 }}
                        onClick={() => copy(bossSubscribeDeepLink)}
                      >
                        复制订阅深链（演示）
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            key: 'mail',
            label: (
              <>
                <MailOutlined /> 邮件订阅
              </>
            ),
            children: (
              <div>
                <Input.TextArea
                  rows={3}
                  placeholder="输入邮箱地址，多个邮箱用逗号分隔"
                />
                <div className="row gap-8 mt-12" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, color: '#4e5969' }}>定时推送：</span>
                  <Tag.CheckableTag checked>每日 09:00</Tag.CheckableTag>
                  <Tag.CheckableTag checked={false}>每周一 09:00</Tag.CheckableTag>
                  <Tag.CheckableTag checked={false}>每月 1 日</Tag.CheckableTag>
                </div>
                <div className="row gap-8 mt-12" style={{ justifyContent: 'flex-end' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      message.success('已发送订阅邀请')
                      onClose()
                    }}
                  >
                    发送
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  )
}
