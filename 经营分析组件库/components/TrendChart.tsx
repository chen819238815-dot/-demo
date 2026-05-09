import React, { useState, useMemo } from 'react';

interface TrendData {
  date: string;
  value: number;
  compareValue?: number;
}

type TrendMode = 'day' | 'week' | 'month' | 'period';

interface TrendChartProps {
  title?: string;
  data: TrendData[];
  compareData?: TrendData[];
  showAverage?: boolean;
  showCompare?: boolean;
  compareTimeRange?: { start: string; end: string };
  trendMode?: TrendMode;
  onTrendModeChange?: (mode: TrendMode) => void;
  onCompareToggle?: (enabled: boolean) => void;
  unit?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  title = '趋势图',
  data,
  compareData,
  showAverage = true,
  showCompare = false,
  compareTimeRange,
  trendMode = 'day',
  onTrendModeChange,
  onCompareToggle,
  unit = '',
}) => {
  const [isCompareEnabled, setIsCompareEnabled] = useState(showCompare);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleCompareToggle = () => {
    const newValue = !isCompareEnabled;
    setIsCompareEnabled(newValue);
    onCompareToggle?.(newValue);
  };

  // 计算平均值
  const average = useMemo(() => {
    return data.length > 0
      ? data.reduce((sum, d) => sum + d.value, 0) / data.length
      : 0;
  }, [data]);

  // 计算对比数据的平均值
  const compareAverage = useMemo(() => {
    if (!compareData || compareData.length === 0) return 0;
    return compareData.reduce((sum, d) => sum + d.value, 0) / compareData.length;
  }, [compareData]);

  // 趋势模式选项
  const trendModeOptions = [
    { value: 'day' as TrendMode, label: '日趋势' },
    { value: 'week' as TrendMode, label: '周趋势' },
    { value: 'month' as TrendMode, label: '月趋势' },
    { value: 'period' as TrendMode, label: '时段趋势' },
  ];

  // 简化的 SVG 折线图
  const renderChart = () => {
    if (data.length === 0) return null;

    const width = 800;
    const height = 320;
    const padding = { top: 40, right: 60, bottom: 50, left: 70 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const allValues = [
      ...data.map(d => d.value),
      ...(compareData?.map(d => d.value) || [0]),
      ...(showAverage ? [average] : []),
    ];
    const maxValue = Math.max(...allValues) * 1.1;
    const minValue = 0;

    const xScale = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
    const yScale = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    // 生成平滑曲线路径
    const generateSmoothPath = (dataset: TrendData[]) => {
      if (dataset.length === 0) return '';
      if (dataset.length === 1) return `M ${xScale(0)} ${yScale(dataset[0].value)}`;

      let path = `M ${xScale(0)} ${yScale(dataset[0].value)}`;

      for (let i = 0; i < dataset.length - 1; i++) {
        const x0 = xScale(i);
        const y0 = yScale(dataset[i].value);
        const x1 = xScale(i + 1);
        const y1 = yScale(dataset[i + 1].value);

        const cp1x = x0 + (x1 - x0) * 0.3;
        const cp1y = y0;
        const cp2x = x1 - (x1 - x0) * 0.3;
        const cp2y = y1;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`;
      }

      return path;
    };

    // 生成面积路径
    const generateAreaPath = (dataset: TrendData[]) => {
      const linePath = generateSmoothPath(dataset);
      const lastX = xScale(dataset.length - 1);
      const firstX = xScale(0);
      const bottomY = padding.top + chartHeight;
      return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
    };

    // 平均值线 Y 坐标
    const avgY = yScale(average);
    const compareAvgY = isCompareEnabled && compareData ? yScale(compareAverage) : 0;

    // 计算需要显示的 X 轴标签索引
    const getXAxisLabels = () => {
      const count = data.length;
      if (count <= 8) return data.map((_, i) => i);
      const step = Math.ceil(count / 7);
      const indices = [];
      for (let i = 0; i < count; i += step) {
        indices.push(i);
      }
      if (indices[indices.length - 1] !== count - 1) {
        indices.push(count - 1);
      }
      return indices;
    };

    const xAxisIndices = getXAxisLabels();

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* 主数据渐变 */}
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#155BD4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#155BD4" stopOpacity="0" />
          </linearGradient>
          {/* 对比数据渐变 */}
          <linearGradient id="compareGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ED6A18" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ED6A18" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 网格线 - 水平 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * ratio;
          return (
            <line
              key={`h-${i}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
          );
        })}

        {/* 网格线 - 垂直 */}
        {xAxisIndices.map((index, i) => {
          const x = xScale(index);
          return (
            <line
              key={`v-${i}`}
              x1={x}
              y1={padding.top}
              x2={x}
              y2={padding.top + chartHeight}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
          );
        })}

        {/* Y轴标签 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const value = maxValue * (1 - ratio);
          const y = padding.top + chartHeight * ratio;
          return (
            <text
              key={`y-${i}`}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize={11}
              fill="#999"
            >
              {value >= 10000 ? `${(value / 10000).toFixed(1)}万` : Math.round(value).toLocaleString()}
            </text>
          );
        })}

        {/* X轴标签 */}
        {xAxisIndices.map((index, i) => {
          const x = xScale(index);
          const d = data[index];
          return (
            <text
              key={`x-${i}`}
              x={x}
              y={height - 20}
              textAnchor="middle"
              fontSize={11}
              fill="#999"
            >
              {trendMode === 'period' ? d.date : d.date.slice(5)}
            </text>
          );
        })}

        {/* 主数据面积 */}
        <path
          d={generateAreaPath(data)}
          fill="url(#mainGradient)"
        />

        {/* 对比数据面积 */}
        {isCompareEnabled && compareData && (
          <path
            d={generateAreaPath(compareData)}
            fill="url(#compareGradient)"
          />
        )}

        {/* 平均值线 - 主数据 */}
        {showAverage && (
          <>
            <line
              x1={padding.left}
              y1={avgY}
              x2={width - padding.right}
              y2={avgY}
              stroke="#155BD4"
              strokeDasharray="4,4"
              strokeWidth={1}
              opacity={0.6}
            />
            <g transform={`translate(${width - padding.right + 8}, ${avgY})`}>
              <rect
                x="-4"
                y="-10"
                width="50"
                height="20"
                fill="#155BD4"
                rx="2"
              />
              <text
                x="21"
                y="4"
                textAnchor="middle"
                fontSize={10}
                fill="#fff"
              >
                平均
              </text>
            </g>
          </>
        )}

        {/* 平均值线 - 对比数据 */}
        {isCompareEnabled && compareData && showAverage && (
          <>
            <line
              x1={padding.left}
              y1={compareAvgY}
              x2={width - padding.right}
              y2={compareAvgY}
              stroke="#ED6A18"
              strokeDasharray="4,4"
              strokeWidth={1}
              opacity={0.6}
            />
            <g transform={`translate(${width - padding.right + 8}, ${compareAvgY})`}>
              <rect
                x="-4"
                y="-10"
                width="50"
                height="20"
                fill="#ED6A18"
                rx="2"
              />
              <text
                x="21"
                y="4"
                textAnchor="middle"
                fontSize={10}
                fill="#fff"
              >
                平均
              </text>
            </g>
          </>
        )}

        {/* 对比数据线 */}
        {isCompareEnabled && compareData && (
          <path
            d={generateSmoothPath(compareData)}
            fill="none"
            stroke="#ED6A18"
            strokeWidth={2}
          />
        )}

        {/* 主数据线 */}
        <path
          d={generateSmoothPath(data)}
          fill="none"
          stroke="#155BD4"
          strokeWidth={2}
        />

        {/* 对比数据点 */}
        {isCompareEnabled && compareData && compareData.map((d, i) => (
          <circle
            key={`compare-${i}`}
            cx={xScale(i)}
            cy={yScale(d.value)}
            r={hoveredIndex === i ? 5 : 3}
            fill="#fff"
            stroke="#ED6A18"
            strokeWidth={2}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: 'pointer' }}
          />
        ))}

        {/* 主数据点 */}
        {data.map((d, i) => (
          <circle
            key={`main-${i}`}
            cx={xScale(i)}
            cy={yScale(d.value)}
            r={hoveredIndex === i ? 5 : 3}
            fill="#fff"
            stroke="#155BD4"
            strokeWidth={2}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: 'pointer' }}
          />
        ))}

        {/* 悬浮提示 */}
        {hoveredIndex !== null && (
          <g>
            {/* 垂直指示线 */}
            <line
              x1={xScale(hoveredIndex)}
              y1={padding.top}
              x2={xScale(hoveredIndex)}
              y2={padding.top + chartHeight}
              stroke="#999"
              strokeDasharray="3,3"
              strokeWidth={1}
              opacity={0.5}
            />
            {/* 提示框背景 */}
            <g transform={`translate(${xScale(hoveredIndex) + 10}, ${padding.top + 10})`}>
              <rect
                x="0"
                y="0"
                width="140"
                height={isCompareEnabled && compareData ? "70" : "45"}
                fill="rgba(0, 0, 0, 0.8)"
                rx="4"
              />
              <text x="10" y="18" fontSize={11} fill="#fff">
                {data[hoveredIndex].date}
              </text>
              <text x="10" y="38" fontSize={11} fill="#fff">
                <tspan fill="#4A9AFF">●</tspan> 本期: {data[hoveredIndex].value.toLocaleString()}{unit}
              </text>
              {isCompareEnabled && compareData && compareData[hoveredIndex] && (
                <text x="10" y="58" fontSize={11} fill="#fff">
                  <tspan fill="#FFA94D">●</tspan> 对比: {compareData[hoveredIndex].value.toLocaleString()}{unit}
                </text>
              )}
            </g>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="trend-chart-container">
      <div className="trend-chart-header">
        <div className="trend-chart-title">{title}</div>
        <div className="trend-chart-controls">
          {/* 趋势模式切换 */}
          <div className="trend-chart-mode-tabs">
            {trendModeOptions.map(option => (
              <button
                key={option.value}
                className={`mode-tab ${trendMode === option.value ? 'active' : ''}`}
                onClick={() => onTrendModeChange?.(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* 对比开关 */}
          <label className="trend-chart-compare-toggle">
            <input
              type="checkbox"
              checked={isCompareEnabled}
              onChange={handleCompareToggle}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">时间对比</span>
          </label>
        </div>
      </div>

      {/* 对比时间选择器 - 当开启对比时显示 */}
      {isCompareEnabled && (
        <div className="compare-time-selector">
          <span className="compare-label">对比时间：</span>
          <div className="compare-time-display">
            {compareTimeRange ? (
              <span>{compareTimeRange.start} 至 {compareTimeRange.end}</span>
            ) : (
              <span className="placeholder">请选择对比时间范围</span>
            )}
          </div>
          <button className="select-time-btn">选择时间</button>
        </div>
      )}

      {/* 图例 */}
      <div className="trend-chart-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#155BD4' }}></span>
          <span className="legend-text">{title}</span>
        </div>
        {isCompareEnabled && compareData && (
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ED6A18' }}></span>
            <span className="legend-text">对比数据</span>
          </div>
        )}
        {showAverage && (
          <div className="legend-item">
            <span className="legend-line" style={{ borderColor: '#999' }}></span>
            <span className="legend-text">平均值</span>
          </div>
        )}
      </div>

      <div className="trend-chart-area">
        {renderChart()}
      </div>
    </div>
  );
};

export default TrendChart;
