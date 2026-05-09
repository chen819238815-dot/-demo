import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  yoyChange?: number; // 同比
  momChange?: number; // 环比
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  yoyChange,
  momChange,
  isActive = false,
  onClick,
  className = '',
}) => {
  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`zan-trend-value ${isPositive ? 'up' : 'down'}`}>
        {isPositive ? '↑' : '↓'}{Math.abs(change)}%
      </span>
    );
  };

  return (
    <div
      className={`zan-metric-card ${isActive ? 'active' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="zan-metric-card-header">
        <span className="zan-metric-card-title">{title}</span>
      </div>
      <div className="zan-metric-card-value">
        {value}{unit}
      </div>
      <div className="zan-metric-card-trends">
        {yoyChange !== undefined && (
          <div className="zan-metric-card-trend">
            <span className="zan-trend-label">同比</span>
            {formatChange(yoyChange)}
          </div>
        )}
        {momChange !== undefined && (
          <div className="zan-metric-card-trend">
            <span className="zan-trend-label">环比</span>
            {formatChange(momChange)}
          </div>
        )}
      </div>
    </div>
  );
};

// 公式关系展示组件
interface FormulaDisplayProps {
  leftCard: React.ReactNode;
  rightCard: React.ReactNode;
  operator?: string;
  resultCard: React.ReactNode;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  leftCard,
  rightCard,
  operator = '-',
  resultCard,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {resultCard}
      <span style={{ fontSize: 20, color: '#999' }}>=</span>
      {leftCard}
      <span style={{ fontSize: 20, color: '#999' }}>{operator}</span>
      {rightCard}
    </div>
  );
};

export default MetricCard;
