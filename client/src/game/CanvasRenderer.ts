// HD arcade reminder: the logical grid stays faithful while biomes, centred line markers, and compact settings lift the presentation.
import { Cell } from "./types";
import type { GameMode } from "./types";
import type { GameEffect, GameToast } from "./GameWorld";
import type { GameWorld } from "./GameWorld";
import { biomeForLevel, type BiomePalette } from "./biomes";

export const SURFACE = {
  width: 1280,
  height: 960,
  board: { x: 54, y: 96, width: 1172, height: 730 },
  titleSkillDown: { x: 246, y: 592, width: 90, height: 62 },
  titleSkillUp: { x: 562, y: 592, width: 90, height: 62 },
  gameOverConfirm: { x: 455, y: 704, width: 370, height: 72 },
  settings: { x: 1052, y: 856, width: 148, height: 50 },
  settingsClose: { x: 838, y: 236, width: 36, height: 36 },
  settingsMusic: { x: 420, y: 390, width: 440, height: 68 },
  settingsSfx: { x: 420, y: 474, width: 440, height: 68 },
  settingsMenu: { x: 420, y: 610, width: 440, height: 64 },
};

const C = { black: "#05070D", white: "#F6F8FF", muted: "#90A4C1", panel: "#0E1628", grid: "#1B2B43", amber: "#FFB33E", coral: "#FF5E80" };
type Rect = { x: number; y: number; width: number; height: number };
function inside(x: number, y: number, rect: Rect) { return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height; }
function text(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, colour = C.white, size = 18, align: CanvasTextAlign = "left", weight = 600) {
  ctx.fillStyle = colour;
  ctx.font = `${weight} ${size}px "IBM Plex Mono", monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
}
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); }

export class CanvasRenderer {
  private titleArt: CanvasImageSource | null = null;

  setTitleArt(image: CanvasImageSource) {
    this.titleArt = image;
  }

  render(ctx: CanvasRenderingContext2D, world: GameWorld) {
    ctx.save();
    this.backdrop(ctx, world);
    if (world.mode === "title") this.title(ctx, world);
    else {
      this.board(ctx, world);
      this.status(ctx, world);
      this.effect(ctx, world, world.effect);
      this.toast(ctx, world, world.toast);
      if (world.mode === "paused" && !world.settingsOpen) this.message(ctx, "PAUSED", "PRESS ESC TO CONTINUE", biomeForLevel(world.level).rail);
      if (world.mode === "lost") this.message(ctx, "BUSTED", "REBUILDING SAFE RAIL", C.coral);
      if (world.mode === "gameOver") this.gameOver(ctx, world);
      if (world.settingsOpen) this.settings(ctx, world);
    }
    ctx.restore();
  }

  private backdrop(ctx: CanvasRenderingContext2D, world: GameWorld) {
    const palette = biomeForLevel(world.level);
    const gradient = ctx.createLinearGradient(0, 0, 0, SURFACE.height);
    gradient.addColorStop(0, `${palette.sea}CC`);
    gradient.addColorStop(1, C.black);
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, SURFACE.width, SURFACE.height);
    for (let i = 0; i < 54; i += 1) {
      const x = (i * 167 + Math.floor(world.visualTime * 8)) % SURFACE.width;
      const y = (i * 83 + Math.floor(world.visualTime * 4)) % SURFACE.height;
      ctx.fillStyle = "rgba(150,190,255,0.08)"; ctx.fillRect(x, y, 1, 1);
    }
  }

  private title(ctx: CanvasRenderingContext2D, world: GameWorld) {
    const palette = biomeForLevel(1);
    ctx.fillStyle = "#080B18"; roundRect(ctx, 60, 74, 1160, 720, 34); ctx.fill();
    ctx.strokeStyle = `${palette.rail}AA`; ctx.lineWidth = 3; roundRect(ctx, 60, 74, 1160, 720, 34); ctx.stroke();
    if (this.titleArt) {
      ctx.save(); ctx.beginPath(); roundRect(ctx, 68, 82, 1144, 704, 28); ctx.clip();
      ctx.globalAlpha = 0.92; ctx.drawImage(this.titleArt, 425, 80, 790, 706);
      const readability = ctx.createLinearGradient(250, 0, 870, 0); readability.addColorStop(0, "rgba(8,11,24,1)"); readability.addColorStop(0.56, "rgba(8,11,24,0.76)"); readability.addColorStop(1, "rgba(8,11,24,0)"); ctx.fillStyle = readability; ctx.fillRect(68, 82, 880, 704);
      const lowerFade = ctx.createLinearGradient(0, 590, 0, 790); lowerFade.addColorStop(0, "rgba(8,11,24,0)"); lowerFade.addColorStop(1, "rgba(8,11,24,0.88)"); ctx.fillStyle = lowerFade; ctx.fillRect(68, 500, 1144, 286); ctx.restore();
    }
    const aura = ctx.createRadialGradient(412, 260, 10, 412, 260, 330); aura.addColorStop(0, `${palette.player}66`); aura.addColorStop(1, "rgba(8,11,24,0)"); ctx.fillStyle = aura; ctx.fillRect(92, 100, 660, 420);
    ctx.fillStyle = palette.playerHot; ctx.font = "800 140px " + '"Space Grotesk", sans-serif'; ctx.textAlign = "left"; ctx.fillText("XONIX", 180, 292);
    text(ctx, "ORIGINAL RULES · MODERN ARCADE", 188, 340, palette.rail, 17, "left", 700);
    text(ctx, "SWIPE OR ARROW KEYS TO STEER", 188, 370, C.muted, 15, "left");
    ctx.fillStyle = "rgba(8,11,24,0.88)"; roundRect(ctx, 174, 502, 540, 196, 20); ctx.fill(); ctx.strokeStyle = `${palette.playerHot}BB`; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, "SELECT SKILL · 1–9", 444, 544, C.muted, 15, "center", 700);
    text(ctx, "BEGIN", 620, 631, C.white, 20, "center", 800);
    text(ctx, "TAP ANYWHERE TO DEPLOY", 444, 684, palette.rail, 13, "center", 700);
    this.skillButton(ctx, SURFACE.titleSkillDown, "−", palette); this.skillButton(ctx, SURFACE.titleSkillUp, "+", palette);
    const skillGradient = ctx.createLinearGradient(360, 568, 500, 668); skillGradient.addColorStop(0, palette.playerHot); skillGradient.addColorStop(1, palette.player);
    ctx.fillStyle = skillGradient; roundRect(ctx, 364, 570, 148, 104, 16); ctx.fill(); text(ctx, String(world.skill), 438, 640, C.white, 42, "center", 800); text(ctx, "SKILL", 438, 662, "rgba(255,255,255,0.78)", 12, "center", 700);
    text(ctx, `TRACK · ${world.musicEnabled ? world.currentTrack : "MUTED"}`, 188, 744, C.muted, 12, "left", 700);
  }

  private skillButton(ctx: CanvasRenderingContext2D, rect: Rect, symbol: string, palette: BiomePalette) {
    ctx.fillStyle = C.panel; roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 14); ctx.fill(); ctx.strokeStyle = `${palette.rail}66`; ctx.lineWidth = 2; ctx.stroke(); text(ctx, symbol, rect.x + rect.width / 2, rect.y + 42, C.white, 30, "center", 600);
  }

  private board(ctx: CanvasRenderingContext2D, world: GameWorld) {
    const { board } = SURFACE; const palette = biomeForLevel(world.level); const cw = board.width / world.board.width; const ch = board.height / world.board.height;
    ctx.fillStyle = palette.sea; roundRect(ctx, board.x - 14, board.y - 14, board.width + 28, board.height + 28, 20); ctx.fill(); ctx.fillStyle = C.black; ctx.fillRect(board.x, board.y, board.width, board.height);
    ctx.save(); ctx.beginPath(); ctx.rect(board.x, board.y, board.width, board.height); ctx.clip(); this.seaTexture(ctx, world, board, palette);
    for (let y = 0; y < world.board.height; y += 1) for (let x = 0; x < world.board.width; x += 1) {
      const cell = world.board.get(x, y); const left = board.x + x * cw; const top = board.y + y * ch;
      if (cell === Cell.Land) { ctx.fillStyle = palette.claimed; ctx.fillRect(left, top, cw + 0.5, ch + 0.5); if ((x * 13 + y * 7) % 4 === 0) { ctx.fillStyle = `${palette.claimedLine}44`; ctx.fillRect(left + cw * 0.2, top + ch * 0.2, cw * 0.5, 1); } }
      if (cell === Cell.Trail) { ctx.save(); ctx.shadowColor = palette.trail; ctx.shadowBlur = 14; ctx.fillStyle = palette.trail; ctx.fillRect(left + 3, top + 2, Math.max(4, cw - 6), Math.max(4, ch - 4)); ctx.restore(); ctx.fillStyle = "#FFF3C4"; ctx.fillRect(left + cw * 0.42, top + 4, 2, Math.max(3, ch - 8)); }
    }
    this.claimEdges(ctx, world, cw, ch, palette); this.entities(ctx, world, cw, ch, palette); ctx.restore();
    ctx.save(); ctx.shadowColor = palette.rail; ctx.shadowBlur = 20; ctx.strokeStyle = palette.rail; ctx.lineWidth = 7; roundRect(ctx, board.x, board.y, board.width, board.height, 4); ctx.stroke(); ctx.restore(); ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1; roundRect(ctx, board.x + 8, board.y + 8, board.width - 16, board.height - 16, 2); ctx.stroke();
  }

  private seaTexture(ctx: CanvasRenderingContext2D, world: GameWorld, board: Rect, palette: BiomePalette) {
    for (let i = 0; i < 108; i += 1) { const x = board.x + ((i * 127 + world.visualTime * (11 + (i % 4))) % board.width); const y = board.y + ((i * 71 + world.visualTime * (5 + (i % 3))) % board.height); ctx.fillStyle = i % 5 === 0 ? `${palette.orb}2A` : "rgba(255,255,255,0.045)"; ctx.beginPath(); ctx.arc(x, y, i % 5 === 0 ? 1.3 : 0.6, 0, Math.PI * 2); ctx.fill(); }
  }

  private claimEdges(ctx: CanvasRenderingContext2D, world: GameWorld, cw: number, ch: number, palette: BiomePalette) {
    const { board } = SURFACE; ctx.strokeStyle = palette.claimedLine; ctx.lineWidth = 2;
    for (let y = 1; y < world.board.height - 1; y += 1) for (let x = 1; x < world.board.width - 1; x += 1) { if (world.board.get(x, y) !== Cell.Land) continue; const left = board.x + x * cw; const top = board.y + y * ch; if (world.board.get(x, y - 1) !== Cell.Land) { ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left + cw, top); ctx.stroke(); } if (world.board.get(x - 1, y) !== Cell.Land) { ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, top + ch); ctx.stroke(); } }
  }

  private entities(ctx: CanvasRenderingContext2D, world: GameWorld, cw: number, ch: number, palette: BiomePalette) {
    const point = (x: number, y: number) => ({ x: SURFACE.board.x + (x + 0.5) * cw, y: SURFACE.board.y + (y + 0.5) * ch });
    for (const enemy of world.seaEnemies) { const p = point(enemy.x, enemy.y); const r = Math.min(cw, ch) * 0.38; ctx.save(); ctx.shadowColor = palette.orb; ctx.shadowBlur = 20; const gradient = ctx.createRadialGradient(p.x - r * 0.3, p.y - r * 0.35, 1, p.x, p.y, r); gradient.addColorStop(0, C.white); gradient.addColorStop(0.22, `${palette.orb}FF`); gradient.addColorStop(1, palette.orb); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    for (const enemy of world.railEnemies) { const p = point(enemy.x, enemy.y); const r = Math.min(cw, ch) * 0.45; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.PI / 4); ctx.shadowColor = palette.enemy; ctx.shadowBlur = 16; ctx.fillStyle = palette.enemy; ctx.fillRect(-r, -r, r * 2, r * 2); ctx.fillStyle = C.black; ctx.fillRect(-r * 0.34, -r * 0.34, r * 0.68, r * 0.68); ctx.restore(); }
    const p = point(world.player.x, world.player.y); const r = Math.min(cw, ch) * 0.48;
    // The two strokes share p as their centre, keeping the pilot's X intersection exactly aligned with the safe rail or live trail.
    ctx.save(); ctx.shadowColor = palette.playerHot; ctx.shadowBlur = 22; ctx.strokeStyle = palette.playerHot; ctx.lineWidth = Math.max(6, r * 0.45); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(p.x - r, p.y - r); ctx.lineTo(p.x + r, p.y + r); ctx.moveTo(p.x + r, p.y - r); ctx.lineTo(p.x - r, p.y + r); ctx.stroke(); ctx.strokeStyle = palette.player; ctx.lineWidth = Math.max(3, r * 0.18); ctx.stroke(); ctx.restore(); ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  private status(ctx: CanvasRenderingContext2D, world: GameWorld) {
    const palette = biomeForLevel(world.level); const y = 898; ctx.fillStyle = "rgba(14,22,40,0.92)"; roundRect(ctx, 54, 852, 1172, 70, 14); ctx.fill();
    const values = [["SCORE", world.score.toString().padStart(6, "0")], ["LIVES", String(world.lives)], ["CAPTURED", `${Math.floor(world.claimed * 100)}%`], ["TIME", `${Math.max(0, Math.ceil(world.timeRemaining))}s`]];
    values.forEach(([label, value], index) => { const x = 88 + index * 230; text(ctx, label, x, 878, C.muted, 13, "left", 700); text(ctx, value, x, y, label === "CAPTURED" ? palette.rail : C.white, 22, "left", 800); });
    text(ctx, palette.label, 1004, 878, palette.rail, 12, "left", 700); text(ctx, `STAGE ${String(world.level).padStart(2, "0")}`, 1004, 898, C.muted, 13, "left", 700);
    ctx.fillStyle = `${palette.rail}22`; roundRect(ctx, SURFACE.settings.x, SURFACE.settings.y, SURFACE.settings.width, SURFACE.settings.height, 12); ctx.fill(); ctx.strokeStyle = `${palette.rail}88`; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, "⚙ SETTINGS", SURFACE.settings.x + 74, 888, C.white, 12, "center", 700);
  }

  private effect(ctx: CanvasRenderingContext2D, world: GameWorld, effect: GameEffect | null) {
    if (!effect) return; const age = world.visualTime - effect.startedAt; if (age < 0 || age > 0.9) return; const palette = biomeForLevel(world.level); const x = SURFACE.board.x + (effect.x + 0.5) * (SURFACE.board.width / world.board.width); const y = SURFACE.board.y + (effect.y + 0.5) * (SURFACE.board.height / world.board.height); const color = effect.kind === "closed" ? palette.rail : palette.enemy; const progress = age / 0.9;
    ctx.save(); ctx.globalAlpha = 1 - progress; ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 16 + progress * 105, 0, Math.PI * 2); ctx.stroke(); for (let i = 0; i < 28; i += 1) { const angle = i * 2.399; const distance = 24 + progress * (42 + (i % 5) * 12); const size = 7 * (1 - progress); ctx.fillStyle = i % 3 === 0 ? palette.trail : color; ctx.fillRect(x + Math.cos(angle) * distance - size / 2, y + Math.sin(angle) * distance - size / 2, size, size); } ctx.restore();
  }

  private toast(ctx: CanvasRenderingContext2D, world: GameWorld, toast: GameToast | null) {
    if (!toast) return; const age = world.visualTime - toast.startedAt; if (age < 0 || age > toast.duration) return; const palette = biomeForLevel(world.level); const progress = Math.min(1, age / 0.18); const exit = Math.max(0, (age - toast.duration + 0.24) / 0.24); const opacity = Math.min(1, progress, 1 - exit); const color = ({ begin: palette.playerHot, closed: palette.trail, almost: palette.orb, busted: palette.enemy, stage: palette.rail } as const)[toast.kind]; const width = Math.max(300, toast.title.length * 28 + 180); const x = (SURFACE.width - width) / 2; const y = 126 + (1 - progress) * -28;
    ctx.save(); ctx.globalAlpha = opacity; ctx.fillStyle = "rgba(5,7,13,0.92)"; roundRect(ctx, x, y, width, 92, 16); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = color; ctx.fillRect(x, y, 7, 92); text(ctx, toast.title, x + 28, y + 43, C.white, 25, "left", 800); text(ctx, toast.detail, x + 28, y + 68, color, 13, "left", 700); ctx.restore();
  }

  private message(ctx: CanvasRenderingContext2D, headline: string, detail: string, color: string) { ctx.fillStyle = "rgba(5,7,13,0.86)"; roundRect(ctx, 354, 390, 572, 190, 20); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); text(ctx, headline, 640, 468, C.white, 46, "center", 800); text(ctx, detail, 640, 510, color, 18, "center", 700); }

  private settings(ctx: CanvasRenderingContext2D, world: GameWorld) {
    const palette = biomeForLevel(world.level); ctx.fillStyle = "rgba(2,5,12,0.78)"; ctx.fillRect(0, 0, SURFACE.width, SURFACE.height); ctx.fillStyle = "rgba(14,22,40,0.98)"; roundRect(ctx, 370, 200, 540, 520, 24); ctx.fill(); ctx.strokeStyle = `${palette.rail}BB`; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, "SETTINGS", 420, 270, C.white, 34, "left", 800); text(ctx, "GAME PAUSED", 420, 300, palette.rail, 13, "left", 700); text(ctx, "×", 856, 265, C.white, 28, "center", 600);
    this.settingRow(ctx, SURFACE.settingsMusic, "MUSIC", world.musicEnabled, world.currentTrack, palette); this.settingRow(ctx, SURFACE.settingsSfx, "SFX", world.sfxEnabled, "READY", palette);
    ctx.fillStyle = "rgba(255,255,255,0.045)"; ctx.fillRect(420, 570, 440, 1); text(ctx, "Audio controls are ready for the upcoming music and effects pass.", 420, 595, C.muted, 12, "left", 500);
    ctx.fillStyle = `${palette.enemy}22`; roundRect(ctx, SURFACE.settingsMenu.x, SURFACE.settingsMenu.y, SURFACE.settingsMenu.width, SURFACE.settingsMenu.height, 12); ctx.fill(); ctx.strokeStyle = `${palette.enemy}99`; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, "RETURN TO MAIN MENU", 640, 651, C.white, 17, "center", 700);
  }

  private settingRow(ctx: CanvasRenderingContext2D, rect: Rect, label: string, enabled: boolean, note: string, palette: BiomePalette) { ctx.fillStyle = "rgba(255,255,255,0.045)"; roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 12); ctx.fill(); text(ctx, label, rect.x + 22, rect.y + 41, C.white, 18, "left", 700); text(ctx, note, rect.x + 22, rect.y + 57, C.muted, 10, "left", 700); const color = enabled ? palette.rail : C.muted; ctx.fillStyle = `${color}33`; roundRect(ctx, rect.x + rect.width - 116, rect.y + 14, 90, 38, 19); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, enabled ? "ON" : "OFF", rect.x + rect.width - 71, rect.y + 40, color, 14, "center", 800); }

  private gameOver(ctx: CanvasRenderingContext2D, world: GameWorld) { const palette = biomeForLevel(world.level); ctx.fillStyle = "rgba(5,7,13,0.9)"; ctx.fillRect(0, 0, SURFACE.width, SURFACE.height); text(ctx, "GAME OVER", 640, 330, palette.enemy, 70, "center", 800); text(ctx, `FINAL SCORE  ${world.score.toString().padStart(6, "0")}`, 640, 382, C.white, 23, "center", 700); if (world.qualifiesForHighScore) text(ctx, "YOUR SCORE REACHED THE TOP TEN", 640, 452, palette.rail, 18, "center", 700); text(ctx, "TAP TO PLAY AGAIN", 640, 748, C.white, 22, "center", 700); }

  hitTest(mode: GameMode, x: number, y: number, settingsOpen = false) {
    if (settingsOpen) { if (inside(x, y, SURFACE.settingsClose)) return "closeSettings" as const; if (inside(x, y, SURFACE.settingsMusic)) return "toggleMusic" as const; if (inside(x, y, SURFACE.settingsSfx)) return "toggleSfx" as const; if (inside(x, y, SURFACE.settingsMenu)) return "mainMenu" as const; return null; }
    if (mode === "title") { if (inside(x, y, SURFACE.titleSkillDown)) return "skillDown" as const; if (inside(x, y, SURFACE.titleSkillUp)) return "skillUp" as const; return "start" as const; }
    if (mode === "gameOver" && inside(x, y, SURFACE.gameOverConfirm)) return "confirm" as const;
    if (inside(x, y, SURFACE.settings)) return "settings" as const;
    return null;
  }
}
