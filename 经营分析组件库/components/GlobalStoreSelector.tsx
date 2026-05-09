import React from 'react';
import { StoreSelector } from './StoreSelector';
import { useBIDashboard } from './BIDashboardContext';

interface Store {
  id: string;
  name: string;
  code: string;
  type: 'store' | 'online';
  channel: 'offline' | 'online';
  isOpen: boolean;
}

interface GlobalStoreSelectorProps {
  stores: Store[];
  recentSelections?: string[][];
}

export const GlobalStoreSelector: React.FC<GlobalStoreSelectorProps> = ({
  stores,
  recentSelections = []
}) => {
  const { selectedStores, setSelectedStores } = useBIDashboard();

  const handleChange = (selectedIds: string[]) => {
    setSelectedStores(selectedIds);
    // 触发全局数据刷新
    console.log('店铺选择变更，刷新数据:', selectedIds);
  };

  return (
    <StoreSelector
      stores={stores}
      selectedStores={selectedStores}
      onChange={handleChange}
      recentSelections={recentSelections}
    />
  );
};

export default GlobalStoreSelector;
