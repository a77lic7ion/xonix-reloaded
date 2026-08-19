// Background music uses the user-supplied MP3 tracks in a shuffled no-immediate-repeat queue.
export const MUSIC_TRACKS = [
  { title: "FRAME PERFECT", url: "/manus-storage/frameperfect_245711db.mp3" },
  { title: "HIGHLERT", url: "/manus-storage/highlert_a7f7fa7d.mp3" },
  { title: "KILLCODE", url: "/manus-storage/killcode_6fae543e.mp3" },
  { title: "KILL SCREEN", url: "/manus-storage/killscreen_51be6b7b.mp3" },
  { title: "OVERCLOCKED", url: "/manus-storage/overclocked_eb356ffa.mp3" },
  { title: "POINT OF IMPACT", url: "/manus-storage/poi_d1809396.mp3" },
  { title: "RAPID PULSE", url: "/manus-storage/rapidpulse_2874f62c.mp3" },
] as const;

export class MusicManager {
  private readonly audio = new Audio();
  private enabled = true;
  private queue: number[] = [];
  private currentIndex = -1;

  constructor(private readonly onTrackChange: (title: string) => void) {
    this.audio.preload = "metadata";
    this.audio.volume = 0.42;
    this.audio.addEventListener("ended", () => this.advance());
    this.audio.addEventListener("error", () => this.advance());
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.audio.pause();
      return;
    }
    this.ensurePlaying();
  }

  ensurePlaying() {
    if (!this.enabled) return;
    if (this.currentIndex < 0) this.selectNext();
    void this.audio.play().catch(() => {
      // Playback is retried by the next explicit user gesture if the browser blocks this first attempt.
    });
  }

  dispose() {
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio.load();
  }

  private advance() {
    if (!this.enabled) return;
    this.selectNext();
    this.ensurePlaying();
  }

  private selectNext() {
    if (this.queue.length === 0) this.queue = this.shuffledIndices();
    const next = this.queue.shift();
    if (next === undefined) return;
    this.currentIndex = next;
    const track = MUSIC_TRACKS[next];
    this.audio.src = track.url;
    this.onTrackChange(track.title);
  }

  private shuffledIndices() {
    const indices = MUSIC_TRACKS.map((_, index) => index);
    for (let index = indices.length - 1; index > 0; index -= 1) {
      const next = Math.floor(Math.random() * (index + 1));
      [indices[index], indices[next]] = [indices[next], indices[index]];
    }
    if (indices[0] === this.currentIndex && indices.length > 1) [indices[0], indices[1]] = [indices[1], indices[0]];
    return indices;
  }
}
