import React, { useState } from 'react';
import { StoreSelector } from '../components/StoreSelector';
import { TimeSelector } from '../components/TimeSelector';
import { MetricCard } from '../components/MetricCard';
import { SecondaryMetricCard } from '../components/SecondaryMetricCard';
import { TrendChart } from '../components/TrendChart';
import { AIInsightPanel } from '../components/AIInsightPanel';
import { MetricWithTrend } from '../components/MetricWithTrend';
import { SecondaryMetricsWithTrend } from '../components/SecondaryMetricsWithTrend';
import '../styles/components.css';

// 模拟店铺数据
const mockStores = [
  { id: '1', name: '北京朝阳门店', code: 'BJ001', type: 'store' as const, channel: 'offline' as const, isOpen: true },
  { id: '2', name: '上海南京路店', code: 'SH001', type: 'store' as const, channel: 'offline' as const, isOpen: true },
  { id: '3', name: '广州天河店', code: 'GZ001', type: 'store' as const, channel: 'offline' as const, isOpen: false },
  { id: '4', name: '深圳福田店', code: 'SZ001', type: 'store' as const, channel: 'offline' as const, isOpen: true },
  { id: '5', name: '天猫旗舰店', code: 'TM001', type: 'online' as const, channel: 'online' as const, isOpen: true },
  { id: '6', name: '京东自营店', code: 'JD001', type: 'online' as const, channel: 'online' as const, isOpen: true },
];

// 模拟趋势数据
const mockTrendData = [
  { date: '2024-01-26', value: 850 },
  { date: '2024-01-27', value: 620 },
  { date: '2024-01-28', value: 480 },
  { date: '2024-01-29', value: 520 },
  { date: '2024-01-30', value: 680 },
  { date: '2024-01-31', value: 920 },
  { date: '2024-02-01', value: 1150 },
  { date: '2024-02-02', value: 980 },
  { date: '2024-02-03', value: 720 },
  { date: '2024-02-04', value: 580 },
  { date: '2024-02-05', value: 650 },
  { date: '2024-02-06', value: 890 },
  { date: '2024-02-07', value: 1100 },
  { date: '2024-02-08', value: 1580 },
  { date: '2024-02-09', value: 420 },
  { date: '2024-02-10', value: 380 },
  { date: '2024-02-11', value: 520 },
  { date: '2024-02-12', value: 680 },
  { date: '2024-02-13', value: 750 },
  { date: '2024-02-14', value: 920 },
  { date: '2024-02-15', value: 880 },
  { date: '2024-02-16', value: 720 },
  { date: '2024-02-17', value: 650 },
  { date: '2024-02-18', value: 580 },
  { date: '2024-02-19', value: 620 },
  { date: '2024-02-20', value: 780 },
  { date: '2024-02-21', value: 950 },
  { date: '2024-02-22', value: 1120 },
  { date: '2024-02-23', value: 1280 },
  { date: '2024-02-24', value: 1450 },
];

const DashboardExample: React.FC = () => {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [timeConfig, setTimeConfig] = useState({
    type: 'day' as const,
    startDate: '2024-02-01',
    endDate: '2024-02-24',
  });
  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <div className="biz-analysis-container">
      {/* 侧边栏 */}
      <aside className="biz-analysis-sidebar">
        <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>经营分析平台</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>有赞数据中心</div>
        </div>
        <nav style={{ padding: 16 }}>
          {['营业总览', '商品分析', '客户分析', '店铺排行'].map((item, idx) => (
            <div
              key={item}
              style={{
                padding: '12px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                marginBottom: 4,
                background: idx === 0 ? '#155BD4' : 'transparent',
              }}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="biz-analysis-main">
        {/* 页面标题 */}
        <div className="page-title-section">
          <h1 className="page-title">营业总览</h1>
          <p className="page-subtitle">查看全渠道营业数据及趋势分析</p>
        </div>

        {/* 工具栏 */}
        <div className="page-toolbar">
          <div className="page-toolbar-left">
            {/* 统计时间选择 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#666' }}>统计时间：</span>
              <TimeSelector value={timeConfig} onChange={setTimeConfig} />
            </div>

            {/* 店铺选择 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#666' }}>选择店铺：</span>
              <StoreSelector
                stores={mockStores}
                selectedStores={selectedStores}
                onChange={setSelectedStores}
              />
            </div>
          </div>

          <div className="page-toolbar-right">
            <button className="toolbar-btn">重置</button>
            <button className="toolbar-btn primary">高级导出</button>
            <button className="toolbar-btn primary">布局设置</button>
          </div>
        </div>

        {/* 对比日期展示 */}
        <div className="compare-date-display">
          <span className="compare-label">对比日期：</span>
          <span>2026-01-03 至 2026-01-31</span>
          <span className="date-separator">|</span>
          <span className="compare-label">环比日期：</span>
          <span>2025-02-01 至 2025-03-01</span>
        </div>

        {/* 标签页 */}
        <div className="tab-nav">
          {[
            { key: 'revenue', label: '营业' },
            { key: 'collection', label: '收款' },
            { key: 'product', label: '商品' },
            { key: 'customer', label: '客户' },
            { key: 'ranking', label: '店铺排行' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI 智能解读 */}
        <AIInsightPanel
          summary="2026年3月8日营业收入是322,043元，比2026年3月7日增长4%，增幅为12,616元；比2026年3月2日下降7%，同比减少23,539元。"
          insights={[
            {
              type: 'fluctuation',
              label: '波动类型',
              content: '周期性波动、平稳波动',
            },
            {
              type: 'anomaly',
              label: '波动说明',
              content: '2026年3月8日为三八妇女节+周末，营业收入环比略涨，同比略降，金额表现处于近期高位，并未出现异常波动，属于节日和周末共同驱动的周期性上涨，同时在节日连续两年之间保持一定稳定性，体现了平稳波动特征。',
            },
          ]}
          onViewDetail={() => console.log('查看详情')}
        />

        {/* 带公式的一级指标卡 */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 16,
              padding: '16px 0',
              borderBottom: '1px solid #E0E0E0',
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>营业总览</h2>
            <span style={{ color: '#999', fontSize: 14 }}>?</span>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <MetricCard
              title="营业收入(元)"
              value="15,426.63"
              yoyChange={10}
              momChange={20}
              isActive
            />
            <span style={{ fontSize: 24, color: '#999' }}>=</span>
            <MetricCard
              title="营业额(元)"
              value="15,426.63"
              yoyChange={10}
              momChange={20}
            />
            <span style={{ fontSize: 24, color: '#999' }}>-</span>
            <MetricCard
              title="优惠金额"
              value="15,426.63"
              yoyChange={10}
              momChange={20}
            />
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: '#F7F8FA',
              borderRadius: 4,
              fontSize: 13,
              color: '#666',
            }}
          >
            营业收入(元) = 支付订单数 * 笔单价
          </div>
        </div>

        {/* 二级指标卡 */}
        <div style={{ marginBottom: 24 }}>
          <SecondaryMetricCard
            metrics={[
              { id: '1', title: '营业收入', value: '15,426.63', yoyChange: 10, momChange: 20 },
              { id: '2', title: '支付订单数', value: '15,000', yoyChange: 10, momChange: 20 },
              { id: '3', title: '均单价', value: '111', yoyChange: 10, momChange: 20 },
              { id: '4', title: '支付人数', value: '15,000', yoyChange: 10, momChange: 20 },
              { id: '5', title: '客单价', value: '111', yoyChange: 12, momChange: 20 },
            ]}
            parentMetric="营业收入"
          />
        </div>

        {/* 趋势图 */}
        <TrendChart
          title="营业收入趋势"
          data={mockTrendData}
          showAverage
          showCompare
          granularity="day"
        />

        {/* 使用组合组件的示例 */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>组件使用示例</h3>

          {/* 示例1: 单级指标卡+趋势图 */}
          <div style={{ marginBottom: 24 }}>
            <MetricWithTrend
              metric={{
                title: '营业收入(元)',
                value: '15,426.63',
                yoyChange: 10,
                momChange: 20,
              }}
              formula={{
                leftMetric: {
                  title: '营业额(元)',
                  value: '15,426.63',
                  yoyChange: 10,
                  momChange: 20,
                },
                rightMetric: {
                  title: '优惠金额',
                  value: '15,426.63',
                  yoyChange: 10,
                  momChange: 20,
                },
                operator: '-',
              }}
              trendData={mockTrendData}
              showCompare
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardExample;
