import React, { useState } from 'react';

interface TableRow {
  id: string;
  dimension: string;
  value: number;
  percentage?: number;
  yoyChange?: number;
  momChange?: number;
  children?: TableRow[];
}

interface DataTableProps {
  title?: string;
  rows: TableRow[];
  valueLabel?: string;
  showPercentage?: boolean;
  showYoy?: boolean;
  showMom?: boolean;
  expandable?: boolean;
  enableFieldSelector?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  rows,
  valueLabel = '数值',
  showPercentage = true,
  showYoy = true,
  showMom = true,
  expandable = true,
  enableFieldSelector = true,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [showFieldPanel, setShowFieldPanel] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    value: true,
    mom: showMom,
    yoy: showYoy,
  });

  const toggleRow = (rowId: string) => {
    const next = new Set(expandedRows);
    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }
    setExpandedRows(next);
  };

  const handleSelectRow = (rowId: string) => {
    setSelectedRowId((prev) => (prev === rowId ? null : rowId));
  };

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const renderTrendValue = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={`table-trend ${isPositive ? 'up' : 'down'}`}>
        {isPositive ? '+' : ''}
        {value.toFixed(1)}%
      </span>
    );
  };

  const renderRow = (row: TableRow, level: number = 0) => {
    const hasChildren = !!row.children?.length;
    const isExpanded = expandedRows.has(row.id);
    const paddingLeft = level * 24 + 16;

    return (
      <React.Fragment key={row.id}>
        <tr
          className={`data-table-row ${hasChildren ? 'has-children' : ''} ${level > 0 ? 'child-row' : ''} ${
            selectedRowId === row.id ? 'selected-row' : ''
          }`}
          onClick={() => handleSelectRow(row.id)}
        >
          <td className="dimension-cell" style={{ paddingLeft }}>
            <div className="dimension-content">
              {hasChildren && expandable ? (
                <span
                  className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleRow(row.id);
                  }}
                >
                  {isExpanded ? '▼' : '▶'}
                </span>
              ) : (
                <span className="expand-placeholder" />
              )}
              <span className="dimension-name">{row.dimension}</span>
            </div>
          </td>
          {visibleColumns.value && (
            <td className="value-cell">
              <div className="value-content">
                <span className="value-number">{formatNumber(row.value)}</span>
                {showPercentage && row.percentage !== undefined && (
                  <div className="percentage-bar-container">
                    <div className="percentage-bar">
                      <div
                        className="percentage-fill"
                        style={{ width: `${Math.min(row.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="percentage-text">{row.percentage.toFixed(0)}%</span>
                  </div>
                )}
              </div>
            </td>
          )}
          {visibleColumns.mom && (
            <td className="trend-cell">
              {row.momChange !== undefined && renderTrendValue(row.momChange)}
            </td>
          )}
          {visibleColumns.yoy && (
            <td className="trend-cell">
              {row.yoyChange !== undefined && renderTrendValue(row.yoyChange)}
            </td>
          )}
        </tr>
        {hasChildren && isExpanded && row.children?.map((child) => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  const totalRow = rows.reduce(
    (acc, row) => ({
      value: acc.value + row.value,
      momChange: row.momChange,
      yoyChange: row.yoyChange,
    }),
    { value: 0, momChange: undefined as number | undefined, yoyChange: undefined as number | undefined },
  );

  return (
    <div className="data-table-container">
      {title && <div className="data-table-title">{title}</div>}

      {enableFieldSelector && (
        <div className="data-table-toolbar">
          <button
            type="button"
            className="data-table-column-trigger"
            onClick={() => setShowFieldPanel((prev) => !prev)}
            aria-label="字段选择器"
          >
            字段选择
          </button>
          {showFieldPanel && (
            <div className="data-table-column-panel">
              <label className="column-toggle-item">
                <input
                  type="checkbox"
                  checked={visibleColumns.value}
                  onChange={() => toggleColumn('value')}
                />
                <span>{valueLabel}</span>
              </label>
              {showMom && (
                <label className="column-toggle-item">
                  <input
                    type="checkbox"
                    checked={visibleColumns.mom}
                    onChange={() => toggleColumn('mom')}
                  />
                  <span>环比</span>
                </label>
              )}
              {showYoy && (
                <label className="column-toggle-item">
                  <input
                    type="checkbox"
                    checked={visibleColumns.yoy}
                    onChange={() => toggleColumn('yoy')}
                  />
                  <span>同比</span>
                </label>
              )}
            </div>
          )}
        </div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="dimension-header">销售渠道</th>
              {visibleColumns.value && <th className="value-header">{valueLabel}</th>}
              {visibleColumns.mom && <th className="trend-header">环比</th>}
              {visibleColumns.yoy && <th className="trend-header">同比</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => renderRow(row))}
            <tr className="total-row">
              <td className="dimension-cell">
                <span className="dimension-name">合计</span>
              </td>
              {visibleColumns.value && (
                <td className="value-cell">
                  <span className="value-number">{formatNumber(totalRow.value)}</span>
                </td>
              )}
              {visibleColumns.mom && (
                <td className="trend-cell">
                  {totalRow.momChange !== undefined && renderTrendValue(totalRow.momChange)}
                </td>
              )}
              {visibleColumns.yoy && (
                <td className="trend-cell">
                  {totalRow.yoyChange !== undefined && renderTrendValue(totalRow.yoyChange)}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
