"use client";

import { useEffect, useRef, useCallback, RefObject } from 'react';

interface UseAutoScrollOptions {
  /** Interval in ms between automatic scroll steps (default: 3500ms) */
  interval?: number;
  /** Delay in ms before resuming auto-scroll after user interaction (default: 3000ms) */
  resumeDelay?: number;
  /** Explicit step distance in px (if not provided, computes from first child width + gap) */
  stepDistance?: number;
  /** Enable/disable auto-scroll */
  enabled?: boolean;
}

export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
  scrollRef: RefObject<T | null>,
  options: UseAutoScrollOptions = {}
) {
  const {
    interval = 3500,
    resumeDelay = 3000,
    stepDistance,
    enabled = true
  } = options;

  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInViewRef = useRef(true);
  const isTabVisibleRef = useRef(true);

  // Pause auto-scrolling and schedule resumption after resumeDelay (default 3s)
  const pause = useCallback((customDelay?: number) => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    const delay = customDelay !== undefined ? customDelay : resumeDelay;
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, delay);
  }, [resumeDelay]);

  // Advance the scroll container by one step or loop back to start
  const step = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (isPausedRef.current || !isInViewRef.current || !isTabVisibleRef.current) {
      return;
    }

    // Determine step size from child element or explicit option
    let delta = stepDistance;
    if (!delta) {
      const firstChild = el.firstElementChild as HTMLElement | null;
      if (firstChild) {
        // Approximate width + gap
        delta = firstChild.offsetWidth + 16;
      } else {
        delta = 240;
      }
    }

    const maxScroll = el.scrollWidth - el.clientWidth;
    // If content does not overflow, no need to auto-scroll
    if (maxScroll <= 6) {
      return;
    }

    // If at or near end, loop smoothly back to 0
    if (el.scrollLeft >= maxScroll - 12) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }, [scrollRef, stepDistance]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // 1. Respect "prefers-reduced-motion"
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      return;
    }

    const el = scrollRef.current;
    if (!el) return;

    // 2. Pause when tab is hidden, resume when tab is active
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3. Pause when section is off screen using IntersectionObserver
    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isInViewRef.current = !!entry?.isIntersecting;
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
    }

    // 4. User interaction events: touch, swipe, hover, drag, focus, click, wheel
    const handleInteractionStart = () => {
      isPausedRef.current = true;
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };

    const handleInteractionEnd = () => {
      pause(resumeDelay);
    };

    const handleWheel = () => {
      pause(resumeDelay);
    };

    const handleClick = () => {
      pause(resumeDelay);
    };

    // Attach interaction listeners
    el.addEventListener('touchstart', handleInteractionStart, { passive: true });
    el.addEventListener('touchend', handleInteractionEnd, { passive: true });
    el.addEventListener('pointerdown', handleInteractionStart, { passive: true });
    el.addEventListener('pointerup', handleInteractionEnd, { passive: true });
    el.addEventListener('mouseenter', handleInteractionStart);
    el.addEventListener('mouseleave', handleInteractionEnd);
    el.addEventListener('focusin', handleInteractionStart);
    el.addEventListener('focusout', handleInteractionEnd);
    el.addEventListener('wheel', handleWheel, { passive: true });
    el.addEventListener('click', handleClick);

    // 5. Start main auto-advance interval
    intervalTimerRef.current = setInterval(step, interval);

    // 6. Cleanup
    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) observer.disconnect();

      el.removeEventListener('touchstart', handleInteractionStart);
      el.removeEventListener('touchend', handleInteractionEnd);
      el.removeEventListener('pointerdown', handleInteractionStart);
      el.removeEventListener('pointerup', handleInteractionEnd);
      el.removeEventListener('mouseenter', handleInteractionStart);
      el.removeEventListener('mouseleave', handleInteractionEnd);
      el.removeEventListener('focusin', handleInteractionStart);
      el.removeEventListener('focusout', handleInteractionEnd);
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('click', handleClick);
    };
  }, [enabled, interval, resumeDelay, step, pause, scrollRef]);

  return { pause };
}
