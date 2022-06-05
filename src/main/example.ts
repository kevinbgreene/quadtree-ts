import { QuadTree } from './QuadTree';
import { sketch } from 'sketch-ts';
import { IQuadTree, Size, Unit } from './types';

const rootSize: Size = { width: 800, height: 400 };

const qt = new QuadTree<void>({
  location: { x: 0, y: 0 },
  size: rootSize,
});

for (let i = 0; i < 100; i++) {
  qt.add({
    x: Math.random() * rootSize.width,
    y: Math.random() * rootSize.height,
  });
}

sketch.init({
  canvas: rootSize,
});

const highlighted: Set<Unit<void>> = new Set();

sketch.loop((ops) => {
  ops.clear();
  ops.strokeWidth(2);

  function drawTree(tree: IQuadTree<void>) {
    ops.strokeColor('black');
    ops.rect(tree.boundary);
    for (const child of tree.children) {
      drawTree(child);
    }

    for (const unit of tree.values) {
      if (highlighted.has(unit)) {
        ops.strokeColor('red');
      } else {
        ops.strokeColor('black');
      }

      ops.circle({
        location: {
          x: unit.x,
          y: unit.y,
        },
        radius: 2,
      });
    }
  }

  drawTree(qt);

  if (ops.isPointerDown) {
    const result = qt.query({
      location: ops.pointerPosition,
      size: { width: 10, height: 10 },
    });

    for (const unit of result) {
      highlighted.add(unit);
    }
  }
});

console.log(qt);
console.log(qt.query());
