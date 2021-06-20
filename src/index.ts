import { P5OP, sketch } from "./p5";
import P5 from "p5";

sketch((p5, { run }) => {
  const width = 400;
  const height = 500;
  const branchColor = p5.color("white");
  const leafColors = [p5.color("coral"), p5.color("crimson"), p5.color("pink")];
  const leafSize = 5;
  let state: Iterable<P5OP>;
  const init = () => {
    p5.background(0);
    state = tree({
      branchColor: () => branchColor,
      leafColor: () =>
        leafColors[Math.floor(Math.random() * leafColors.length)],
      leafSize: () => leafSize,
      origin: p5.createVector(width / 2, height), // bottom middle of the canvas,
      direction: p5.createVector(0, -1), // grow up,
      size: height * 0.75, // approximate "size" factor
      maxDepth: 6,
    });
  };
  return {
    setup() {
      p5.createCanvas(400, 500);
      p5.background(0);
      const resetBtn = p5.createButton("Reset");
      resetBtn.position(10, 10);
      resetBtn.mousePressed(init);
      init();
    },
    draw() {
      for (const op of take(12)(state)) {
        run(op);
      }
    },
  };
})();

function* tree(props: {
  origin: P5.Vector;
  direction: P5.Vector;
  size: number;
  maxDepth: number;
  branchColor: () => P5.Color;
  leafColor: () => P5.Color;
  leafSize: () => number;
}): Generator<P5OP> {
  if (props.maxDepth <= 0) {
    yield ["noStroke"];
    yield ["fill", props.leafColor()];
    yield ["circle", props.origin.x, props.origin.y, props.leafSize()];
    return;
  }
  const branchLength = (Math.random() * props.size) / 2;
  const branchThickness = Math.max(1, Math.log(props.maxDepth) * 2);
  const from = props.origin.copy();
  const to = from
    .copy()
    .add(props.direction.copy().normalize().mult(branchLength));
  yield ["strokeWeight", branchThickness];
  yield ["stroke", props.branchColor()];
  yield ["line", from.x, from.y, to.x, to.y, 0, 0];
  let numChildBranches = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numChildBranches; i++) {
    const rotation = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    yield* tree({
      ...props,
      origin: to,
      direction: props.direction.copy().rotate(rotation),
      size: props.size * 0.7,
      maxDepth: props.maxDepth - 1,
    });
  }
}

function take(n: number) {
  return function* <T>(it: Iterable<T>) {
    const itr = it[Symbol.iterator]();
    for (let i = 0; i < n; i++) {
      const result = itr.next();
      if (result.done) {
        return;
      }
      yield result.value as T;
    }
  };
}
