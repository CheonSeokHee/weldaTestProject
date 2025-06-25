import React, { useState } from 'react';

interface SetupPageProps {
  onStart: (values: { min: number; max: number; initial: number }) => void;
}

const SetupPage = ({ onStart }: SetupPageProps) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [initial, setInitial] = useState('');

  const handleStart = () => {
    const minValue = Number(min);
    const maxValue = Number(max);
    const initialValue = initial ? Number(initial) : 80;
    if (!min || !max) {
      alert('최소값과 최대값을 입력하세요.');
      return;
    }
    if (minValue <= -1 || maxValue <= 0) {
      alert('최소값과 최대값은 0보다 커야 합니다.');
      return;
    }
    if (initialValue < minValue || initialValue > maxValue) {
      alert(`기본값은 최소값(${minValue}cm) 이상, 최대값(${maxValue}cm) 이하이어야 합니다.`);
      return;
    }

   onStart({ min: minValue, max: maxValue, initial: initialValue });
  };

  return (
    <div style={{ padding: 24  }}>
      <h2>줄자 설정</h2>
      <div>
        <label>최소값(cm): </label>
        <input type="number" min="0" value={min} onChange={e => setMin(e.target.value)} required />
      </div>
      <div>
        <label>최대값(cm): </label>
        <input type="number" min="1" value={max} onChange={e => setMax(e.target.value)} required />
      </div>
      <div>
        <label>기본값(cm, 미입력시 80): </label>
        <input type="number" min="0" value={initial} onChange={e => setInitial(e.target.value)} />
      </div>
      <button onClick={handleStart} style={{ marginTop: 16 }}>시작</button>
    </div>
  );
};

export default SetupPage; 