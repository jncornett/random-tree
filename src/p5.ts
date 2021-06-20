/**
 * A p5.js wrapper.
 */

import P5 from "p5";

export type P5API = {
  [K in keyof P5]: P5[K] extends (...args: infer Args) => any ? P5[K] : never;
};

export type P5OP = {
  [K in keyof P5API]: P5API[K] extends (...args: infer Args) => any
    ? [K, ...Args]
    : never;
}[keyof P5API];

export interface Sketch {
  setup?(): void;
  draw?(): void;
}

export function sketch(
  fn: (p5: P5, ex: { run(op: P5OP): void }) => Sketch
): (node?: HTMLElement) => P5 {
  return (node) =>
    new P5((p5: P5) => {
      const sketch = fn(p5, {
        run: (op: P5OP) => {
          const [cmd, ...args] = op as unknown as [string, ...any[]];
          p5[cmd](...args);
        },
      });
      p5.setup = sketch.setup;
      p5.draw = sketch.draw;
    }, node);
}
