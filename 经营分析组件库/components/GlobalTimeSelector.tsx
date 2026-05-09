import React from 'react';
import { TimeSelector } from './TimeSelector';
import { useBIDashboard } from './BIDashboardContext';

export const GlobalTimeSelector: React.FC = () => {
  const { timeRange, setTimeRange } = useBIDashboard();

  const handleChange = (value: { type: 'day' | 'week' | 'month' | 'custom'; startDate?: string; endDate?: string }) => {
    setTimeRange(value);
    // 触发全局数据刷新
    console.log('时间范围变更，刷新数据:', value);
  };

  return (
    <TimeSelector
      value={timeRange}
      onChange={handleChange}
    />
  );
};

export default GlobalTimeSelector;
