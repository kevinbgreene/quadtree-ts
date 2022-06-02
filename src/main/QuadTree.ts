import { Box, Point, Size, Unit } from './types';
import { contains, doesFullyContain, intersects } from './utils';

type Children<T> = Readonly<{
  type: 'leaves';
  items: Array<Unit<T>>;
}> | Readonly<{
  type: 'nodes'
  // Clockwise: topLeft, topRight, bottomRight, bottomLeft
  nodes: [QuadTree<T>, QuadTree<T>, QuadTree<T>, QuadTree<T>]
}>;

export class QuadTree<T> {
  #container: Box;
  #children: Children<T> = {
    type: 'leaves',
    items: [],
  };

  constructor(container: Box) {
    this.#container = container;
  }

  contains(point: Point): boolean {
    return contains(this.#container, point);
  }

  add(item: Unit<T>): void {
    if (this.contains(item)) {
      if (this.#children.type === 'leaves' && this.#children.items.length < 4) {
        this.#children.items.push(item);
        return;
      } else if (this.#children.type === 'leaves') {
        this.#split();
      } else {
        this.#addToChild(item);
      }
    }
  }

  query(shape: Box): ReadonlyArray<Unit<T>> {
    const result: Array<Unit<T>> = [];
    
    if (doesFullyContain(shape, this.#container)) {
      result.push(...this.getAllItems());
    } else if (intersects(shape, this.#container)) {
      for (const item of this.#getItems()) {
        if (contains(shape, item)) {
          result.push(item);
        }
      }

      for (const child of this.#getChildNodes()) {
        result.push(...child.query(shape));
      }
    }

    return result;
  }

  getAllItems(): ReadonlyArray<Unit<T>> {
    const result: Array<Unit<T>> = [];
    result.push(...this.#getItems());
    for (const child of this.#getChildNodes()) {
      result.push(...child.getAllItems());
    }
    return result;
  }

  #addToChild(unit: Unit<T>): void {
    for (const child of this.#getChildNodes()) {
      if (child.contains(unit)) {
        child.add(unit);
        return;
      }
    }
  }

  #getChildNodes(): ReadonlyArray<QuadTree<T>> {
    if (this.#children.type === 'nodes') {
      return this.#children.nodes;
    }

    return [];
  }

  #getItems(): Array<Unit<T>> {
    if (this.#children.type === 'leaves') {
      return this.#children.items;
    }

    return [];
  }

  #split(): void {
    const items = this.#getItems();
    const splitWidth = this.#container.size.width / 2;
    const splitHeight = this.#container.size.height / 2;
    const splitSize: Size = {
      width: splitWidth,
      height: splitHeight,
    };

    const topLeft = new QuadTree<T>({
      location: this.#container.location,
      size: splitSize,
    });

    const topRight = new QuadTree<T>({
      location: {
        x: this.#container.location.x + splitWidth,
        y: this.#container.location.y,
      },
      size: splitSize,
    });

    const bottomRight = new QuadTree<T>({
      location: {
        x: this.#container.location.x + splitWidth,
        y: this.#container.location.y + splitHeight,
      },
      size: splitSize,
    });

    const bottomLeft = new QuadTree<T>({
      location: {
        x: this.#container.location.x,
        y: this.#container.location.y + splitHeight,
      },
      size: splitSize,
    })

    this.#children = {
      type: 'nodes',
      nodes: [
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
      ]
    };

    items.forEach(item => this.#addToChild(item));
  }
}
