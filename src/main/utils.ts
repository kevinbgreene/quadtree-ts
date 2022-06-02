import { Point, Box } from "./types";

export function contains(q: Box, p: Point): boolean {
  const qX = q.location.x;
  const qY = q.location.y;
  const qWidth = q.size.width;
  const qHeight = q.size.height;

  return (
    p.x > qX - qWidth &&
    p.x < qX + qWidth &&
    p.y > qY - qHeight &&
    p.y < qY + qHeight
  );
}

export function intersects(q1: Box, q2: Box): boolean {
  const l1: Point = {
    x: q1.location.x - q1.size.width,
    y: q1.location.y - q1.size.height,
  };
  const r1: Point = {
    x: q1.location.x + q1.size.width,
    y: q1.location.y + q1.size.height,
  };
  const l2: Point = {
    x: q2.location.x - q2.size.width,
    y: q2.location.y - q2.size.height,
  };
  const r2: Point = {
    x: q2.location.x + q2.size.width,
    y: q2.location.y + q2.size.height,
  };

  // If one rectangle is on left side of other
  if (l1.x > r2.x || l2.x > r1.x) {
    return false;
  }

  // If one rectangle is above other
  if (r1.y > l2.y || r2.y > l1.y) {
    return false;
  }

  return true;
}

// check if q1 fully contains q2
export function doesFullyContain(q1: Box, q2: Box): boolean {
  const l1: Point = {
    x: q1.location.x - q1.size.width,
    y: q1.location.y - q1.size.height,
  };
  const r1: Point = {
    x: q1.location.x + q1.size.width,
    y: q1.location.y + q1.size.height,
  };
  const l2: Point = {
    x: q2.location.x - q2.size.width,
    y: q2.location.y - q2.size.height,
  };
  const r2: Point = {
    x: q2.location.x + q2.size.width,
    y: q2.location.y + q2.size.height,
  };

  return l1.x < l2.x && l1.y < l2.y && r1.x > r2.x && r1.y > r2.y;
}