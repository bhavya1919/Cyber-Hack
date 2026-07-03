// src/components/dashboard/OverviewCards/Counter.tsx

import { useEffect, useState, useRef } from "react";

/**
 * Animated counter that smoothly increments from 0 to the target value.
 * It starts the animation when the component becomes visible (IntersectionObserver).
 * If the target value is null or undefined, it shows a placeholder.
 */
export const Counter = ({ value }: { value: number | null }) => {
  const [display, setDisplay] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (value === null) {
      setDisplay(null);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const duration = 1200; // ms
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.floor(eased * (value as number)));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="counter">
      {display === null ? "--" : display.toLocaleString()}
    </span>
  );
};
