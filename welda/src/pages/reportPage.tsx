import React from 'react';

interface ValueItem {
  value: number;
  timestamp: string; // 등록 시각(옵션)
}

interface ReportPageProps {
  tickNumberHistory: ValueItem[];
}

const ReportPage: React.FC<ReportPageProps> = ({ tickNumberHistory }) => {
  // 전체 중 값이 큰 순서대로 상위 5개만 추출
  const topFiveSorted = [...tickNumberHistory]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div>
      <div>
        <h2 style={{ textAlign: 'center', color: 'White', marginBottom: 30 }}>기록 리스트</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {topFiveSorted.length === 0 ? (
            <li style={{ textAlign: 'center', color: '#999', fontStyle: 'italic', padding: 20 }}>
              저장된 값이 없습니다.
            </li>
          ) : (
            topFiveSorted.map((item, idx) => (
              <li key={idx} style={{ background: '#f8f9fa', margin: '10px 0', padding: 15, borderRadius: 8, borderLeft: '4px solid #007bff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: 18, color: '#007bff', marginRight: 15 }}>{idx + 1}.</span>
                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>{item.value}</span>
                {item.timestamp && (
                  <span style={{ color: '#666', fontSize: 14 }}>{item.timestamp}</span>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReportPage;