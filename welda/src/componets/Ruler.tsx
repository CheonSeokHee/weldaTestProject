import React, { useEffect, useState,useRef } from 'react'

interface Ruler2Props {
    rulerConfig:{
        min: number; max: number; initial: number
    }
  onChange: (tickNumber: number) => void;
}

const Ruler = ({rulerConfig, onChange }: Ruler2Props) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const unitSize = 10 // 10px = 0.1 단위

    const [containerWidth, setContainerWidth] = useState(0);

   
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const clientSize = e.currentTarget.clientWidth;
        const centerPosition = scrollLeft + clientSize / 2;
        const currentTick = centerPosition / unitSize;
        const calibratedTick = currentTick - clientSize /( unitSize * 2 ) ;
    
        // 실제 값으로 변환 (min부터 시작, 0.1 단위)
        // 10px = 0.1 단위이므로 10으로 나누어 0.1 단위로 변환
        const actualValue = (calibratedTick / 10) + rulerConfig.min;
        onChange(parseFloat(actualValue.toFixed(1)));
    };


     useEffect(() => {
        function updateWidth() {
            if (scrollRef.current) {
                setContainerWidth(scrollRef.current.clientWidth);
            }
        }
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);



    // 초기 스크롤 위치도 containerWidth/2를 기준으로
    useEffect(() => {
        if (scrollRef.current && containerWidth > 0) {
            // handleScroll 함수의 계산 방식과 일치하도록 수정
            const relativePosition = (rulerConfig.initial - rulerConfig.min) * 100;
            scrollRef.current.scrollLeft = relativePosition;
        }
     

    }, [rulerConfig, containerWidth]);

  return (
    <div className="ruler-container">
    <div
        className="ruler-scroll"
        style={{
            width: '100%',
            maxWidth: '1000px',
            height: '60px',
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        <div
        ref={scrollRef}
            style={{
                width: '100%',
                height: '100%',
                overflowX: 'scroll',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
            }}
            onScroll={handleScroll}
        >
        
            <div
  className="ruler-bar"
  style={{
    width: 'fit-content',
    height: '100%',
    backgroundColor: '#eee',
    position: 'relative',
    display: 'flex',
  }}
>
  <div style={{ width: `${containerWidth / 2}px`, height: '100%' }} />




  {[...Array(Math.floor((rulerConfig.max - rulerConfig.min) * 10))].map((_, i) => {
    const value = rulerConfig.min + (i / 10);
    const isOneUnit = value % 1 === 0; // 1 단위 눈금
    const isLastUnit = value >= rulerConfig.max;

    let height = '30%'; // 기본 0.1 단위 눈금
    
    if (isOneUnit || isLastUnit) height = '70%'; // 1 단위 눈금과 마지막 눈금
   
    return (            
      <div
        key={i}
        style={{
          width: '10px',
          height,
          borderLeft: '1px solid black',
          ...(isLastUnit && {borderRight: '1px solid black', borderLeft: 'none'}),
          ...(i === Math.floor((rulerConfig.max - rulerConfig.min) * 10) - 1 && {borderRight: '1px solid black'}),
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {(isOneUnit || isLastUnit) && (
          <span
            style={{
              position: 'absolute',
              top: '100%',
              ...(!isLastUnit ? {left: '0'} : {left: '10px'}),
              transform: 'translateX(-50%)',
              fontSize: 12,
              color: '#333',
              marginTop: 2,
              zIndex:1
            }}
          >
            {isLastUnit ? rulerConfig.max : Math.floor(value)}  
          </span>
        )}
      </div>
     
    );
  })}
  <div style={{ width: `${containerWidth / 2}px`, height: '100%' }} />
</div>
        </div>
        <div className="ruler-center-line" />
    </div>

</div>
  )
}

export default Ruler

