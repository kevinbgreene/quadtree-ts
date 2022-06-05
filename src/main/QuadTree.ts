import { Box, Children, IQuadTree, Point, Shape, Size, Unit } from './types';
import { contains, doesFullyContain, intersects } from './utils';

export class QuadTree<T> implements IQuadTree<T> {
  static MAX_ITEMS: number = 4;

  #container: Box;
  #children: Children<T> = {
    type: 'leaves',
    items: [],
  };

  constructor(container: Box) {
    this.#container = container;
  }

  get values(): ReadonlyArray<Unit<T>> {
    return this.#children.type === 'leaves' ? this.#children.items : [];
  }

  get children(): ReadonlyArray<IQuadTree<T>> {
    return this.#children.type === 'nodes' ? this.#children.nodes : [];
  }

  get boundary(): Box {
    return this.#container;
  }

  contains(point: Point): boolean {
    return contains(this.#container, point);
  }

  add(...items: ReadonlyArray<Unit<T>>): void {
    for (const item of items) {
      this.#insert(item);
    }
  }

  query(shape?: Shape): ReadonlyArray<Unit<T>> {
    if (shape == null) {
      return this.#getAllItems();
    }

    const result: Array<Unit<T>> = [];

    console.log({ shape, container: this.#container });
    console.log(intersects(shape, this.#container));

    if (doesFullyContain(shape, this.#container)) {
      result.push(...this.#getAllItems());
    } else if (intersects(shape, this.#container)) {
      console.log(this.#getItems());
      for (const item of this.#getItems()) {
        console.log({ shape, item });
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

  #insert(item: Unit<T>): void {
    if (this.contains(item)) {
      if (
        this.#children.type === 'leaves' &&
        this.#children.items.length < QuadTree.MAX_ITEMS
      ) {
        this.#children.items.push(item);
      } else if (this.#children.type === 'leaves') {
        this.#splitAndAddNextItem(item);
      } else {
        this.#addToChild(item);
      }
    }
  }

  #getAllItems(): ReadonlyArray<Unit<T>> {
    const result: Array<Unit<T>> = [];
    result.push(...this.#getItems());
    for (const child of this.#getChildNodes()) {
      result.push(...child.query());
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

  #getChildNodes(): ReadonlyArray<IQuadTree<T>> {
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

  #splitAndAddNextItem(item: Unit<T>): void {
    const items = [...this.#getItems(), item];
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
    });

    this.#children = {
      type: 'nodes',
      nodes: [topLeft, topRight, bottomRight, bottomLeft],
    };

    for (const item of items) {
      this.#addToChild(item);
    }
  }
}
