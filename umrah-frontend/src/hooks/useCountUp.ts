import { useState, useEffect } from 'react';

/**
 * Custom Count-Up Animation Hook for numbers with easeOutCubic transition
 */
export function useCountUp(target: number, duration: number = 1000, isStarted: boolean = true): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isStarted) {
      setCount(0);
      return;
    }
    if (target === 0) {
      setCount(0);
      return;
    }
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic easing curve for smooth momentum
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, isStarted]);

  return count;
}

export default useCountUp;
