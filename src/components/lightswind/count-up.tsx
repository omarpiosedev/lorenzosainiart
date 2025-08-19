'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

type CountUpProps = {
  value: number;
  duration?: number;
  separator?: string;
  className?: string;
  style?: React.CSSProperties;
  suffix?: string;
  colorScheme?: 'gradient' | 'default';
  startDelay?: number;
  restartTrigger?: number; // Prop per forzare il restart
};

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 2,
  separator = ',',
  className = '',
  style = {},
  suffix = '',
  colorScheme = 'default',
  startDelay = 0,
  restartTrigger = 0,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Cancella eventuali animazioni precedenti
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (!isVisible) {
      return;
    }

    // Reset currentValue quando restartTrigger cambia
    setCurrentValue(0);

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime - startDelay;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easeOut = 1 - (1 - progress) ** 3; // ease-out cubic
      const current = Math.floor(startValue + (endValue - startValue) * easeOut);

      setCurrentValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, value, duration, startDelay, restartTrigger]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  const gradientClass = colorScheme === 'gradient'
    ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
    : '';

  return (
    <span
      ref={elementRef}
      className={cn(
        'font-bold tabular-nums',
        gradientClass,
        className,
      )}
      style={style}
    >
      {formatNumber(currentValue)}
      {suffix}
    </span>
  );
};
