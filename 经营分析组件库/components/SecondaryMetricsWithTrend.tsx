import React, { useState, useMemo } from 'react';
import { SecondaryMetricCard } from './SecondaryMetricCard';
import { TrendChart } from './TrendChart';
import { MetricCard } from './MetricCard';

export interface TrendDataPoint {
  date: string;
  value: number;
  compareValue?: number;
}

export interface SecondaryMetricConfig {
  id: string;
  title: string;
  value: string | number;
  yoyChange?: number;
  momChange?: number;
  trendData?: TrendDataPoint[];
}

export interface PrimaryMetricConfig {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  yoyChange?: number;
  momChange?: number;
  trendData?: TrendDataPoint[];
}

interface SecondaryMetricsWithTrendProps {
  // 一级指标卡
  primaryMetric: PrimaryMetricConfig;
  // 二级指标列表
  secondaryMetrics: SecondaryMetricConfig[];
  // 当前选中的指标ID（一级或二级）
  selectedMetricId?: string | null;
  // 公式说明
  formula?: {
    description: string;
  };
  // 趋势图配置
  showCompare?: boolean;
  granularity?: 'day' | 'hour';
  onGranularityChange?: (granularity: 'day' | 'hour') => void;
  onCompareToggle?: (enabled: boolean) => void;
  // 指标点击回调
  onMetricClick?: (metricId: string) => void;
}

export const SecondaryMetricsWithTrend: React.FC<SecondaryMetricsWithTrendProps> = ({
  primaryMetric,
  secondaryMetrics,
  selectedMetricId,
  formula,
  showCompare = false,
  granularity = 'day',
  onGranularityChange,
  onCompareToggle,
  onMetricClick,
}) => {
  // 如果没有指定选中指标，默认选中一级指标
  const activeMetricId = selectedMetricId || primaryMetric.id;

  // 判断当前选中的是否为一级指标
  const isPrimarySelected = activeMetricId === primaryMetric.id;

  // 获取当前选中指标的趋势数据
  const activeTrendData = useMemo(() => {
    if (isPrimarySelected) {
      return primaryMetric.trendData || [];
    }
    const secondaryMetric = secondaryMetrics.find(m => m.id === activeMetricId);
    return secondaryMetric?.trendData || [];
  }, [activeMetricId, isPrimarySelected, primaryMetric, secondaryMetrics]);

  // 获取当前选中指标的标题
  const activeMetricTitle = useMemo(() => {
    if (isPrimarySelected) {
      return primaryMetric.title;
    }
    const secondaryMetric = secondaryMetrics.find(m => m.id === activeMetricId);
    return secondaryMetric?.title || primaryMetric.title;
  }, [activeMetricId, isPrimarySelected, primaryMetric, secondaryMetrics]);

  // 处理一级指标点击
  const handlePrimaryClick = () => {
    onMetricClick?.(primaryMetric.id);
  };

  // 处理二级指标点击
  const handleSecondaryClick = (metricId: string) => {
    onMetricClick?.(metricId);
  };

  return (
    <div className="secondary-metrics-with-trend">
      {/* 一级指标卡 */}
      <div style={{ marginBottom: 16 }}>
        <MetricCard
          title={primaryMetric.title}
          value={primaryMetric.value}
          unit={primaryMetric.unit}
          yoyChange={primaryMetric.yoyChange}
          momChange={primaryMetric.momChange}
          isActive={isPrimarySelected}
          onClick={handlePrimaryClick}
        />
      </div>

      {/* 公式说明 */}
      {formula && (
        <div
          style={{
            padding: '12px 16px',
            background: '#F7F8FA',
            borderRadius: 4,
            fontSize: 13,
            color: '#666',
            marginBottom: 16,
          }}
        >
          {formula.description}
        </div>
      )}

      {/* 二级指标卡 - 支持点击联动 */}
      <div className="secondary-metrics-section">
        <SecondaryMetricCard
          metrics={secondaryMetrics.map(m => ({
            ...m,
            isActive: m.id === activeMetricId,
          }))}
          parentMetric={primaryMetric.title}
          onMetricClick={handleSecondaryClick}
          selectedMetricId={isPrimarySelected ? null : activeMetricId}
        />
      </div>

      {/* 趋势图 - 根据选中指标显示对应趋势 */}
      <TrendChart
        title={`${activeMetricTitle}趋势`}
        data={activeTrendData}
        showCompare={showCompare}
        granularity={granularity}
        onGranularityChange={onGranularityChange}
        onCompareToggle={onCompareToggle}
      />
    </div>
  );
};

export default SecondaryMetricsWithTrend;
