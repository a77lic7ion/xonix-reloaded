// CGA Xonix reminder: arrows and swipes share one directional queue; no on-screen control dock is drawn.
import type { Direction } from "./types";

const VIRTUAL_WIDTH = 1280;
const VIRTUAL_HEIGHT = 960;

export interface InputTarget {
  requestDirection(direction: Direction): void;
  confirm(): void;
  togglePause(): void;
  toggleSettings(): void;
  handleTap(x: number, y: number): void;
  handleTextInput(key: string): boolean;
}

export class InputManager {
  private readonly onPointerDown: (event: PointerEvent) => void;
  private readonly onPointerUp: (event: PointerEvent) => void;
  private readonly onKeyDown: (event: KeyboardEvent) => void;
  private pointerOrigin: { x: number; y: number } | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly target: InputTarget,
  ) {
    this.onPointerDown = (event) => {
      event.preventDefault();
      this.canvas.setPointerCapture(event.pointerId);
      const point = this.toSurfacePoint(event);
      this.pointerOrigin = point;
      if (point) this.target.handleTap(point.x, point.y);
    };

    this.onPointerUp = (event) => {
      event.preventDefault();
      const start = this.pointerOrigin;
      const end = this.toSurfacePoint(event);
      this.pointerOrigin = null;
      if (!start || !end) return;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
      const direction: Direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      this.target.requestDirection(direction);
    };

    this.onKeyDown = (event) => {
      const directionByKey: Record<string, Direction | undefined> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const direction = directionByKey[event.key];
      if (direction) {
        event.preventDefault();
        this.target.requestDirection(direction);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        this.target.toggleSettings();
      }
    };

    canvas.addEventListener("pointerdown", this.onPointerDown, { passive: false });
    canvas.addEventListener("pointerup", this.onPointerUp, { passive: false });
    canvas.addEventListener("pointercancel", this.onPointerUp, { passive: false });
    window.addEventListener("keydown", this.onKeyDown);
  }

  private toSurfacePoint(event: PointerEvent) {
      const rect = this.canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * VIRTUAL_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * VIRTUAL_HEIGHT;
      if (x >= 0 && x <= VIRTUAL_WIDTH && y >= 0 && y <= VIRTUAL_HEIGHT) {
        return { x, y };
      }
    return null;
  }

  dispose() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    window.removeEventListener("keydown", this.onKeyDown);
  }
}
