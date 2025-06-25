import React from 'react';

interface ValueItem {
  value: number;
  timestamp: string; 
}

interface ReportPageProps {
  tickNumberHistory: ValueItem[];
}

const ReportPage: React.FC<ReportPageProps> = ({ tickNumberHistory }) => {
  const topFiveSorted = [...tickNumberHistory]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (topFiveSorted.length === 0) return null;

  return (
    <div className="report-list-container">
      <div className="report-list-card">
        <h2 className="report-list-title">기록 리스트</h2>
        <ul className="report-list-ul">
          {topFiveSorted.map((item, idx) => (
            <li key={idx} className="report-list-item">
              <span className="report-rank-number">{idx + 1}.</span>
              <span className="report-value">{item.value}cm</span>
              {item.timestamp && (
                <span className="report-timestamp">{item.timestamp}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportPage;