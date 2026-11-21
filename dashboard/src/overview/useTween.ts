import { useEffect, useRef, useState } from "react";

const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
const reducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animate a set of series (e.g. [without, with]) from what is on screen to `target`, in `ms` (ease in-out).
 * The intermediate frames are only a visual transition between two exported curves; no number is ever
 * displayed from them. Instant under prefers-reduced-motion. `target` must be memoised by the caller.
 */
export function useTween(target: readonly (readonly number[])[], ms = 700): number[][] {
  const [shown, setShown] = useState<number[][]>(() => target.map((s) => [...s]));
  const cur = useRef<number[][]>(shown);
  useEffect(() => {
    const from = cur.current;
    const instant = reducedMotion();
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = instant ? 1 : Math.min(1, (t - t0) / ms);
      const e = ease(k);
      const next = target.map((s, i) => s.map((v, q) => { const a = from[i]?.[q] ?? v; return a + (v - a) * e; }));
      cur.current = next;
      setShown(next);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return shown;
}
