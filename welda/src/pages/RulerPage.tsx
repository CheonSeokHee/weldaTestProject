import React, { useState } from 'react';
import Ruler2 from '../componets/Ruler2';
import ReportPage from './reportPage';

interface RulerPageProps {
  rulerConfig:{
    min: number; max: number; initial: number
  }
  onBack: () => void;
  tickNumberHistory: { value: number; timestamp: string }[];
  setTickNumberHistory: React.Dispatch<React.SetStateAction<{ value: number; timestamp: string }[]>>;
}

const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const day = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  const hour = now.getHours();
  const min = now.getMinutes().toString().padStart(2, '0');
  return `${year}년 ${month}월 ${date}일 (${day})  |  오전 ${hour}:${min}`;
};

function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const RulerPage = ({  rulerConfig, onBack, tickNumberHistory, setTickNumberHistory }: RulerPageProps) => {
  const [tickNumber, setTickNumber] = useState(rulerConfig.initial);

  const handleGetTickNumber = (tickNumber: number) => {
    console.log('최종 ',tickNumber)
    setTickNumber(tickNumber) 
  }

  const handleSave = () => {
    const now = new Date();
    setTickNumberHistory(prev => [
      ...prev,
      { value: tickNumber, timestamp: formatDateTime(now) }
    ]);
  }

  return (
    <>
      <span style={{ display: 'flex', alignItems: 'center', gap:'370px'}}>
        <div>
<button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>&lt;</button>
        </div>
        
        <h2 style={{ textAlign: 'center', margin: 0, fontWeight: 700 }}>허리 둘레</h2>
       
      </span>
      <div style={{ justifyContent:'center',background: '#f7f7fa', borderRadius: 16, padding: '10px 16px', fontSize: 15, color: '#333', display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <span>{getTodayString()}</span>
      </div>
   
    
      <div style={{ textAlign: 'center', fontSize: 48, fontWeight: 700, color: '#6C63FF', margin: '12px 12px 12px 12px' }}>
        {tickNumber.toFixed(1)}<span style={{ fontSize: 28, fontWeight: 400, color: '#6C63FF' }}>cm</span>
      </div>
  
      <div>
        <Ruler2 onChange={handleGetTickNumber} rulerConfig={rulerConfig} />
      </div>
  
      <button 
        onClick={handleSave}
        style={{ width: '100%', background: '#6C63FF', color: '#fff', fontWeight: 700, fontSize: 22, border: 'none', borderRadius: 16, padding: '18px 0', marginTop: 16, cursor: 'pointer' }}>
        저장
      </button>
    
      <ReportPage tickNumberHistory={tickNumberHistory} />
  
    </>
   
  );
};

export default RulerPage; 