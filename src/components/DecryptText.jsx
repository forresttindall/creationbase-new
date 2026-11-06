import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+-=?<>[]{}';

function isScrambleChar(char) {
  return /[A-Za-z0-9®]/.test(char);
}

// Small raised marks only cycle through glyphs with a matching small, raised ink box, so the
// stand-in occupies the same visual footprint (a full-height capital in the ® slot reads as the
// word's right edge jumping out and back). Matched against Space Grotesk.
const SPECIAL_POOLS = {
  '®': '*"™',
};

function scrambleText(text, revealCount, pools) {
  let revealed = 0;

  return text
    .split('')
    .map((char, i) => {
      if (!isScrambleChar(char)) return char;
      if (revealed < revealCount) {
        revealed += 1;
        return char;
      }
      const pool = SPECIAL_POOLS[char] || pools?.[i] || CHARSET;
      return pool[Math.floor(Math.random() * pool.length)];
    })
    .join('');
}

// For each character, the scramble glyphs whose rendered width is closest to it, so a narrow
// stand-in never sits in a wide letter's slot (or vice versa) and the word's edges don't jump.
// Measured in the DOM, not a canvas, so it uses exactly the font the text renders in.
function buildWidthMatchedPools(host, textNode, text) {
  if (!host || !textNode) return null;
  const range = document.createRange();
  const targets = text.split('').map((_, i) => {
    range.setStart(textNode, i);
    range.setEnd(textNode, i + 1);
    return range.getBoundingClientRect().width;
  });

  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;left:0;top:0;';
  host.appendChild(probe);
  const candidates = CHARSET.split('').map((c) => {
    probe.textContent = c;
    return { c, w: probe.getBoundingClientRect().width };
  });
  host.removeChild(probe);

  return text.split('').map((char, i) => {
    if (!isScrambleChar(char)) return null;
    const target = targets[i];
    if (!target) return null;
    const sorted = [...candidates].sort((a, b) => Math.abs(a.w - target) - Math.abs(b.w - target));
    const close = sorted.filter((x) => Math.abs(x.w - target) <= target * 0.06);
    return (close.length >= 4 ? close : sorted.slice(0, 4)).map((x) => x.c).join('');
  });
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
  const finalTextRef = useRef(null);
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
    const pools = stableWidth
      ? buildWidthMatchedPools(elementRef.current, finalTextRef.current?.firstChild, text)
      : null;

    setDisplayText(scrambleText(text, 0, pools));

    intervalRef.current = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / steps, 1);
      const revealCount = Math.floor(totalScrambleChars * progress);

      if (progress >= 1) {
        clearTimers();
        setDisplayText(text);
        return;
      }

      setDisplayText(scrambleText(text, revealCount, pools));
    }, stepMs);
  }, [clearTimers, duration, stableWidth, text]);

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
      return { left: r.left - hostLeft, width: r.width };
    });
    setSlots((prev) =>
      prev &&
      prev.length === next.length &&
      prev.every((v, i) => Math.abs(v.left - next[i].left) < 0.5 && Math.abs(v.width - next[i].width) < 0.5)
        ? prev
        : next
    );
  }, [isScrambling, text, displayText]);

  if (stableWidth) {
    return (
      <Tag ref={elementRef} className={className} style={{ ...style, position: 'relative', display: 'inline-block' }}>
        <span ref={finalTextRef} style={{ visibility: isScrambling ? 'hidden' : 'visible' }}>{text}</span>
        {isScrambling && slots && (
          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {displayText.split('').map((char, i) => (
              char.trim() ? (
                // Start each glyph exactly at the real character's pen position and keep the inherited
                // letter-spacing, so revealed letters sit pixel-for-pixel on the final text. (Centering
                // in a slot narrowed by negative tracking drew every glyph ~half the tracking to the left,
                // and the word jumped right when the real text returned.)
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: slots[i].left,
                    whiteSpace: 'pre',
                  }}
                >
                  {char}
                </span>
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
