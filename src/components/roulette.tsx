'use client';

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Item } from '@/types';
import Image from 'next/image';
import LastTenSpins from '@/components/LastTenSpins';
import FrequencyCounter from '@/components/FrequencyCounter';
import CenterElements from '@/components/CenterElements';

const HorizontalRoulette: React.FC<{
  data: Item[];
}> = ({ data }) => {
  if (data.length !== 5) {
    throw new Error('only 5 items are allowed');
  }
  const itemCount = 13;
  const visibleFull = 11;
  const minSteps = 30;
  const maxSteps = itemCount * 4;
  const maxLoops = Math.ceil(maxSteps / itemCount);
  const centerCopy = maxLoops + 1;
  const copies = centerCopy * 2 + 1;
  const midIndex = Math.floor(itemCount / 2);

  // const SPIN_INTERVAL = 10000;

  const [u1, u2, u3, r1, r2] = data;

  const [cardWidth, setCardWidth] = useState(0);
  const [cardStep, setCardStep] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(
    itemCount * centerCopy + midIndex
  );
  const [highlightWinner, setHighlightWinner] = useState(false);

  const handledRef = useRef(false);
  const nextBaseIndexRef = useRef(itemCount * centerCopy + midIndex);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const [historyQueue, setHistoryQueue] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [lastTenSpins, setLastTenSpins] = useState<Item[]>([]);

  const [selectedId, setSelectedId] = useState<string>('');
  const [spinInterval, setSpinInterval] = useState<number>(60000);

  const timerRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const baseCycle: Item[] = React.useMemo(() => {
    const cycle: Item[] = new Array(itemCount);
    const idx1 = 3,
      idx2 = 2,
      idx3 = 1;
    cycle[idx1] = u1;
    cycle[idx2] = u2;
    cycle[idx3] = u3;
    let toggle = true;
    for (let i = 0; i < itemCount; i++) {
      if (i === idx1 || i === idx2 || i === idx3) continue;
      cycle[i] = toggle ? r1 : r2;
      toggle = !toggle;
    }
    return cycle;
  }, [u1, u2, u3, r1, r2]);

  const items: Item[] = React.useMemo(() => {
    const arr: Item[] = [];
    for (let i = 0; i < copies; i++) {
      arr.push(...baseCycle);
    }
    return arr;
  }, [baseCycle, copies]);

  const baseStart = itemCount * centerCopy;
  const initialIndex = baseStart + midIndex;

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const rect0 = measureRef.current.getBoundingClientRect();
    const w = rect0.width;
    const nextEl = measureRef.current.nextElementSibling as HTMLElement | null;
    let step = w;
    if (nextEl) {
      const rect1 = nextEl.getBoundingClientRect();
      step = rect1.left - rect0.left;
    }
    const cw = (visibleFull + 1) * step;
    setCardWidth(w);
    setCardStep(step);
    setContainerWidth(cw);
    const centerOffset = cw / 2 - w / 2;
    setOffset(-initialIndex * step + centerOffset);
    document.documentElement.style.setProperty('--step', `${step}px`);
  }, [initialIndex]);

  const resetOffsetToBase = () => {
    const baseIdx = nextBaseIndexRef.current;
    const centerOffset = containerWidth / 2 - cardWidth / 2;
    setOffset(-baseIdx * cardStep + centerOffset);
    setCurrentIndex(baseIdx);
  };

  const processWinner = () => {
    const winner = items[nextBaseIndexRef.current];
    setHistoryQueue(() => {
      const updated = [winner.id, ...historyQueue].slice(0, 100);
      const newCounts = updated.reduce<Record<string, number>>((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});
      setCounts(newCounts);
      return updated;
    });
    setLastTenSpins((prev) => [winner, ...prev].slice(0, 10));
    setHighlightWinner(true);
    setTimeout(() => setHighlightWinner(false), 2000);
  };

  const onTransitionEnd = () => {
    if (handledRef.current) return;
    handledRef.current = true;

    setIsAnimating(false);
    resetOffsetToBase();
    processWinner();
  };

  const spin = (chosenId?: string) => {
    if (isAnimating || cardStep === 0) return;
    setIsAnimating(true);
    handledRef.current = false;

    let dataIndex: number;
    let totalSteps: number;
    if (chosenId) {
      const idxInBase = baseCycle.findIndex((x) => x.id === chosenId);
      dataIndex = idxInBase < 0 ? 0 : idxInBase;
      const minLoops = Math.ceil((minSteps - dataIndex) / itemCount);
      const maxLoopsForIndex = Math.floor((maxSteps - dataIndex) / itemCount);
      const loops =
        minLoops <= maxLoopsForIndex
          ? Math.floor(Math.random() * (maxLoopsForIndex - minLoops + 1)) +
            minLoops
          : minLoops;
      totalSteps = loops * itemCount + dataIndex;
    } else {
      totalSteps =
        Math.floor(Math.random() * (maxSteps - minSteps + 1)) + minSteps;
      dataIndex = totalSteps % itemCount;
    }

    const baseIdx = itemCount * centerCopy + dataIndex;
    nextBaseIndexRef.current = baseIdx;
    const targetIndex = itemCount * centerCopy + totalSteps;

    const centerOffset = containerWidth / 2 - cardWidth / 2;
    setOffset(-targetIndex * cardStep + centerOffset);
  };

  useEffect(() => {
    if (cardStep === 0) return;

    startTimeRef.current = performance.now();
    if (timerRef.current) {
      timerRef.current.style.transition = 'none';
      timerRef.current.style.width = '100%';
    }

    const loop = () => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      if (elapsed >= spinInterval) {
        if (selectedId) spin(selectedId);
        else spin();
        startTimeRef.current = now;
        if (timerRef.current) {
          timerRef.current.style.transition = 'none';
          timerRef.current.style.width = '100%';
        }
      }
      const newWidth =
        100 - (Math.min(elapsed, spinInterval) / spinInterval) * 100;
      if (timerRef.current) {
        timerRef.current.style.transition = 'width 100ms linear';
        timerRef.current.style.width = `${newWidth}%`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cardStep, selectedId, spinInterval]);

  return (
    <>
      <div className="topWrapper">
        <LastTenSpins lastTenSpins={lastTenSpins} />

        <FrequencyCounter data={data} counts={counts} />
      </div>

      <div className="arrowContainer">
        <div className="arrow">▲</div>
      </div>

      <div
        className="rouletteWrapper"
        style={{
          width: containerWidth > 0 ? `${containerWidth}px` : '0px',
        }}
      >
        <div
          ref={timerRef}
          className="timerLine"
          style={{ width: '100%' }}
        ></div>
        <div
          className="rouletteTrack"
          style={{
            transform: `translateX(${offset}px)`,
            transition: isAnimating
              ? 'transform 5s cubic-bezier(0.33,1,0.68,1)'
              : 'none',
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {items.map((item, index) => {
            const refProps = index === 0 ? { ref: measureRef } : {};
            const isWinner = index === currentIndex && highlightWinner;
            return (
              <div
                key={`${item.id}-${index}`}
                {...refProps}
                className={`rouletteCard ${
                  highlightWinner ? 'rouletteCardOpacity' : ''
                } ${isWinner ? 'winner' : ''}`}
              >
                <div className="rouletteCardText">
                  ROLLING IN:
                  <br />
                  <b>{item.coef}</b>
                </div>
                <Image
                  src={item.value}
                  alt={item.id}
                  width={100}
                  height={100}
                  priority
                />
              </div>
            );
          })}
        </div>
        {cardStep > 0 && (
          <>
            <div className="fadeLeft"></div>
            <div className="fadeRight"></div>
          </>
        )}
      </div>

      <div className="controls">
        <select
          className="select"
          disabled={isAnimating}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Random</option>
          {data.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          className="select select-time"
          disabled={isAnimating}
          value={spinInterval}
          onChange={(e) => setSpinInterval(+e.target.value)}
        >
          <option value={60000}>60 sec.</option>
          <option value={30000}>30 sec.</option>
          <option value={10000}>10 sec.</option>
        </select>
        <CenterElements />
      </div>
    </>
  );
};

export default HorizontalRoulette;
