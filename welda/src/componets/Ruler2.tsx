import React, { useEffect, useState,useRef } from 'react'

interface Ruler2Props {
    rulerConfig:{
        min: number; max: number; initial: number
    }
  onChange: (tickNumber: number) => void;
}

const Ruler2 = ({rulerConfig, onChange }: Ruler2Props) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const unitSize = 10
    const paddingSize = 500
    const offsetTick = paddingSize / unitSize;

    const [containerWidth, setContainerWidth] = useState(0);

    // 창 크기 변화 감지 및 containerWidth 갱신
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

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {

        const scrollLeft = e.currentTarget.scrollLeft;


        const clientSize = e.currentTarget.clientWidth;
        const centerPosition = scrollLeft + clientSize / 2;
        const currentTick = centerPosition / unitSize;
        const calibratedTick = currentTick - clientSize /( unitSize * 2 ) ;
        // const calibratedTick = currentTick - offsetTick + rulerConfig.min;

        console.log('clientSize',clientSize)
        console.log('centerPosition',centerPosition)
        console.log('currentTick',currentTick)
        console.log('calibratedTick',calibratedTick)
    
            
        onChange(parseFloat(calibratedTick.toFixed(1)));
    };

    // 초기 스크롤 위치도 containerWidth/2를 기준으로
    useEffect(() => {
        if (scrollRef.current && containerWidth > 0) {
            const padding = containerWidth / 2
            const gap =  (rulerConfig.max - rulerConfig.min)

        
            
            // const initialOffset =
            //     paddingSize + (rulerConfig.initial - rulerConfig.min) * unitSize - containerWidth / 2 + unitSize / 2;
            const initialOffset =  (rulerConfig.initial - rulerConfig.min) / gap + rulerConfig.min
            console.log('initialOffset', initialOffset)
            scrollRef.current.scrollLeft =(rulerConfig.initial * 10);

            
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
  {/* 왼쪽 여백 */}
  <div style={{ width: `${containerWidth / 2}px`, height: '100%' }} />


  
  {[...Array((rulerConfig.max - rulerConfig.min ) )].map((_, i) => {
    const value = i / 10 + rulerConfig.min;
    const isOneUnit = value % 1 === 0;

    let height = '30%';
    
    const isLastUint = i + 1 === rulerConfig.max - rulerConfig.min
    if (isOneUnit || (i + 1 === rulerConfig.max - rulerConfig.min)) height = '70%';
   
    return (            
      <div
        key={i}
        style={{
          width: '10px',
          height,
          borderLeft: '1px solid black',
          ...(i + 1 === rulerConfig.max - rulerConfig.min && {borderRight: '1px solid black', borderLeft: 'none'}),
          ...(i === (rulerConfig.max - rulerConfig.min)-2 && {borderRight: '1px solid black'}),
          boxSizing: 'border-box',
          position: 'relative',
    

        }}
      >
        {(isOneUnit || isLastUint) && (
          <span
            style={{
              position: 'absolute',
              top: '100%',
              ...(!isLastUint ? {left: '0'} : {left: '10px'}),
              transform: 'translateX(-50%)',
              fontSize: 12,
              color: '#333',
              marginTop: 2,
              zIndex:1
            }}
          >
            {isLastUint ? rulerConfig.max / 10 : value}  
          </span>
        )}
      </div>
     
    );
  })}
{/* </div> */}
  {/* 오른쪽 여백 */}
  <div style={{ width: `${containerWidth / 2}px`, height: '100%' }} />
</div>
        </div>
        <div className="ruler-center-line" />
    </div>

</div>
  )
}

export default Ruler2

