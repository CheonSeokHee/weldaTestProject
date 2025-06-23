import React, { useRef, useState } from 'react'
import { useGesture } from '@use-gesture/react'
import { motion, useMotionValue, useMotionValueEvent } from 'framer-motion'

interface RulerProps {
  min: number
  max: number
  initial: number
  onMeasure: (value: number) => void
}

const UNIT_CM = 20; // 1cm = 20px (원하는 비율로 조정)
const rulerWidth = (max - min) * UNIT_CM;

const Ruler = ({ min, max, initial, onMeasure }: RulerProps) => {

  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(-(initial - min) * UNIT_CM)
  const [value, setValue] = useState(initial)
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [cursorX, setCursorX] = useState<number | null>(null)

  // 드래그로 값 측정
  useGesture(
    {
      onDrag: ({ offset: [dx] }) => {
        const cm = Math.max(
          min,
          Math.min(max, parseFloat((min + -dx / UNIT_CM).toFixed(1)))
        )
        setValue(cm)
        onMeasure(cm)
      },
    },
    {
      target: containerRef,
      drag: {
        axis: 'x',
        from: () => [-x.get(), 0],
      },
    }
  )

  // 드래그 중 x 값 감지
  useMotionValueEvent(x, 'change', () => {
    // cursorX 유지된 상태면 hoverValue도 위치에 따라 보정
    if (cursorX !== null && containerRef.current) {
      const containerLeft =
        containerRef.current.getBoundingClientRect().left ?? 0
      const relativeX = cursorX - containerLeft - x.get()
      const cm = min + relativeX / UNIT_CM
      if (cm >= min && cm <= max) {
        setHoverValue(parseFloat(cm.toFixed(1)))
      } else {
        setHoverValue(null)
      }
    }
  })

  // 커서/터치 위치 추적
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX =
      'touches' in e
        ? e.touches[0]?.clientX
        : (e as React.MouseEvent).clientX;
    setCursorX(clientX);
  
    if (!containerRef.current) return;
    const containerLeft = containerRef.current.getBoundingClientRect().left;
    // x.get()은 음수(왼쪽으로 이동)임을 감안
    const relativeX = clientX - containerLeft - x.get();
    const cm = min + relativeX / UNIT_CM;
  
    if (cm >= min && cm <= max) {
      setHoverValue(parseFloat(cm.toFixed(1)));
    } else {
      setHoverValue(null);
    }
  };

  const handleLeave = () => {
    setHoverValue(null)
    setCursorX(null)
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ width: rulerWidth, height: 80, position: 'relative', background: '#fafafa' }}>
        {Array.from({ length: (max - min) * 10 + 1 }, (_, i) => {
          const cmValue = min + i * 0.1;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i * (UNIT_CM / 10),
                top: 0,
                width: 1,
                height: i % 10 === 0 ? 60 : 30,
                background: '#888',
              }}
            >
              {i % 10 === 0 && (
                <span style={{ position: 'absolute', top: 65, left: -10, fontSize: 12 }}>
                  {cmValue.toFixed(1)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Ruler
