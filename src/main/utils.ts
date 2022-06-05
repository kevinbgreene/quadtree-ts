import { Point, Box } from './types';

export function contains(box: Box, point: Point): boolean {
  const boxX = box.location.x;
  const boxY = box.location.y;
  const boxWidth = box.size.width;
  const boxHeight = box.size.height;

  return (
    point.x >= boxX &&
    point.x <= boxX + boxWidth &&
    point.y >= boxY &&
    point.y <= boxY + boxHeight
  );
}

export function intersects(box1: Box, box2: Box): boolean {
  const box1TopLeft: Point = box1.location;
  const box1BottomRight: Point = {
    x: box1.location.x + box1.size.width,
    y: box1.location.y + box1.size.height,
  };

  const box2TopLeft: Point = box2.location;
  const box2BottomRight: Point = {
    x: box2.location.x + box2.size.width,
    y: box2.location.y + box2.size.height,
  };

  // If one rectangle is on left side of other
  if (box1TopLeft.x > box2BottomRight.x || box2TopLeft.x > box1BottomRight.x) {
    return false;
  }

  // If one rectangle is above other
  if (box1BottomRight.y < box2TopLeft.y || box2BottomRight.y < box1TopLeft.y) {
    return false;
  }

  return true;
}

// check if box1 fully contains box2
export function doesFullyContain(box1: Box, box2: Box): boolean {
  const box1TopLeft: Point = box1.location;
  const box1BottomRight: Point = {
    x: box1.location.x + box1.size.width,
    y: box1.location.y + box1.size.height,
  };

  const box2TopLeft: Point = box2.location;
  const box2BottomRight: Point = {
    x: box2.location.x + box2.size.width,
    y: box2.location.y + box2.size.height,
  };

  // Are the corners of box2 completely inside the corners of box1
  return (
    box1TopLeft.x <= box2TopLeft.x &&
    box1TopLeft.y <= box2TopLeft.y &&
    box1BottomRight.x >= box2BottomRight.x &&
    box1BottomRight.y >= box2BottomRight.y
  );
}
