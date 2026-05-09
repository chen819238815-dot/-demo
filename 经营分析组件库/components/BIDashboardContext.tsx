import React, { createContext, useContext, useState, useCallback } from 'react';

// 时间类型
type TimeType = 'day' | 'week' | 'month' | 'custom';

interface TimeRange {
  type: TimeType;
  startDate?: string;
  endDate?: string;
}

// 指标数据接口
export interface MetricData {
  id: string;
  name: string;
  value: number;
  unit?: string;
  yoyChange?: number;
  momChange?: number;
  trendData?: TrendPoint[];
  children?: MetricData[];
}

export interface TrendPoint {
  date: string;
  value: number;
  compareValue?: number;
}

// Context 状态接口
interface BIDashboardState {
  // 全局筛选
  selectedStores: string[];
  timeRange: TimeRange;

  // 选中的指标
  selectedMetricId: string | null;
  selectedSecondaryMetricId: string | null;

  // 数据
  metrics: MetricData[];

  // 操作
  setSelectedStores: (stores: string[]) => void;
  setTimeRange: (range: TimeRange) => void;
  selectMetric: (metricId: string | null) => void;
  selectSecondaryMetric: (metricId: string | null) => void;
  refreshData: () => void;
}

const BIDashboardContext = createContext<BIDashboardState | undefined>(undefined);

export const BIDashboardProvider: React.FC<{
  children: React.ReactNode;
  initialMetrics?: MetricData[];
}> = ({ children, initialMetrics = [] }) => {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>({ type: 'day' });
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [selectedSecondaryMetricId, setSelectedSecondaryMetricId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricData[]>(initialMetrics);

  const selectMetric = useCallback((metricId: string | null) => {
    setSelectedMetricId(metricId);
    // 选择一级指标时，清除二级指标选择
    if (metricId) {
      setSelectedSecondaryMetricId(null);
    }
  }, []);

  const selectSecondaryMetric = useCallback((metricId: string | null) => {
    setSelectedSecondaryMetricId(metricId);
  }, []);

  const refreshData = useCallback(() => {
    // 模拟数据刷新
    console.log('Refreshing data with filters:', { selectedStores, timeRange });
  }, [selectedStores, timeRange]);

  return (
    <BIDashboardContext.Provider
      value={{
        selectedStores,
        timeRange,
        selectedMetricId,
        selectedSecondaryMetricId,
        metrics,
        setSelectedStores,
        setTimeRange,
        selectMetric,
        selectSecondaryMetric,
        refreshData,
      }}
    >
      {children}
    </BIDashboardContext.Provider>
  );
};

export const useBIDashboard = () => {
  const context = useContext(BIDashboardContext);
  if (!context) {
    throw new Error('useBIDashboard must be used within BIDashboardProvider');
  }
  return context;
};

export default BIDashboardContext;
