export type Point = Readonly<{
  x: number;
  y: number;
}>;

export type Unit<T> = Point & Readonly<{ data: T }>;

export type Size = Readonly<{
  width: number;
  height: number;
}>;

// A rectangle where location is top left corner
export type Box = Readonly<{
  location: Point;
  size: Size;
}>;

// A circle where location is the center
export type Circle = Readonly<{
  location: Point;
  radius: number;
}>;

// In the future query could support various shapes.
export type Shape = Box;

export interface IQuadTree<T> {
  add(...items: ReadonlyArray<Unit<T>>): void;
  query(shape?: Shape): ReadonlyArray<Unit<T>>;
  contains(point: Point): boolean;
}

export type Children<T> =
  | Readonly<{
      type: 'leaves';
      items: Array<Unit<T>>;
    }>
  | Readonly<{
      type: 'nodes';
      // Clockwise: topLeft, topRight, bottomRight, bottomLeft
      nodes: [IQuadTree<T>, IQuadTree<T>, IQuadTree<T>, IQuadTree<T>];
    }>;
