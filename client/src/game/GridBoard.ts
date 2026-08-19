// Liquid Blueprint reminder: the board is a restrained cartographic grid where land is safe and sea is exposed.
import { Cell, type Point } from "./types";

export class GridBoard {
  public readonly width: number;
  public readonly height: number;
  private readonly cells: Uint8Array;

  constructor(width = 52, height = 32) {
    this.width = width;
    this.height = height;
    this.cells = new Uint8Array(width * height);
    this.reset();
  }

  reset() {
    this.cells.fill(Cell.Sea);
    for (let x = 0; x < this.width; x += 1) {
      this.set(x, 0, Cell.Land);
      this.set(x, this.height - 1, Cell.Land);
    }
    for (let y = 0; y < this.height; y += 1) {
      this.set(0, y, Cell.Land);
      this.set(this.width - 1, y, Cell.Land);
    }
  }

  createDemoLayout() {
    this.reset();
    for (let y = 1; y < this.height - 1; y += 1) {
      for (let x = 1; x <= 12; x += 1) this.set(x, y, Cell.Land);
    }
  }

  get(x: number, y: number) {
    if (!this.inBounds(x, y)) return Cell.Land;
    return this.cells[y * this.width + x] as Cell;
  }

  set(x: number, y: number, value: Cell) {
    if (this.inBounds(x, y)) this.cells[y * this.width + x] = value;
  }

  inBounds(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  fillRatio() {
    const innerWidth = this.width - 2;
    const innerHeight = this.height - 2;
    let land = 0;
    for (let y = 1; y < this.height - 1; y += 1) {
      for (let x = 1; x < this.width - 1; x += 1) {
        if (this.get(x, y) === Cell.Land) land += 1;
      }
    }
    return land / (innerWidth * innerHeight);
  }

  claimOutsideEnemyReach(enemyPositions: Point[]) {
    const before = this.fillRatio();
    const visited = new Uint8Array(this.width * this.height);
    const queueX = new Int16Array(this.width * this.height);
    const queueY = new Int16Array(this.width * this.height);
    let head = 0;
    let tail = 0;

    for (const enemy of enemyPositions) {
      if (this.get(enemy.x, enemy.y) === Cell.Sea) {
        const index = enemy.y * this.width + enemy.x;
        if (!visited[index]) {
          visited[index] = 1;
          queueX[tail] = enemy.x;
          queueY[tail] = enemy.y;
          tail += 1;
        }
      }
    }

    while (head < tail) {
      const x = queueX[head];
      const y = queueY[head];
      head += 1;
      for (const { x: dx, y: dy } of [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (!this.inBounds(nx, ny) || this.get(nx, ny) !== Cell.Sea) continue;
        const index = ny * this.width + nx;
        if (!visited[index]) {
          visited[index] = 1;
          queueX[tail] = nx;
          queueY[tail] = ny;
          tail += 1;
        }
      }
    }

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const cell = this.get(x, y);
        const reachableSea = visited[y * this.width + x] === 1;
        if (cell === Cell.Trail || (cell === Cell.Sea && !reachableSea)) {
          this.set(x, y, Cell.Land);
        }
      }
    }

    return Math.max(0, Math.round((this.fillRatio() - before) * 10000));
  }
}

