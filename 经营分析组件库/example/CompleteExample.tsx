import React, { useState, useCallback } from 'react';
import { BIDashboardProvider, useBIDashboard } from '../components/BIDashboardContext';
import { GlobalFilterBar } from '../components/GlobalFilterBar';
import { MetricWithTrend } from '../components/MetricWithTrend';
import { DataTable } from '../components/DataTable';
import { AIInsightPanel } from '../components/AIInsightPanel';
import '../styles/components.css';

// 示例店铺数据
const mockStores = [
  { id: '1', name: '北京朝阳店', code: 'BJ001', type: 'store' as const, channel: 'offline' as const, isOpen: true },
  { id: '2', name: '上海浦东店', code: 'SH001', type: 'store' as const, channel: 'offline' as const, isOpen: true },
  { id: '3', name: '广州天河店', code: 'GZ001', type: 'store' as const, channel: 'offline' as const, isOpen: true },
  { id: '4', name: '深圳南山店', code: 'SZ001', type: 'store' as const, channel: 'offline' as const, isOpen: false },
  { id: '5', name: '天猫旗舰店', code: 'TM001', type: 'online' as const, channel: 'online' as const, isOpen: true },
  { id: '6', name: '京东自营店', code: 'JD001', type: 'online' as const, channel: 'online' as const, isOpen: true },
];

// 一级指标 + 二级指标数据结构
const metricsData = [
  {
    id: 'revenue',
    title: '营业收入',
    value: '154,266.63',
    unit: '元',
    yoyChange: 10,
    momChange: 20,
    secondaryMetrics: [
      {
        id: 'turnover',
        title: '营业额',
        value: '169,693.29',
        unit: '元',
        yoyChange: 12,
        momChange: 18,
        trendData: [
          { date: '04-01', value: 13000 },
          { date: '04-02', value: 16500 },
          { date: '04-03', value: 14200 },
          { date: '04-04', value: 19800 },
          { date: '04-05', value: 24200 },
          { date: '04-06', value: 27500 },
          { date: '04-07', value: 34493 },
        ],
      },
      {
        id: 'discount',
        title: '优惠金额',
        value: '15,426.66',
        unit: '元',
        yoyChange: 25,
        momChange: 8,
        trendData: [
          { date: '04-01', value: 1000 },
          { date: '04-02', value: 1500 },
          { date: '04-03', value: 1200 },
          { date: '04-04', value: 1800 },
          { date: '04-05', value: 2200 },
          { date: '04-06', value: 2500 },
          { date: '04-07', value: 3226 },
        ],
      },
      {
        id: 'refund',
        title: '退款金额',
        value: '8,200.00',
        unit: '元',
        yoyChange: -5,
        momChange: 12,
        trendData: [
          { date: '04-01', value: 800 },
          { date: '04-02', value: 1200 },
          { date: '04-03', value: 900 },
          { date: '04-04', value: 1500 },
          { date: '04-05', value: 1800 },
          { date: '04-06', value: 1100 },
          { date: '04-07', value: 900 },
        ],
      },
    ],
  },
  {
    id: 'orders',
    title: '订单数',
    value: '1,234',
    unit: '单',
    yoyChange: 15,
    momChange: -5,
    secondaryMetrics: [
      {
        id: 'paid_orders',
        title: '支付订单数',
        value: '1,180',
        unit: '单',
        yoyChange: 18,
        momChange: -3,
        trendData: [
          { date: '04-01', value: 150 },
          { date: '04-02', value: 180 },
          { date: '04-03', value: 160 },
          { date: '04-04', value: 200 },
          { date: '04-05', value: 220 },
          { date: '04-06', value: 160 },
          { date: '04-07', value: 110 },
        ],
      },
      {
        id: 'cancelled_orders',
        title: '取消订单数',
        value: '54',
        unit: '单',
        yoyChange: -20,
        momChange: -15,
        trendData: [
          { date: '04-01', value: 8 },
          { date: '04-02', value: 10 },
          { date: '04-03', value: 6 },
          { date: '04-04', value: 12 },
          { date: '04-05', value: 9 },
          { date: '04-06', value: 5 },
          { date: '04-07', value: 4 },
        ],
      },
    ],
  },
  {
    id: 'customers',
    title: '成交客户数',
    value: '892',
    unit: '人',
    yoyChange: 8,
    momChange: 12,
    secondaryMetrics: [
      {
        id: 'new_customers',
        title: '新客户数',
        value: '356',
        unit: '人',
        yoyChange: 25,
        momChange: 30,
        trendData: [
          { date: '04-01', value: 45 },
          { date: '04-02', value: 52 },
          { date: '04-03', value: 48 },
          { date: '04-04', value: 58 },
          { date: '04-05', value: 62 },
          { date: '04-06', value: 50 },
          { date: '04-07', value: 41 },
        ],
      },
      {
        id: 'old_customers',
        title: '老客户数',
        value: '536',
        unit: '人',
        yoyChange: -2,
        momChange: 5,
        trendData: [
          { date: '04-01', value: 65 },
          { date: '04-02', value: 78 },
          { date: '04-03', value: 67 },
          { date: '04-04', value: 87 },
          { date: '04-05', value: 98 },
          { date: '04-06', value: 68 },
          { date: '04-07', value: 73 },
        ],
      },
    ],
  },
];

// 表格数据
const tableData = [
  {
    id: '1',
    dimension: '门店渠道',
    value: 123456,
    percentage: 40,
    yoyChange: 80.8,
    momChange: -12.2,
    children: [
      { id: '1-1', dimension: '北京朝阳店', value: 45000, percentage: 15, yoyChange: 75.5, momChange: -8.5 },
      { id: '1-2', dimension: '上海浦东店', value: 42000, percentage: 14, yoyChange: 82.3, momChange: -15.2 },
      { id: '1-3', dimension: '广州天河店', value: 36456, percentage: 11, yoyChange: 85.0, momChange: -10.8 },
    ],
  },
  {
    id: '2',
    dimension: '网店渠道',
    value: 123000,
    percentage: 35,
    yoyChange: 65.5,
    momChange: 8.5,
    children: [
      { id: '2-1', dimension: '天猫旗舰店', value: 68000, percentage: 20, yoyChange: 70.2, momChange: 12.5 },
      { id: '2-2', dimension: '京东自营店', value: 55000, percentage: 15, yoyChange: 60.8, momChange: 5.2 },
    ],
  },
  {
    id: '3',
    dimension: '外卖渠道',
    value: 30810,
    percentage: 10,
    yoyChange: 120.5,
    momChange: 25.8,
    children: [
      { id: '3-1', dimension: '美团外卖', value: 20000, percentage: 7, yoyChange: 125.0, momChange: 30.5 },
      { id: '3-2', dimension: '饿了么', value: 10810, percentage: 3, yoyChange: 112.5, momChange: 18.2 },
    ],
  },
];

// AI 解读数据
const aiInsights = [
  {
    type: 'info' as const,
    title: '营业收入增长显著',
    content: '本月营业收入同比增长 10%，主要得益于门店渠道的稳步增长和网店渠道的快速扩张。建议继续关注网店渠道的运营策略。',
  },
  {
    type: 'warning' as const,
    title: '环比增速放缓',
    content: '环比增速从上月的 35% 降至本月的 20%，增速有所放缓。建议分析具体原因，可能需要调整营销策略。',
  },
  {
    type: 'success' as const,
    title: '外卖渠道表现亮眼',
    content: '外卖渠道同比增长 120.5%，成为增长最快的渠道。建议加大外卖渠道的资源投入，优化配送体验。',
  },
];

// 页面内容组件
const DashboardContent: React.FC = () => {
  const { selectedStores, timeRange, refreshData } = useBIDashboard();
  const [activeTab, setActiveTab] = useState('overview');

  // 指标选择状态
  const [selectedMetricId, setSelectedMetricId] = useState<string>('revenue');
  const [selectedSecondaryId, setSelectedSecondaryId] = useState<string>('');

  // 趋势图状态
  const [trendMode, setTrendMode] = useState<'day' | 'week' | 'month' | 'period'>('day');
  const [showCompare, setShowCompare] = useState(false);

  // 处理数据刷新
  const handleRefresh = useCallback(() => {
    console.log('刷新数据:', {
      stores: selectedStores,
      timeRange,
      metric: selectedMetricId,
      secondary: selectedSecondaryId,
    });
    refreshData();
  }, [selectedStores, timeRange, selectedMetricId, selectedSecondaryId, refreshData]);

  // 处理一级指标点击
  const handleMetricClick = useCallback((metricId: string) => {
    setSelectedMetricId(metricId);
    // 清除二级指标选择
    setSelectedSecondaryId('');
  }, []);

  // 处理二级指标点击
  const handleSecondaryClick = useCallback((secondaryId: string) => {
    setSelectedSecondaryId(secondaryId);
  }, []);

  return (
    <div className="biz-analysis-container">
      {/* 页面标题 */}
      <div className="page-header">
        <h1 className="page-title">经营分析看板</h1>
        <p className="page-subtitle">实时监控店铺经营数据，智能分析业务趋势</p>
      </div>

      {/* 全局筛选控制栏 */}
      <GlobalFilterBar
        stores={mockStores}
        onRefresh={handleRefresh}
      />

      {/* 标签页切换 */}
      <div className="tab-nav">
        <div
          className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          数据概览
        </div>
        <div
          className={`tab-item ${activeTab === 'trend' ? 'active' : ''}`}
          onClick={() => setActiveTab('trend')}
        >
          趋势分析
        </div>
        <div
          className={`tab-item ${activeTab === 'channel' ? 'active' : ''}`}
          onClick={() => setActiveTab('channel')}
        >
          渠道分析
        </div>
      </div>

      {/* 内容区域 */}
      {activeTab === 'overview' && (
        <div className="dashboard-content">
          {/* 核心指标 + 趋势图 */}
          <section className="dashboard-section">
            <MetricWithTrend
              metrics={metricsData}
              selectedMetricId={selectedMetricId}
              selectedSecondaryId={selectedSecondaryId}
              trendMode={trendMode}
              showCompare={showCompare}
              onMetricClick={handleMetricClick}
              onSecondaryClick={handleSecondaryClick}
              onTrendModeChange={setTrendMode}
              onCompareToggle={setShowCompare}
            />
          </section>

          {/* 数据表格 */}
          <section className="dashboard-section">
            <h3 className="section-title">渠道明细</h3>
            <DataTable
              title="营业收入渠道分析"
              rows={tableData}
              valueLabel="营业收入(元)"
              showPercentage={true}
              showYoy={true}
              showMom={true}
              expandable={true}
            />
          </section>

          {/* AI 智能解读 */}
          <section className="dashboard-section">
            <h3 className="section-title">智能解读</h3>
            <AIInsightPanel insights={aiInsights} />
          </section>
        </div>
      )}

      {activeTab === 'trend' && (
        <div className="dashboard-content">
          <section className="dashboard-section">
            <h3 className="section-title">趋势分析</h3>
            <div className="placeholder-content">
              趋势分析页面 - 展示更多历史数据和预测趋势
            </div>
          </section>
        </div>
      )}

      {activeTab === 'channel' && (
        <div className="dashboard-content">
          <section className="dashboard-section">
            <h3 className="section-title">渠道分析</h3>
            <div className="placeholder-content">
              渠道分析页面 - 展示各渠道的详细对比数据
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

// 完整示例页面
const CompleteExample: React.FC = () => {
  return (
    <BIDashboardProvider>
      <DashboardContent />
    </BIDashboardProvider>
  );
};

export default CompleteExample;
