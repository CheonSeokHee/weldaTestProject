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
        const containerWidth = e.currentTarget.clientWidth;
        const centerPosition = scrollLeft + containerWidth / 2;
        const currentTick = centerPosition / unitSize;
        const calibratedTick = currentTick - offsetTick + rulerConfig.min;
        onChange(parseFloat(calibratedTick.toFixed(1)));
    };

    // 초기 스크롤 위치도 containerWidth/2를 기준으로
    useEffect(() => {
        if (scrollRef.current && containerWidth > 0) {
            const initialOffset =
                paddingSize + (rulerConfig.initial - rulerConfig.min) * unitSize - containerWidth / 2 + unitSize / 2;
            scrollRef.current.scrollLeft = initialOffset;
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
                    // width: `${(rulerConfig.max-rulerConfig.min) * 10 + 1000}px`,
                    width: 'fit-content',
                    height: '100%',
                    backgroundColor: '#eee',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div style={{ width: '500px', height: '100%' }}>
                
                </div>
                {[...Array(rulerConfig.max-rulerConfig.min)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: '10px',
                            height: i % 10 === 0 ? '100%' : '50%',
                            borderLeft: '1px solid black',
                            boxSizing: 'border-box',
                        }}
                    />
                ))}
                {/* {[...Array((rulerConfig.max - rulerConfig.min) * 10 + 1)].map((_, i) => {
                    const value = i / 10 + rulerConfig.min;
                    const isOneUnit = value % 1 === 0;
                    const isHalfUnit = value % 1 === 0.5;
                    let tickClass = 'ruler-tick short';
                    if (isOneUnit) tickClass = 'ruler-tick long';
                    else if (isHalfUnit) tickClass = 'ruler-tick medium';
                    return (
                        <div key={i} className={tickClass}>
                            {isOneUnit && (
                                <span className="ruler-label">{value}</span>
                            )}
                        </div>
                    );
                })} */}
                <div style={{ width: '500px', height: '100%' }}>
                  
                </div>
            </div>
        </div>
        <div className="ruler-center-line" />
    </div>

</div>
  )
}

export default Ruler2

