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

// Location is the center of the circle
export type Circle = Readonly<{
  location: Point;
  radius: number;
}>;