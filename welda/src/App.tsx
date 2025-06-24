import React, { useState } from 'react';
import SetupPage from './pages/SetupPage';
import RulerPage from './pages/RulerPage';
import './App.css';

function App() {
  const [rulerConfig, setRulerConfig] = useState<{ min: number; max: number; initial: number } | null>(null);
  const [tickNumberHistory, setTickNumberHistory] = useState<{value: number, timestamp: string}[]>([]);

  const handleGetRulerInfo = (value: { min: number; max: number; initial: number }) => {
    setRulerConfig(value);
  };



  return (
    <div>
      {rulerConfig ? (
        <RulerPage 
          rulerConfig={rulerConfig} 
          onBack={() => setRulerConfig(null)}
          tickNumberHistory={tickNumberHistory}
          setTickNumberHistory={setTickNumberHistory}
        />
      ) : (
        <SetupPage onStart={handleGetRulerInfo} />
      )}
    </div>
  );
}

export default App;
