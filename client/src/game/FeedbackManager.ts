// Capture and BUSTED feedback remains short, event-driven, preference-aware, and safe on unsupported devices.
import type { GameEffect } from "./GameWorld";

type ShakeProfile = { duration: number; intensityX: number; intensityY: number; vibration: number[] };

const PROFILES: Record<GameEffect["kind"], ShakeProfile> = {
  closed: { duration: 0.18, intensityX: 0.012, intensityY: 0.008, vibration: [10, 25, 14] },
  busted: { duration: 0.42, intensityX: 0.03, intensityY: 0.014, vibration: [35, 28, 65] },
};

export class FeedbackManager {
  private enabled = true;
  private reducedMotion = false;
  private active: { startedAt: number; profile: ShakeProfile } | null = null;
  private lastEffectStartedAt = -1;

  constructor() {
    this.reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.active = null;
      navigator.vibrate?.(0);
    }
  }

  consume(effect: GameEffect | null) {
    if (!this.enabled || this.reducedMotion || !effect || effect.startedAt === this.lastEffectStartedAt) return;
    this.lastEffectStartedAt = effect.startedAt;
    const profile = PROFILES[effect.kind];
    this.active = { startedAt: effect.startedAt, profile };
    navigator.vibrate?.(profile.vibration);
  }

  offset(visualTime: number) {
    if (!this.active || this.reducedMotion) return { x: 0, y: 0 };
    const elapsed = visualTime - this.active.startedAt;
    if (elapsed < 0 || elapsed >= this.active.profile.duration) {
      this.active = null;
      return { x: 0, y: 0 };
    }
    const progress = elapsed / this.active.profile.duration;
    const decay = (1 - progress) * (1 - progress);
    const pulse = Math.sin(progress * Math.PI * (this.active.profile.duration > 0.3 ? 9 : 7));
    return {
      x: pulse * this.active.profile.intensityX * decay,
      y: Math.cos(progress * Math.PI * 5) * this.active.profile.intensityY * decay,
    };
  }

  dispose() {
    navigator.vibrate?.(0);
    this.active = null;
  }
}
