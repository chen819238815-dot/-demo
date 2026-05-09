import React from 'react';

export interface SecondaryMetric {
  id: string;
  title: string;
  value: string | number;
  yoyChange?: number;
  momChange?: number;
  isActive?: boolean;
}

interface SecondaryMetricCardProps {
  metrics: SecondaryMetric[];
  parentMetric?: string;
  selectedMetricId?: string | null;
  onMetricClick?: (metricId: string) => void;
}

export const SecondaryMetricCard: React.FC<SecondaryMetricCardProps> = ({
  metrics,
  parentMetric,
  selectedMetricId,
  onMetricClick,
}) => {
  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`metric-trend-value ${isPositive ? 'up' : 'down'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(change)}%
      </span>
    );
  };

  return (
    <div className="secondary-metrics-container">
      {parentMetric && (
        <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          {parentMetric}的构成指标
        </div>
      )}
      <div className="secondary-metrics-grid">
        {metrics.map((metric) => {
          const isSelected = selectedMetricId === metric.id || metric.isActive;
          return (
            <div
              key={metric.id}
              className={`secondary-metric-card ${isSelected ? 'active' : ''}`}
              onClick={() => onMetricClick?.(metric.id)}
              style={{ cursor: onMetricClick ? 'pointer' : 'default' }}
            >
              <div className="metric-title">{metric.title}</div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-trends">
                {metric.yoyChange !== undefined && (
                  <div className="metric-trend">
                    <span className="metric-trend-label">同比</span> {formatChange(metric.yoyChange)}
                  </div>
                )}
                {metric.momChange !== undefined && (
                  <div className="metric-trend">
                    <span className="metric-trend-label">环比</span> {formatChange(metric.momChange)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecondaryMetricCard;
