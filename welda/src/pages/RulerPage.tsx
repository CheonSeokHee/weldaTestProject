import React from 'react';

interface RecordItem {
  value: number;
  time: string;
}

interface RulerPageProps {
  rulerConfig:{ 
    min: number;
    max: number;
    initial: number;}
 
  onBack: () => void;
}

const RulerPage = ({ rulerConfig, onBack }:RulerPageProps) => {
  const records: RecordItem[] = [];

  console.log(rulerConfig);

  return (
    <div style={{ padding: 24 }}>
      <h2>줄자 페이지</h2>
      <div>줄자 컴포넌트 영역</div>
      <div style={{ marginTop: 32 }}>
        <h3>기록 리스트</h3>
        <ul>
          {records.map((rec, idx) => (
            <li key={idx}>{rec.value}cm - {rec.time}</li>
          ))}
        </ul>
      </div>
      <button onClick={onBack}>뒤로가기</button>
    </div>
  );
};

export default RulerPage; 