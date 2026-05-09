import React from 'react';
import { GlobalStoreSelector } from './GlobalStoreSelector';
import { GlobalTimeSelector } from './GlobalTimeSelector';
import { useBIDashboard } from './BIDashboardContext';

interface Store {
  id: string;
  name: string;
  code: string;
  type: 'store' | 'online';
  channel: 'offline' | 'online';
  isOpen: boolean;
}

interface GlobalFilterBarProps {
  stores: Store[];
  recentSelections?: string[][];
  onRefresh?: () => void;
}

export const GlobalFilterBar: React.FC<GlobalFilterBarProps> = ({
  stores,
  recentSelections = [],
  onRefresh
}) => {
  const { selectedStores, timeRange, refreshData } = useBIDashboard();

  const handleRefresh = () => {
    refreshData();
    onRefresh?.();
  };

  // 格式化显示当前筛选状态
  const getFilterSummary = () => {
    const storeText = selectedStores.length === 0 || selectedStores.length === stores.length
      ? '全部店铺'
      : `已选${selectedStores.length}个店铺`;

    const timeText = timeRange.startDate
      ? timeRange.endDate && timeRange.startDate !== timeRange.endDate
        ? `${timeRange.startDate} 至 ${timeRange.endDate}`
        : timeRange.startDate
      : '今日';

    return `${storeText} · ${timeText}`;
  };

  return (
    <div className="global-filter-bar">
      <div className="global-filter-bar-content">
        {/* 左侧：店铺选择器 */}
        <div className="filter-item">
          <span className="filter-label">店铺：</span>
          <GlobalStoreSelector
            stores={stores}
            recentSelections={recentSelections}
          />
        </div>

        {/* 中间：时间选择器 */}
        <div className="filter-item">
          <span className="filter-label">时间：</span>
          <GlobalTimeSelector />
        </div>

        {/* 右侧：刷新按钮 */}
        <div className="filter-actions">
          <button className="refresh-btn" onClick={handleRefresh}>
            <span className="refresh-icon">🔄</span>
            刷新数据
          </button>
        </div>
      </div>

      {/* 当前筛选状态摘要 */}
      <div className="filter-summary">
        <span className="filter-summary-text">{getFilterSummary()}</span>
      </div>
    </div>
  );
};

export default GlobalFilterBar;
