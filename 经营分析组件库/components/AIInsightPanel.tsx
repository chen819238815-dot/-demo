import React from 'react';

interface InsightData {
  type: 'fluctuation' | 'anomaly' | 'trend';
  label: string;
  content: string;
}

interface AIInsightPanelProps {
  summary: string;
  insights: InsightData[];
  onViewDetail?: () => void;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({
  summary,
  insights,
  onViewDetail,
}) => {
  return (
    <div className="ai-insight-panel">
      <div className="ai-insight-header">
        <span className="ai-icon">AI</span>
        <span className="ai-title">智能解读</span>
        {onViewDetail && (
          <button
            style={{
              marginLeft: 'auto',
              fontSize: 13,
              color: '#155BD4',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={onViewDetail}
          >
            查看详情 →
          </button>
        )}
      </div>
      <div className="ai-insight-content">
        <div className="insight-item">
          <span className="insight-label">数据概览：</span>
          {summary}
        </div>
        {insights.map((insight, index) => (
          <div key={index} className="insight-item">
            <span className="insight-label">{insight.label}：</span>
            {insight.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightPanel;
