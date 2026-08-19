// Liquid Blueprint reminder: game-state primitives drive a precise chart-like arcade field.
export enum Cell {
  Sea = 0,
  Land = 1,
  Trail = 2,
}

export type Direction = "up" | "down" | "left" | "right";

export type GameMode = "title" | "playing" | "paused" | "lost" | "levelClear" | "gameOver";

export interface Point {
  x: number;
  y: number;
}

export interface Player extends Point {
  direction: Direction | null;
}

export interface Enemy extends Point {
  dx: number;
  dy: number;
}

export const DIRECTION_VECTOR: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function isOpposite(a: Direction, b: Direction) {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}

