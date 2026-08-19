// Compact CC0 Kenney effects, each triggered only by a discrete game or interface event.
export type SfxName = "ui" | "trail" | "close" | "clear" | "busted" | "toggle";

const SFX: Record<SfxName, { url: string; volume: number }> = {
  ui: { url: "/manus-storage/ui-select_8642a787.wav", volume: 0.32 },
  trail: { url: "/manus-storage/trail-start_f5455159.wav", volume: 0.24 },
  close: { url: "/manus-storage/territory-close_a9840eb6.wav", volume: 0.4 },
  clear: { url: "/manus-storage/stage-clear_8f3ff700.wav", volume: 0.46 },
  busted: { url: "/manus-storage/busted_702a3e4e.wav", volume: 0.5 },
  toggle: { url: "/manus-storage/setting-toggle_e77fa051.wav", volume: 0.26 },
};

export class SfxManager {
  private enabled = true;
  private active = new Set<HTMLAudioElement>();

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.active.forEach((sound) => sound.pause());
  }

  play(name: SfxName) {
    if (!this.enabled) return;
    const effect = SFX[name];
    const sound = new Audio(effect.url);
    sound.preload = "auto";
    sound.volume = effect.volume;
    this.active.add(sound);
    const release = () => this.active.delete(sound);
    sound.addEventListener("ended", release, { once: true });
    sound.addEventListener("error", release, { once: true });
    void sound.play().catch(release);
  }

  dispose() {
    this.active.forEach((sound) => sound.pause());
    this.active.clear();
  }
}
