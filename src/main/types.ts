export type Point = Readonly<{
  x: number;
  y: number;
}>;

export type Unit<T> = Point & Readonly<{ data: T }>;

export type Size = Readonly<{
  width: number;
  height: number;
}>;

export type Quadrant = Readonly<{
  location: Point;
  size: Size;
}>;