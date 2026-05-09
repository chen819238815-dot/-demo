import React, { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import '../styles/zan-components.css';

/**
 * Zan Design 规范版经营分析示例
 * 严格遵循有赞 Zan Design 设计规范
 */
const ZanDesignExample: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState('revenue');

  // 一级指标数据
  const primaryMetrics = [
    {
      id: 'revenue',
      title: '营业收入(元)',
      value: '154,266.63',
      yoyChange: 10,
      momChange: 20,
    },
    {
      id: 'orders',
      title: '订单数(单)',
      value: '1,234',
      yoyChange: 15,
      momChange: -5,
    },
    {
      id: 'customers',
      title: '成交客户数(人)',
      value: '892',
      yoyChange: 8,
      momChange: 12,
    },
  ];

  return (
    <div className="zan-biz-analysis-container">
      {/* 页面标题 */}
      <div className="zan-page-header">
        <h1 className="zan-page-title">经营分析看板</h1>
        <p className="zan-page-subtitle">实时监控店铺经营数据，智能分析业务趋势</p>
      </div>

      {/* 全局筛选控制栏 */}
      <div className="zan-filter-bar">
        <div className="zan-filter-bar-content">
          <div className="zan-filter-item">
            <span className="zan-filter-label">店铺：</span>
            <div className="zan-store-selector">
              <div className="zan-store-selector-trigger">
                <span className="zan-store-tag">全部店铺</span>
              </div>
            </div>
          </div>

          <div className="zan-filter-item">
            <span className="zan-filter-label">时间：</span>
            <div className="zan-time-selector">
              <div className="zan-time-selector-trigger">
                <span>日</span>
                <span>▼</span>
              </div>
              <div className="zan-time-selector-display">
                <span>2026-04-07</span>
              </div>
              <div className="zan-time-selector-shortcuts">
                <button className="zan-shortcut-btn">今天</button>
                <button className="zan-shortcut-btn">昨天</button>
                <button className="zan-shortcut-btn">前天</button>
              </div>
            </div>
          </div>

          <div className="zan-filter-actions">
            <button className="zan-btn zan-btn-primary">
              <span>🔄</span> 刷新数据
            </button>
          </div>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="zan-tab-nav">
        <button className="zan-tab-item active">数据概览</button>
        <button className="zan-tab-item">趋势分析</button>
        <button className="zan-tab-item">渠道分析</button>
      </div>

      {/* 核心指标卡 */}
      <div className="zan-card">
        <div className="zan-card-title">
          核心指标
          <span className="zan-card-hint">（点击指标查看详情）</span>
        </div>
        <div className="zan-secondary-metrics-grid">
          {primaryMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              yoyChange={metric.yoyChange}
              momChange={metric.momChange}
              isActive={activeMetric === metric.id}
              onClick={() => setActiveMetric(metric.id)}
            />
          ))}
        </div>
      </div>

      {/* 数据表格 */}
      <div className="zan-data-table-container">
        <div className="zan-data-table-title">营业收入渠道分析</div>
        <div className="zan-data-table-wrapper">
          <table className="zan-data-table">
            <thead>
              <tr>
                <th className="dimension-header">销售渠道</th>
                <th className="value-header">营业收入(元)</th>
                <th className="trend-header">环比</th>
                <th className="trend-header">同比</th>
              </tr>
            </thead>
            <tbody>
              <tr className="data-table-row has-children">
                <td className="dimension-cell">
                  <div className="dimension-content">
                    <span className="expand-icon">▼</span>
                    <span>门店渠道</span>
                  </div>
                </td>
                <td className="value-cell">
                  <div className="value-content">
                    <span className="value-number">123,456</span>
                    <div className="percentage-bar-container">
                      <div className="percentage-bar">
                        <div className="percentage-fill" style={{ width: '40%' }}></div>
                      </div>
                      <span className="percentage-text">40%</span>
                    </div>
                  </div>
                </td>
                <td className="trend-cell">
                  <span className="table-trend down">-12.2%</span>
                </td>
                <td className="trend-cell">
                  <span className="table-trend up">+80.8%</span>
                </td>
              </tr>
              <tr className="total-row">
                <td className="dimension-cell">合计</td>
                <td className="value-cell">
                  <span className="value-number">123,456,700</span>
                </td>
                <td className="trend-cell">
                  <span className="table-trend down">-12.2%</span>
                </td>
                <td className="trend-cell">
                  <span className="table-trend up">+80.8%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI 智能解读 */}
      <div className="zan-ai-insight-panel">
        <div className="zan-ai-insight-header">
          <span className="zan-ai-insight-icon">💡</span>
          <span className="zan-ai-insight-title">智能解读</span>
        </div>
        <div className="zan-ai-insight-list">
          <div className="zan-ai-insight-item">
            <div className="zan-ai-insight-item-header">
              <span className="zan-ai-insight-type-icon info">ℹ</span>
              <span className="zan-ai-insight-item-title">营业收入增长显著</span>
            </div>
            <div className="zan-ai-insight-item-content">
              本月营业收入同比增长 10%，主要得益于门店渠道的稳步增长和网店渠道的快速扩张。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZanDesignExample;
