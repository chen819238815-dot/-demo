import React, { useState, useRef, useEffect, useCallback } from 'react';

type TimeType = 'realtime' | 'day' | 'week' | 'month' | 'custom';

interface TimeSelectorProps {
  value: {
    type: TimeType;
    startDate?: string;
    endDate?: string;
  };
  onChange: (value: { type: TimeType; startDate?: string; endDate?: string }) => void;
}

const TYPE_OPTIONS = [
  { value: 'realtime' as TimeType, label: '实时' },
  { value: 'day' as TimeType, label: '日' },
  { value: 'week' as TimeType, label: '周' },
  { value: 'month' as TimeType, label: '月' },
  { value: 'custom' as TimeType, label: '自定义' },
];

const SHORTCUTS: Record<TimeType, { label: string; value: string }[]> = {
  realtime: [],
  day: [
    { label: '今天', value: 'today' },
    { label: '昨天', value: 'yesterday' },
    { label: '前天', value: 'day_before_yesterday' },
  ],
  week: [
    { label: '本周', value: 'this_week' },
    { label: '上周', value: 'last_week' },
  ],
  month: [
    { label: '本月', value: 'this_month' },
    { label: '上个月', value: 'last_month' },
  ],
  custom: [
    { label: '今天', value: 'today' },
    { label: '昨天', value: 'yesterday' },
    { label: '本周', value: 'this_week' },
    { label: '上周', value: 'last_week' },
    { label: '近7天', value: 'last_7_days' },
    { label: '本月', value: 'this_month' },
    { label: '上个月', value: 'last_month' },
    { label: '近30天', value: 'last_30_days' },
    { label: '本季度', value: 'this_quarter' },
    { label: '今年', value: 'this_year' },
  ],
};

// 格式化日期为 YYYY-MM-DD
const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 格式化日期为 YYYY-MM
const formatMonth = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// 获取当前时间字符串
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onChange }) => {
  const [startDate, setStartDate] = useState(value.startDate || '');
  const [endDate, setEndDate] = useState(value.endDate || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 实时模式下每秒更新时间
  useEffect(() => {
    if (value.type === 'realtime') {
      const timer = setInterval(() => {
        setCurrentTime(getCurrentTime());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [value.type]);

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

  const handleTypeChange = (type: TimeType) => {
    // 根据类型设置默认日期
    const today = new Date();
    let newStartDate = '';
    let newEndDate = '';

    switch (type) {
      case 'realtime':
        // 实时模式不需要日期
        break;
      case 'day':
        newStartDate = formatDate(today);
        newEndDate = formatDate(today);
        break;
      case 'week':
        const dayOfWeek = today.getDay();
        const weekStart = new Date(today.getTime() - (dayOfWeek || 7) * 24 * 60 * 60 * 1000);
        newStartDate = formatDate(weekStart);
        newEndDate = formatDate(today);
        break;
      case 'month':
        newStartDate = formatMonth(today);
        break;
      case 'custom':
        newStartDate = formatDate(today);
        newEndDate = formatDate(today);
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onChange({ type, startDate: newStartDate || undefined, endDate: newEndDate || undefined });
    setIsDropdownOpen(false);
  };

  const handleShortcutClick = useCallback((shortcutValue: string) => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (shortcutValue) {
      case 'today':
        start = end = today;
        break;
      case 'yesterday':
        start = end = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'day_before_yesterday':
        start = end = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
        break;
      case 'last_7_days':
        end = today;
        start = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
        break;
      case 'last_30_days':
        end = today;
        start = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
        break;
      case 'this_week':
        const dayOfWeek = today.getDay();
        start = new Date(today.getTime() - (dayOfWeek || 7) * 24 * 60 * 60 * 1000);
        end = today;
        break;
      case 'last_week':
        const lastWeekEnd = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const dayOfLastWeek = lastWeekEnd.getDay();
        start = new Date(lastWeekEnd.getTime() - (dayOfLastWeek || 7) * 24 * 60 * 60 * 1000);
        end = lastWeekEnd;
        break;
      case 'this_month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;
      case 'last_month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'this_quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        end = today;
        break;
      case 'last_quarter':
        const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
        const year = lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear();
        const q = lastQuarter < 0 ? 3 : lastQuarter;
        start = new Date(year, q * 3, 1);
        end = new Date(year, q * 3 + 3, 0);
        break;
      case 'this_year':
        start = new Date(today.getFullYear(), 0, 1);
        end = today;
        break;
    }

    if (start && end) {
      const newStartDate = formatDate(start);
      const newEndDate = formatDate(end);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      onChange({
        type: value.type,
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }
  }, [onChange, value.type]);

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onChange({
        type: 'custom',
        startDate,
        endDate,
      });
    }
  };

  const handleRefreshTime = () => {
    setCurrentTime(getCurrentTime());
    // 触发刷新回调
    onChange({ ...value });
  };

  const currentTypeLabel = TYPE_OPTIONS.find(opt => opt.value === value.type)?.label || '日';

  // 格式化日期显示
  const formatDisplayDate = () => {
    if (value.type === 'custom' && value.startDate && value.endDate) {
      if (value.startDate === value.endDate) {
        return value.startDate;
      }
      return `${value.startDate} 至 ${value.endDate}`;
    }
    if (value.type === 'month' && value.startDate) {
      return value.startDate;
    }
    if (value.startDate) {
      return value.startDate;
    }
    return formatDate(new Date());
  };

  return (
    <div className="time-selector">
      {/* 统计时间标签 */}
      <span className="time-selector-label">统计时间：</span>

      {/* 时间类型下拉选择 */}
      <div className="time-selector-dropdown-wrapper" ref={dropdownRef}>
        <div
          className="time-selector-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>{currentTypeLabel}</span>
          <span className="dropdown-arrow">▼</span>
        </div>

        {isDropdownOpen && (
          <div className="time-selector-dropdown-menu">
            {TYPE_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`dropdown-item ${value.type === option.value ? 'active' : ''}`}
                onClick={() => handleTypeChange(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 实时模式：显示当前时间 + 刷新按钮 */}
      {value.type === 'realtime' ? (
        <div className="time-selector-realtime">
          <span className="realtime-time">{formatDate(new Date())} {currentTime}</span>
          <button className="refresh-link" onClick={handleRefreshTime}>
            刷新
          </button>
        </div>
      ) : value.type === 'custom' ? (
        /* 自定义模式：日期范围选择 */
        <div className="time-selector-custom">
          <input
            type="date"
            className="date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onBlur={handleCustomDateChange}
          />
          <span className="date-separator">至</span>
          <input
            type="date"
            className="date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onBlur={handleCustomDateChange}
          />
          <span className="calendar-icon">📅</span>
        </div>
      ) : (
        /* 日/周/月模式：日期显示 */
        <div className="time-selector-display">
          <span className="date-text">{formatDisplayDate()}</span>
          <span className="calendar-icon">📅</span>
        </div>
      )}

      {/* 快捷选项 */}
      {value.type !== 'realtime' && (
        <div className="time-selector-shortcuts">
          {SHORTCUTS[value.type].map((shortcut) => (
            <button
              key={shortcut.value}
              className="shortcut-btn"
              onClick={() => handleShortcutClick(shortcut.value)}
            >
              {shortcut.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
