import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+-=?<>[]{}';

function isScrambleChar(char) {
  return /[A-Za-z0-9]/.test(char);
}

function scrambleText(text, revealCount) {
  let revealed = 0;

  return text
    .split('')
    .map((char) => {
      if (!isScrambleChar(char)) return char;
      if (revealed < revealCount) {
        revealed += 1;
        return char;
      }
      return CHARSET[Math.floor(Math.random() * CHARSET.length)];
    })
    .join('');
}

export default function DecryptText({
  as: Tag = 'span',
  text,
  trigger = 'mount',
  playKey,
  delay = 0,
  duration = 700,
  threshold = 0.4,
  stableWidth = false,
  className,
  style,
}) {
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const hasAnimatedInViewRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const runAnimation = useCallback(() => {
    clearTimers();

    const totalScrambleChars = text.split('').filter(isScrambleChar).length;
    if (totalScrambleChars === 0) {
      setDisplayText(text);
      return;
    }

    const stepMs = 32;
    const steps = Math.max(10, Math.ceil(duration / stepMs));
    let frame = 0;

    setDisplayText(scrambleText(text, 0));

    intervalRef.current = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / steps, 1);
      const revealCount = Math.floor(totalScrambleChars * progress);

      if (progress >= 1) {
        clearTimers();
        setDisplayText(text);
        return;
      }

      setDisplayText(scrambleText(text, revealCount));
    }, stepMs);
  }, [clearTimers, duration, text]);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (trigger !== 'mount') return undefined;

    timeoutRef.current = window.setTimeout(runAnimation, delay);

    return clearTimers;
  }, [clearTimers, delay, runAnimation, text, trigger]);

  useEffect(() => {
    if (trigger !== 'manual' || playKey == null) return undefined;

    timeoutRef.current = window.setTimeout(runAnimation, delay);

    return clearTimers;
  }, [clearTimers, delay, playKey, runAnimation, text, trigger]);

  useEffect(() => {
    if (trigger !== 'inView') return undefined;
    const node = elementRef.current;
    if (!node || hasAnimatedInViewRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedInViewRef.current) return;
        hasAnimatedInViewRef.current = true;
        timeoutRef.current = window.setTimeout(runAnimation, delay);
        observer.disconnect();
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [clearTimers, delay, runAnimation, text, threshold, trigger]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // stableWidth: the real text always holds the layout (hidden while scrambling), and the scrambled
  // glyphs are overlaid at each real character's measured position, so the line never changes width.
  const finalTextRef = useRef(null);
  const [slots, setSlots] = useState(null);
  const isScrambling = stableWidth && displayText !== text;

  useLayoutEffect(() => {
    if (!isScrambling) return;
    const host = elementRef.current;
    const node = finalTextRef.current?.firstChild;
    if (!host || !node) return;
    const hostLeft = host.getBoundingClientRect().left;
    const range = document.createRange();
    const next = text.split('').map((_, i) => {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      return r.left - hostLeft + r.width / 2;
    });
    setSlots((prev) => (prev && prev.length === next.length && prev.every((v, i) => Math.abs(v - next[i]) < 0.5) ? prev : next));
  }, [isScrambling, text, displayText]);

  if (stableWidth) {
    return (
      <Tag ref={elementRef} className={className} style={{ ...style, position: 'relative', display: 'inline-block' }}>
        <span ref={finalTextRef} style={{ visibility: isScrambling ? 'hidden' : 'visible' }}>{text}</span>
        {isScrambling && slots && (
          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {displayText.split('').map((char, i) => (
              char.trim() ? (
                <span key={i} style={{ position: 'absolute', top: 0, left: slots[i], transform: 'translateX(-50%)', letterSpacing: 0 }}>{char}</span>
              ) : null
            ))}
          </span>
        )}
      </Tag>
    );
  }

  return (
    <Tag ref={elementRef} className={className} style={style}>
      {displayText}
    </Tag>
  );
}
