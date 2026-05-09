import React, { useState, useMemo } from 'react';
import { MetricCard } from './MetricCard';
import { SecondaryMetricCard } from './SecondaryMetricCard';
import { TrendChart } from './TrendChart';

export interface TrendDataPoint {
  date: string;
  value: number;
  compareValue?: number;
}

export interface SecondaryMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  yoyChange?: number;
  momChange?: number;
  trendData?: TrendDataPoint[];
}

export interface PrimaryMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  yoyChange?: number;
  momChange?: number;
  secondaryMetrics: SecondaryMetric[];
}

interface MetricWithTrendProps {
  // 一级指标列表
  metrics: PrimaryMetric[];
  // 当前选中的一级指标ID
  selectedMetricId?: string;
  // 当前选中的二级指标ID
  selectedSecondaryId?: string;
  // 趋势图模式: 'day' | 'week' | 'month' | 'period'
  trendMode?: 'day' | 'week' | 'month' | 'period';
  // 是否显示时间对比
  showCompare?: boolean;
  // 对比时间范围
  compareTimeRange?: { start: string; end: string };
  // 回调函数
  onMetricClick?: (metricId: string) => void;
  onSecondaryClick?: (secondaryId: string) => void;
  onTrendModeChange?: (mode: 'day' | 'week' | 'month' | 'period') => void;
  onCompareToggle?: (enabled: boolean) => void;
}

export const MetricWithTrend: React.FC<MetricWithTrendProps> = ({
  metrics,
  selectedMetricId,
  selectedSecondaryId,
  trendMode = 'day',
  showCompare = false,
  compareTimeRange,
  onMetricClick,
  onSecondaryClick,
  onTrendModeChange,
  onCompareToggle,
}) => {
  // 当前选中的一级指标
  const activeMetric = useMemo(() => {
    return metrics.find(m => m.id === selectedMetricId) || metrics[0];
  }, [metrics, selectedMetricId]);

  // 当前选中的二级指标
  const activeSecondary = useMemo(() => {
    if (!selectedSecondaryId) return null;
    return activeMetric?.secondaryMetrics.find(m => m.id === selectedSecondaryId);
  }, [activeMetric, selectedSecondaryId]);

  // 获取趋势数据（优先使用二级指标的数据，如果没有则使用一级指标的数据）
  const trendData = useMemo(() => {
    if (activeSecondary?.trendData) {
      return activeSecondary.trendData;
    }
    // 如果没有二级指标数据，返回空数组
    return [];
  }, [activeSecondary]);

  // 趋势图标题
  const trendTitle = useMemo(() => {
    if (activeSecondary) {
      return `${activeSecondary.title}趋势`;
    }
    return '请选择指标查看趋势';
  }, [activeSecondary]);

  // 处理一级指标点击
  const handleMetricClick = (metricId: string) => {
    onMetricClick?.(metricId);
    // 切换一级指标时，清除二级指标选择
    if (metricId !== selectedMetricId) {
      onSecondaryClick?.('');
    }
  };

  // 处理二级指标点击
  const handleSecondaryClick = (secondaryId: string) => {
    onSecondaryClick?.(secondaryId);
  };

  // 趋势模式选项
  const trendModeOptions = [
    { value: 'day', label: '日趋势' },
    { value: 'week', label: '周趋势' },
    { value: 'month', label: '月趋势' },
    { value: 'period', label: '时段趋势' },
  ];

  return (
    <div className="metric-with-trend-v2">
      {/* 一级指标卡区域 */}
      <div className="primary-metrics-section">
        <div className="section-label">核心指标</div>
        <div className="primary-metrics-grid">
          {metrics.map(metric => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              yoyChange={metric.yoyChange}
              momChange={metric.momChange}
              isActive={metric.id === activeMetric?.id}
              onClick={() => handleMetricClick(metric.id)}
            />
          ))}
        </div>
      </div>

      {/* 二级指标卡区域 - 展示选中一级指标下的所有二级指标 */}
      {activeMetric && activeMetric.secondaryMetrics.length > 0 && (
        <div className="secondary-metrics-section">
          <div className="section-label">
            {activeMetric.title}的构成指标
            <span className="section-hint">（点击指标查看趋势）</span>
          </div>
          <SecondaryMetricCard
            metrics={activeMetric.secondaryMetrics.map(m => ({
              ...m,
              isActive: m.id === selectedSecondaryId,
            }))}
            parentMetric={activeMetric.title}
            onMetricClick={handleSecondaryClick}
            selectedMetricId={selectedSecondaryId || undefined}
          />
        </div>
      )}

      {/* 趋势图区域 - 展示选中二级指标的趋势 */}
      {activeSecondary && (
        <div className="trend-section">
          <TrendChart
            title={trendTitle}
            data={trendData}
            showCompare={showCompare}
            compareTimeRange={compareTimeRange}
            trendMode={trendMode}
            onTrendModeChange={onTrendModeChange}
            onCompareToggle={onCompareToggle}
          />
        </div>
      )}

      {/* 未选择二级指标时的提示 */}
      {activeMetric && !activeSecondary && (
        <div className="trend-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">📊</div>
            <div className="placeholder-text">
              点击上方"{activeMetric.title}"的构成指标查看趋势图
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricWithTrend;
