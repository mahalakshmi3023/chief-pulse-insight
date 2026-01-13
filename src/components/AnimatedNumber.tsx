import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  formatFn?: (value: number) => string;
}

export function AnimatedNumber({
  value,
  duration = 1.5,
  delay = 0,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  formatFn,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(0, { 
    damping: 30, 
    stiffness: 100,
    duration: duration * 1000 
  });
  
  const display = useTransform(spring, (current) => {
    if (formatFn) return formatFn(current);
    return current.toFixed(decimals);
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(() => {
        spring.set(value);
        setHasAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasAnimated, value, spring, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

// Hook for animated counting
export function useAnimatedCount(
  targetValue: number,
  options: {
    duration?: number;
    delay?: number;
    decimals?: number;
    enabled?: boolean;
  } = {}
) {
  const { duration = 1.5, delay = 0, decimals = 0, enabled = true } = options;
  const [displayValue, setDisplayValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(targetValue);
      return;
    }

    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration * 1000;

    const updateValue = () => {
      const now = Date.now();
      
      if (now < startTime) {
        requestAnimationFrame(updateValue);
        return;
      }

      if (now >= endTime) {
        setDisplayValue(targetValue);
        setIsComplete(true);
        return;
      }

      const progress = (now - startTime) / (duration * 1000);
      const easedProgress = easeOutExpo(progress);
      const currentValue = easedProgress * targetValue;
      
      setDisplayValue(Number(currentValue.toFixed(decimals)));
      requestAnimationFrame(updateValue);
    };

    requestAnimationFrame(updateValue);
  }, [targetValue, duration, delay, decimals, enabled]);

  return { value: displayValue, isComplete };
}

// Easing function
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// Simple counting component without framer-motion
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const eased = easeOutExpo(progress);
      setCount(start + (end - start) * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [hasStarted, start, end, duration]);

  return (
    <span ref={countRef} className={className}>
      {prefix}
      {count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      {suffix}
    </span>
  );
}
