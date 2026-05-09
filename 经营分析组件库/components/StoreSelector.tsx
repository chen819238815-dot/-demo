import React, { useState, useMemo, useRef, useEffect } from 'react';

interface Store {
  id: string;
  name: string;
  code: string;
  type: 'store' | 'online';
  channel: 'offline' | 'online';
  isOpen: boolean;
}

interface StoreSelectorProps {
  stores: Store[];
  selectedStores: string[];
  onChange: (selectedIds: string[]) => void;
  recentSelections?: string[][];
}

export const StoreSelector: React.FC<StoreSelectorProps> = ({
  stores,
  selectedStores,
  onChange,
  recentSelections = []
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedStores);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [showClosedStores, setShowClosedStores] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤后的店铺列表
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      if (searchKeyword && !store.name.includes(searchKeyword) && !store.code.includes(searchKeyword)) {
        return false;
      }
      if (!showClosedStores && !store.isOpen) return false;
      if (typeFilter !== 'all' && store.type !== typeFilter) return false;
      if (channelFilter !== 'all' && store.channel !== channelFilter) return false;
      return true;
    });
  }, [stores, searchKeyword, showClosedStores, typeFilter, channelFilter]);

  const handleConfirm = () => {
    onChange(tempSelected);
    setIsDropdownOpen(false);
    setIsBatchModalOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedStores);
    setIsDropdownOpen(false);
    setIsBatchModalOpen(false);
  };

  const handleClear = () => {
    setTempSelected([]);
    onChange([]);
  };

  const toggleStore = (storeId: string) => {
    setTempSelected(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  const selectAll = () => {
    setTempSelected(filteredStores.map(s => s.id));
  };

  const isAllSelected = tempSelected.length === 0 || tempSelected.length === stores.length;

  return (
    <div className="store-selector">
      {/* 触发器区域 */}
      <div className="store-selector-trigger-area">
        {/* 已选标签 */}
        <div className="store-selector-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {isAllSelected ? (
            <span className="store-tag">
              全部店铺
              {!isAllSelected && <span className="tag-close" onClick={(e) => { e.stopPropagation(); handleClear(); }}>×</span>}
            </span>
          ) : (
            <span className="store-tag">
              已选{tempSelected.length}个店铺
              <span className="tag-close" onClick={(e) => { e.stopPropagation(); handleClear(); }}>×</span>
            </span>
          )}
        </div>

        {/* 清除按钮 */}
        {!isAllSelected && (
          <button className="store-clear-btn" onClick={handleClear}>
            <span>×</span>
          </button>
        )}

        {/* 批量选择按钮 */}
        <button
          className="store-batch-btn"
          onClick={() => {
            setIsBatchModalOpen(true);
            setIsDropdownOpen(false);
          }}
        >
          批量选择
        </button>
      </div>

      {/* 直接选择下拉 */}
      {isDropdownOpen && (
        <div className="store-selector-dropdown" ref={dropdownRef}>
          {/* 搜索框 */}
          <div className="store-search-box">
            <input
              type="text"
              className="store-search-input"
              placeholder="请输入店铺名称"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* 全部店铺选项 */}
          <div
            className={`store-all-option ${isAllSelected ? 'selected' : ''}`}
            onClick={() => setTempSelected([])}
          >
            <span className="option-text">全部店铺</span>
            {isAllSelected && <span className="check-icon">✓</span>}
          </div>

          {/* 店铺列表 */}
          <div className="store-list">
            {filteredStores.map(store => (
              <div
                key={store.id}
                className={`store-list-item ${tempSelected.includes(store.id) ? 'selected' : ''}`}
                onClick={() => toggleStore(store.id)}
              >
                <span className="store-type-tag">门店</span>
                <span className="store-name">{store.name}</span>
                {tempSelected.includes(store.id) && <span className="check-icon">✓</span>}
              </div>
            ))}
          </div>

          {/* 底部操作栏 */}
          <div className="store-dropdown-footer">
            <label className="show-closed-stores">
              <input
                type="checkbox"
                checked={showClosedStores}
                onChange={(e) => setShowClosedStores(e.target.checked)}
              />
              <span>显示打烊店铺</span>
              <span className="help-icon">?</span>
            </label>
            <button className="toolbar-btn primary" onClick={handleConfirm}>确认</button>
          </div>
        </div>
      )}

      {/* 批量选择弹窗 */}
      {isBatchModalOpen && (
        <div className="store-batch-modal-overlay">
          <div className="store-batch-modal">
            {/* 弹窗头部 */}
            <div className="store-batch-modal-header">
              <h3 className="modal-title">批量选择店铺</h3>
              <button className="modal-close" onClick={handleCancel}>×</button>
            </div>

            {/* 弹窗内容 */}
            <div className="store-batch-modal-content">
              {/* 筛选器 */}
              <div className="store-batch-filters">
                <label className="show-closed-stores">
                  <input
                    type="checkbox"
                    checked={showClosedStores}
                    onChange={(e) => setShowClosedStores(e.target.checked)}
                  />
                  <span>显示打烊店铺</span>
                </label>
                <select
                  className="filter-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">全部店铺类型</option>
                  <option value="store">门店</option>
                  <option value="online">网店</option>
                </select>
                <select
                  className="filter-select"
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                >
                  <option value="all">全部销售渠道</option>
                  <option value="offline">门店渠道</option>
                  <option value="online">网店渠道</option>
                </select>
                <div className="store-search-box" style={{ flex: 1, marginLeft: 'auto' }}>
                  <input
                    type="text"
                    className="store-search-input"
                    placeholder="请输入店铺名称"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              {/* 表格 */}
              <div className="store-batch-table-wrapper">
                <table className="store-batch-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={filteredStores.length > 0 && filteredStores.every(s => tempSelected.includes(s.id))}
                          onChange={(e) => e.target.checked ? selectAll() : setTempSelected([])}
                        />
                      </th>
                      <th>店铺名称</th>
                      <th style={{ width: '150px' }}>销售渠道</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.map(store => (
                      <tr key={store.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={tempSelected.includes(store.id)}
                            onChange={() => toggleStore(store.id)}
                          />
                        </td>
                        <td>
                          <span className="store-type-tag">门店</span>
                          {store.name}
                        </td>
                        <td>
                          <div className="channel-tags">
                            <span>门店渠道</span>
                            <span>网店渠道</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="store-batch-modal-footer">
              <span className="selected-info">
                已选 <strong>{tempSelected.length}</strong> 个店铺
              </span>
              <div className="action-buttons">
                <button className="toolbar-btn" onClick={handleCancel}>取消</button>
                <button className="toolbar-btn primary" onClick={handleConfirm}>确认</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSelector;
