import React, { useRef, useState, useEffect } from 'react'
import { useGesture } from '@use-gesture/react'
import { motion, useMotionValue, useMotionValueEvent } from 'framer-motion'

interface RulerProps {
  min: number
  max: number
  initial: number
  onMeasure: (value: number) => void
}

const UNIT_CM = 60 // 1cm = 60px로 더 넓게
const SCALE = 10   // 눈금 단위: 1cm = 10칸 (0.1cm)

const Ruler = ({ min, max, initial, onMeasure }: RulerProps) => {

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);
  const [centerValue, setCenterValue] = useState(initial);

  const rulerLengthCm = max - min
  // ruler의 width를 100%로, 눈금 바디는 rulerLengthCm * UNIT_CM로 유지

  // 컨테이너 width 측정
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // 초기 마운트 시 initial 값이 중앙에 오도록 x 세팅
  useEffect(() => {
    if (containerWidth > 0) {
      const initialX = containerWidth / 2 - (initial - min) * UNIT_CM;
      x.set(initialX);
    }
  }, [containerWidth, initial, min, x]);

  // 드래그로 값 측정
  useGesture(
    {
      onDrag: ({ offset: [dx] }) => {
        if (containerRef.current) {
          const center = containerRef.current.offsetWidth / 2;
          // value 계산: 중앙에서 ruler 이동량만큼
          const value = Math.max(
            min,
            Math.min(max, parseFloat((initial + dx / UNIT_CM).toFixed(1)))
          );
          // x값을 value에 맞게 역산
          const newX = center - (value - min) * UNIT_CM;
          x.set(newX);
          onMeasure(value);
        }
      },
    },
    {
      target: containerRef,
      drag: {
        axis: 'x',
        from: () => [x.get(), 0],
      },
    }
  )

  // 드래그 중 x 값 감지
  useMotionValueEvent(x, 'change', () => {
    if (containerRef.current) {
      const center = containerRef.current.offsetWidth / 2;
      const value = min + ((center - x.get()) / UNIT_CM);
      const clamped = Math.max(min, Math.min(max, parseFloat(value.toFixed(1))));
      setCenterValue(clamped);
      onMeasure(clamped);
    }
  });

  return (
    <div>
      {/* 중앙 큰 숫자 */}
      <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 4 }}>
        <span style={{ fontSize: 40, fontWeight: 'bold', color: '#6C63FF' }}>
          {centerValue.toFixed(1)}
        </span>
        <span style={{ fontSize: 20, color: '#6C63FF', marginLeft: 4 }}>cm</span>
      </div>

      <div
        ref={containerRef}
        style={{
          overflow: 'hidden',
          border: '1px solid #ccc',
          height: 100,
          position: 'relative',
          touchAction: 'none',
          userSelect: 'none',
          background: '#fafafa',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* initial 값 위치 표시 (파란색 원과 숫자) */}
        {containerWidth > 0 && (
          <div
            style={{
              position: 'absolute',
              left: `calc(${containerWidth / 2 + (initial - min) * UNIT_CM}px)`,
              top: 10,
              transform: 'translateX(-50%)',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ width: 16, height: 16, background: '#6C63FF', borderRadius: '50%', marginBottom: 2 }} />
            <span style={{ fontSize: 13, color: '#6C63FF', fontWeight: 700 }}>{initial}</span>
          </div>
        )}

        {/* 중앙 고정 파란색 화살표 (줄자 위) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            fontSize: 32,
            color: '#6C63FF',
            pointerEvents: 'none',
            lineHeight: 1,
          }}
        >
          ▼
        </div>
        {/* 중앙 파란색 강조선 (굵은 눈금) */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 60,
            background: '#6C63FF',
            borderRadius: 2,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* 눈금 스크롤 바디 */}
        <motion.div
          style={{
            x,
            display: 'flex',
            width: rulerLengthCm * UNIT_CM,
            height: '100%',
          }}
        >
          {/* 왼쪽 여백 */}
          <div style={{ width: containerWidth / 2, height: '100%' }} />
          {Array.from(
            { length: Math.floor((max - min) * SCALE) + 1 },
            (_, i) => {
              const cmValue = (min * SCALE + i) / SCALE;
              const isOneUnit = cmValue % 1 === 0;
              const isHalfUnit = cmValue % 1 === 0.5;
              // 1cm: 가장 길고 굵은 선, 숫자 표시
              // 0.5cm: 중간 길이
              // 0.1cm: 가장 짧은 선
              let tickHeight = '30%';
              let tickColor = '#888';
              let tickWidth = '1px';
              if (isOneUnit) {
                tickHeight = '80%';
                tickColor = '#333';
                tickWidth = '2px';
              } else if (isHalfUnit) {
                tickHeight = '50%';
                tickColor = '#666';
                tickWidth = '1.5px';
              }
              // 중앙 값에 해당하는 눈금은 파란색으로 강조
              const isCenterTick = Math.abs(centerValue - cmValue) < 0.05;
              if (isCenterTick && isOneUnit) {
                tickColor = '#6C63FF';
                tickWidth = '4px';
                tickHeight = '80%';
              }
              return (
                <div
                  key={i}
                  style={{
                    width: UNIT_CM / SCALE,
                    borderLeft: `${tickWidth} solid ${tickColor}`,
                    height: tickHeight,
                    position: 'relative',
                  }}
                >
                  {isOneUnit && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '95%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 14,
                        fontWeight: 500,
                        color: isCenterTick ? '#6C63FF' : '#333',
                        alignItems:'center'
                      }}
                    >
                      {cmValue}
                    </span>
                  )}
                </div>
              );
            }
          )}
          {/* 오른쪽 여백 */}
          <div style={{ width: containerWidth / 2, height: '100%' }} />
        </motion.div>
      </div>
    </div>
  )
}

export default Ruler
