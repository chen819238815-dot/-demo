import React from 'react'
import ReactECharts from 'echarts-for-react'

const revenueData = {
  revenue: 322_043,
  momPercent: 0.04,
  momDelta: 12_616,
  yoyPercent: -0.07,
  yoyDelta: -23_539,
}

const factorData = [
  { key: '营业额', value: 11_000, change: 0.2, remark: '主因贡献' },
  { key: '优惠金额', value: 3_000, change: 0.2, remark: '优惠同步上升' },
  { key: '营业收入', value: 322_043, change: 0.04, remark: '偏低于营业额增幅' },
]

const productPieOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: 0,
    textStyle: {
      color: '#4A4A40',
    },
  },
  series: [
    {
      name: '商品销售结构',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#FDFCF8',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 30, name: '草莓蛋糕', itemStyle: { color: '#C18C5D' } },
        { value: 20, name: '慕斯', itemStyle: { color: '#5D7052' } },
        { value: 50, name: '其他', itemStyle: { color: '#E6DCCD' } },
      ],
    },
  ],
}

const channelPieOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: 0,
    textStyle: {
      color: '#4A4A40',
    },
  },
  series: [
    {
      name: '渠道占比',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#FDFCF8',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 15, name: '美团外卖', itemStyle: { color: '#C18C5D' } },
        { value: 5, name: '小红书', itemStyle: { color: '#5D7052' } },
        { value: 80, name: '其他', itemStyle: { color: '#E6DCCD' } },
      ],
    },
  ],
}

const formatPercent = (v: number) => `${(v * 100).toFixed(0)}%`

export const RevenueReport20260308: React.FC = () => {
  return (
    <div className="report-root">
      <div className="report-texture" aria-hidden="true" />
      <div className="report-page">
        <header className="report-header">
          <div className="report-header-main">
            <p className="report-date">2026 · 03 · 08</p>
            <h1 className="report-title">2026年3月8日营业收入波动分析报告</h1>
            <p className="report-subtitle">节日与周末叠加下的营业收入结构化洞察</p>
          </div>
          <div className="report-header-metrics">
            <div className="metric-card metric-card-primary">
              <p className="metric-label">当日营业收入</p>
              <p className="metric-value">
                {revenueData.revenue.toLocaleString('zh-CN', { minimumFractionDigits: 0 })} 元
              </p>
              <p className="metric-caption">达到近期阶段性高位</p>
            </div>
            <div className="metric-card-group">
              <div className="metric-card metric-card-compact">
                <p className="metric-label">环比</p>
                <p className={`metric-change ${revenueData.momPercent >= 0 ? 'metric-up' : 'metric-down'}`}>
                  {formatPercent(revenueData.momPercent)}（
                  {revenueData.momDelta >= 0 ? '+' : ''}
                  {revenueData.momDelta.toLocaleString('zh-CN')}）
                </p>
                <p className="metric-caption">节日+周末带来短期抬升</p>
              </div>
              <div className="metric-card metric-card-compact">
                <p className="metric-label">同比</p>
                <p className={`metric-change ${revenueData.yoyPercent >= 0 ? 'metric-up' : 'metric-down'}`}>
                  {formatPercent(revenueData.yoyPercent)}（
                  {revenueData.yoyDelta >= 0 ? '+' : ''}
                  {revenueData.yoyDelta.toLocaleString('zh-CN')}）
                </p>
                <p className="metric-caption">较去年同期仍有下滑压力</p>
              </div>
            </div>
          </div>
        </header>

        <main className="report-content">
          <section className="report-section">
            <h2>1. 波动结论</h2>
            <div className="section-grid">
              <div className="card">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>指标名称</th>
                      <th>数据</th>
                      <th>环比</th>
                      <th>同比</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>营业收入</td>
                      <td>{revenueData.revenue.toLocaleString('zh-CN')}</td>
                      <td className="cell-change">
                        <span className="tag tag-up">{formatPercent(revenueData.momPercent)}</span>
                        <span className="cell-delta">
                          （+
                          {revenueData.momDelta.toLocaleString('zh-CN')}
                          ）
                        </span>
                      </td>
                      <td className="cell-change">
                        <span className="tag tag-down">{formatPercent(revenueData.yoyPercent)}</span>
                        <span className="cell-delta">
                          （
                          {revenueData.yoyDelta.toLocaleString('zh-CN')}
                          ）
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card card-explain">
                <h3>解读</h3>
                <p>
                  2026年3月8日营业收入为
                  <strong>322,043元</strong>
                  ，环比
                  <span className="text-up">上升4%</span>
                  ，但同比
                  <span className="text-down">下降7%</span>
                  。受三八妇女节与周末双重因素拉动，本日收入达到近段时间高位，整体波动呈
                  <strong>节日性周期上涨</strong>
                  ，暂未发现异常波动。
                </p>
              </div>
            </div>
          </section>

          <section className="report-section">
            <h2>2. 波动原因分析</h2>

            <div className="subsection">
              <h3>2.1 因子归因分析</h3>
              <div className="section-grid">
                <div className="card">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>项目</th>
                        <th>2026/3/8数据</th>
                        <th>环比增幅</th>
                        <th>备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factorData.map((row) => (
                        <tr key={row.key}>
                          <td>{row.key}</td>
                          <td>{row.value.toLocaleString('zh-CN')}</td>
                          <td className="cell-change">
                            <span className={row.change >= 0 ? 'tag tag-up' : 'tag tag-down'}>
                              {formatPercent(row.change)}
                            </span>
                          </td>
                          <td>{row.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card card-explain">
                  <h4>解读</h4>
                  <p>
                    营业额增长
                    <span className="text-up">20%</span>
                    是收入环比提升的
                    <strong>主要驱动力</strong>
                    ，但优惠金额也同步
                    <span className="text-up">增长20%</span>
                    ，稀释了收入增幅，使得营业收入实际仅上升
                    <strong>4%</strong>
                    ，未与营业额增幅完全同步。
                  </p>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h3>2.2 商品维度分析</h3>
              <div className="section-grid section-grid-2col">
                <div className="card">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>商品</th>
                        <th>销售额（元）</th>
                        <th>占比</th>
                        <th>环比增幅</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>草莓蛋糕</td>
                        <td>8,000</td>
                        <td>30%</td>
                        <td className="cell-change">
                          <span className="tag tag-down">-40%</span>
                        </td>
                      </tr>
                      <tr>
                        <td>慕斯</td>
                        <td>4,000</td>
                        <td>20%</td>
                        <td className="cell-change">
                          <span className="tag tag-down">-10%</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="card card-chart">
                  <div className="card-blob" aria-hidden="true" />
                  <h4>商品销售结构</h4>
                  <ReactECharts option={productPieOption} style={{ height: 260, width: '100%' }} />
                </div>
              </div>
              <div className="card card-explain">
                <h4>解读</h4>
                <p>
                  主力商品
                  <strong>草莓蛋糕</strong>
                  销售环比
                  <span className="text-down">下降40%</span>
                  ，
                  <strong>慕斯</strong>
                  环比下降
                  <span className="text-down">10%</span>
                  ，但在其他商品拉动与整体营业额提升的带动下，并未显著拖累当日总收入，呈现为
                  <strong>结构性增长</strong>
                  ：收入高位更多由长尾与节日特色品类贡献。
                </p>
              </div>
            </div>

            <div className="subsection">
              <h3>2.3 销售渠道维度分析</h3>
              <div className="section-grid section-grid-2col">
                <div className="card">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>渠道</th>
                        <th>营业收入（元）</th>
                        <th>占比</th>
                        <th>环比增幅</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>美团外卖</td>
                        <td>300</td>
                        <td>15%</td>
                        <td className="cell-change">
                          <span className="tag tag-down">-30%</span>
                        </td>
                      </tr>
                      <tr>
                        <td>小红书</td>
                        <td>1,000</td>
                        <td>5%</td>
                        <td className="cell-change">
                          <span className="tag tag-down">-20%</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="card card-chart">
                  <div className="card-blob card-blob-secondary" aria-hidden="true" />
                  <h4>渠道占比</h4>
                  <ReactECharts option={channelPieOption} style={{ height: 260, width: '100%' }} />
                </div>
              </div>
              <div className="card card-explain">
                <h4>解读</h4>
                <p>
                  美团外卖和小红书渠道营业收入环比均
                  <span className="text-down">大幅下降</span>
                  （分别为
                  <strong>30%</strong>
                  和
                  <strong>20%</strong>
                  ），渠道结构有所收缩，说明当日收入高位更多来源于其他渠道的自然客流与转化，渠道间波动在一定程度上对总盘子起到
                  <strong>分散与对冲</strong>
                  作用。
                </p>
              </div>
            </div>
          </section>

          <section className="report-section">
            <h2>3. 经营建议与解决方案</h2>
            <div className="suggestion-grid">
              <article className="card suggestion-card">
                <h3>3.1 优惠比例精细控制</h3>
                <p>
                  在营业额明显提升的同时，优惠金额保持同幅度增长，会持续稀释净营业收入。建议建立
                  <strong>“毛利护栏”</strong>
                  ：对单品与整体门店设定优惠上限与毛利阈值，动态监控优惠投放回报，优先保留
                  <strong>高复购与高客单</strong>
                  人群的权益，收缩拉新效果弱、成本偏高的券种。
                </p>
              </article>
              <article className="card suggestion-card">
                <h3>3.2 爆款商品结构优化</h3>
                <p>
                  草莓蛋糕等主力品种环比大幅下滑，需要结合节日偏好与历史销量，梳理
                  <strong>“节日专属爆款池”</strong>
                  ：提前规划货架陈列、试吃与主推位资源，避免主力品种在节日错失曝光；同时根据库存节奏与产能约束，灵活调整搭配销售与加价换购方案，拉升主品项销售额。
                </p>
              </article>
              <article className="card suggestion-card">
                <h3>3.3 多元渠道协同拉动</h3>
                <p>
                  外卖与小红书渠道占比下降，建议从
                  <strong>流量入口—内容种草—下单转化</strong>
                  全链路排查：优化节日主题海报、套餐设计与评价引导，在节前一到两天提前预热；同时通过门店二维码、线下小卡片等方式，引导堂食/到店用户沉淀到线上渠道，平滑渠道间波动。
                </p>
              </article>
            </div>
          </section>

          <section className="report-section">
            <h2>4. 总结</h2>
            <div className="card summary-card">
              <p>
                2026年3月8日营业收入在节日与周末窗口双重利好的驱动下，达到阶段性高位，整体表现为
                <strong>平稳的周期性上涨</strong>
                。核心驱动力来自营业额抬升，但部分爆款商品和线上渠道环比下滑、优惠金额同步上升，对收入增速形成一定
                <strong>稀释效应</strong>
                。后续经营需围绕
                <strong>主力商品销售力</strong>
                与
                <strong>渠道多样化</strong>
                两个抓手，配合更精细的优惠策略，持续提升收入质量与增长的可持续性。
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

