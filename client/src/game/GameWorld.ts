// Liquid Blueprint reminder: the world keeps classic Xonix pressure legible through exact grid state and calm data surfaces.
import { CanvasRenderer } from "./CanvasRenderer";
import { GridBoard } from "./GridBoard";
import { ScoreStore, type HighScore } from "./ScoreStore";
import type { SfxName } from "./SfxManager";
import { Cell, DIRECTION_VECTOR, isOpposite, type Direction, type Enemy, type GameMode, type Player, type Point } from "./types";

const STEP_SECONDS = 0.075;

export type ToastKind = "begin" | "closed" | "almost" | "busted" | "stage";

export interface GameToast {
  title: string;
  detail: string;
  kind: ToastKind;
  startedAt: number;
  duration: number;
}

export interface GameEffect {
  kind: "closed" | "busted";
  x: number;
  y: number;
  startedAt: number;
}

export interface SoundEvent {
  id: number;
  name: SfxName;
}

export class GameWorld {
  public readonly board = new GridBoard();
  public readonly renderer = new CanvasRenderer();
  public readonly scoreStore = new ScoreStore();
  public player: Player = { x: 0, y: 16, direction: null };
  public seaEnemies: Enemy[] = [];
  public railEnemies: Enemy[] = [];
  public mode: GameMode = "title";
  public level = 1;
  public skill = 5;
  public lives = 3;
  public score = 0;
  public timeRemaining = 88;
  public target = 80;
  public visualTime = 0;
  public statusLine = "DEPLOY WHEN READY";
  public callsign = "";
  public qualifiesForHighScore = false;
  public toast: GameToast | null = null;
  public effect: GameEffect | null = null;
  public soundEvent: SoundEvent | null = null;
  public settingsOpen = false;
  public musicEnabled = true;
  public sfxEnabled = true;
  public currentTrack = "READY FOR PLAY";
  public readonly demo: boolean;

  private requestedDirection: Direction | null = null;
  private stepAccumulator = 0;
  private simulationTick = 0;
  private stateTimer = 0;
  private demoTargetIndex = 0;
  private almostThereAnnounced = false;
  private soundEventId = 0;
  private readonly demoTargets: Point[] = [
    { x: 12, y: 15 },
    { x: 27, y: 15 },
    { x: 27, y: 0 },
    { x: 37, y: 0 },
    { x: 37, y: 22 },
    { x: 51, y: 22 },
  ];

  constructor(demo = false, initialLevel = 1) {
    this.demo = demo;
    if (demo) {
      this.startNewGame();
      this.level = Math.max(1, Math.floor(initialLevel));
      this.startLevel();
      this.setupDemoBoard();
    }
  }

  get claimed() {
    return this.board.fillRatio();
  }

  get highScores(): HighScore[] {
    return this.scoreStore.list();
  }

  setCurrentTrack(title: string) {
    this.currentTrack = title;
  }

  update(deltaSeconds: number) {
    const delta = Math.min(deltaSeconds, 0.1);
    this.visualTime += delta;
    if (this.settingsOpen) return;
    if (this.mode === "lost" || this.mode === "levelClear") {
      this.stateTimer -= delta;
      if (this.stateTimer <= 0) {
        if (this.mode === "lost") this.startLevel();
        else {
          this.level += 1;
          this.startLevel();
        }
      }
      return;
    }
    if (this.mode !== "playing") return;

    this.timeRemaining -= delta;
    if (this.timeRemaining <= 0) {
      this.loseLife("TIME LIMIT REACHED");
      return;
    }
    this.stepAccumulator += delta;
    while (this.stepAccumulator >= STEP_SECONDS) {
      this.stepAccumulator -= STEP_SECONDS;
      if (this.demo) this.driveDemo();
      this.step();
      if (this.mode !== "playing") break;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderer.render(ctx, this);
  }

  requestDirection(direction: Direction) {
    if (this.settingsOpen) return;
    if (this.mode === "title") {
      this.startNewGame();
      return;
    }
    if (this.mode === "paused") {
      this.mode = "playing";
      return;
    }
    if (this.mode !== "playing") return;
    this.requestedDirection = direction;
  }

  confirm() {
    if (this.mode === "title") {
      this.startNewGame();
      return;
    }
    if (this.mode === "paused") {
      this.mode = "playing";
      return;
    }
    if (this.mode === "gameOver") this.finishGameOver();
  }

  togglePause() {
    if (this.settingsOpen) return;
    if (this.mode === "playing") this.mode = "paused";
    else if (this.mode === "paused") this.mode = "playing";
  }

  toggleSettings() {
    if (this.mode === "title") return;
    this.settingsOpen = !this.settingsOpen;
    this.emitSfx("ui");
  }

  handleTextInput(key: string) {
    if (this.mode !== "gameOver" || !this.qualifiesForHighScore) return false;
    if (key === "Backspace") {
      this.callsign = this.callsign.slice(0, -1);
      return true;
    }
    if (/^[a-z0-9 ]$/i.test(key) && this.callsign.length < 8) {
      this.callsign += key.toUpperCase();
      return true;
    }
    return false;
  }

  handleTap(x: number, y: number) {
    const action = this.renderer.hitTest(this.mode, x, y, this.settingsOpen);
    if (!action) return;
    if (action === "start") {
      this.startNewGame();
      this.emitSfx("ui");
      return;
    }
    if (action === "skillDown") {
      this.skill = Math.max(1, this.skill - 1);
      this.emitSfx("ui");
      return;
    }
    if (action === "skillUp") {
      this.skill = Math.min(9, this.skill + 1);
      this.emitSfx("ui");
      return;
    }
    if (action === "confirm") {
      this.finishGameOver();
      return;
    }
    if (action === "settings") {
      this.toggleSettings();
      return;
    }
    if (action === "closeSettings") {
      this.toggleSettings();
      return;
    }
    if (action === "toggleMusic") {
      this.musicEnabled = !this.musicEnabled;
      this.emitSfx("toggle");
      return;
    }
    if (action === "toggleSfx") {
      this.sfxEnabled = !this.sfxEnabled;
      this.emitSfx("toggle");
      return;
    }
    if (action === "mainMenu") {
      this.settingsOpen = false;
      this.mode = "title";
      this.player.direction = null;
      this.emitSfx("ui");
      return;
    }
    if (action === "pause") {
      this.togglePause();
      return;
    }
    this.requestDirection(action);
  }

  private startNewGame() {
    this.level = 1;
    this.lives = 3;
    this.score = 0;
    this.callsign = "";
    this.qualifiesForHighScore = false;
    this.settingsOpen = false;
    this.startLevel();
  }

  private startLevel() {
    this.board.reset();
    this.player = { x: Math.floor(this.board.width / 2), y: 0, direction: null };
    this.requestedDirection = null;
    this.stepAccumulator = 0;
    this.timeRemaining = 90;
    this.statusLine = "";
    this.almostThereAnnounced = false;
    this.seaEnemies = this.createSeaEnemies();
    this.railEnemies = this.createRailEnemies();
    this.mode = "playing";
    this.showToast("BEGIN", `STAGE ${String(this.level).padStart(2, "0")} · SKILL ${this.skill}`, "begin", 1.25);
  }

  private setupDemoBoard() {
    this.board.createDemoLayout();
    this.player = { x: 12, y: 0, direction: "down" };
    this.seaEnemies = [
      { x: 41, y: 23, dx: -1, dy: -1 },
      { x: 33, y: 25, dx: 1, dy: -1 },
    ];
    this.railEnemies = [{ x: 0, y: 8, dx: 0, dy: 1 }];
    this.demoTargetIndex = 0;
    this.statusLine = "AUTOPILOT RUNNING";
  }

  private createSeaEnemies(): Enemy[] {
    const total = Math.min(5, 3 + Math.floor((this.level - 1) / 2));
    const placements = [
      [39, 8, -1, 1],
      [32, 23, 1, -1],
      [43, 17, -1, -1],
      [24, 10, 1, 1],
      [19, 25, -1, 1],
    ];
    return placements.slice(0, total).map(([x, y, dx, dy]) => ({ x, y, dx, dy }));
  }

  private createRailEnemies(): Enemy[] {
    const total = Math.min(3, Math.floor(this.level / 2));
    const placements = [
      [0, 7, 0, 1],
      [51, 21, 0, -1],
      [22, 0, 1, 0],
    ];
    return placements.slice(0, total).map(([x, y, dx, dy]) => ({ x, y, dx, dy }));
  }

  private driveDemo() {
    const target = this.demoTargets[this.demoTargetIndex];
    if (!target) return;
    if (this.player.x === target.x && this.player.y === target.y) {
      this.demoTargetIndex += 1;
      return;
    }
    if (this.player.x < target.x) this.requestedDirection = "right";
    else if (this.player.x > target.x) this.requestedDirection = "left";
    else if (this.player.y < target.y) this.requestedDirection = "down";
    else if (this.player.y > target.y) this.requestedDirection = "up";
  }

  private step() {
    this.simulationTick += 1;
    this.movePlayer();
    if (this.mode !== "playing") return;
    const enemyEvery = this.skill >= 7 ? 1 : this.skill >= 4 ? 2 : 3;
    if (this.simulationTick % enemyEvery !== 0) return;
    this.moveSeaEnemies();
    if (this.mode !== "playing") return;
    this.moveRailEnemies();
  }

  private movePlayer() {
    const requested = this.requestedDirection;
    let direction = this.player.direction;
    const onLand = this.board.get(this.player.x, this.player.y) === Cell.Land;
    if (requested && (onLand || !direction || !isOpposite(direction, requested))) {
      direction = requested;
    }
    if (!direction) return;
    const vector = DIRECTION_VECTOR[direction];
    const nextX = this.player.x + vector.x;
    const nextY = this.player.y + vector.y;
    const nextCell = this.board.get(nextX, nextY);
    if (!this.board.inBounds(nextX, nextY) || (!onLand && nextCell === Cell.Trail)) return;
    if (onLand && nextCell !== Cell.Land) {
      this.statusLine = "LIVE TRAIL EXPOSED";
      this.emitSfx("trail");
    }

    this.player.direction = direction;
    this.player.x = nextX;
    this.player.y = nextY;
    if (nextCell === Cell.Sea) this.board.set(nextX, nextY, Cell.Trail);
    if (!onLand && nextCell === Cell.Land) this.completeClaim();
    this.checkPlayerAgainstEnemies();
  }

  private completeClaim() {
    const newCells = this.board.claimOutsideEnemyReach(this.seaEnemies);
    const multiplier = 8 + this.level * 2 + this.skill;
    this.score += newCells * multiplier;
    this.statusLine = newCells > 0 ? `SECTOR CLAIMED +${newCells * multiplier}` : "CUT CLOSED";
    this.effect = { kind: "closed", x: this.player.x, y: this.player.y, startedAt: this.visualTime };
    this.emitSfx("close");
    this.showToast("CLOSED", newCells > 0 ? `+${newCells * multiplier} SCORE` : "ROUTE SEALED", "closed", 0.9);
    if (this.claimed >= 0.75 && !this.almostThereAnnounced) {
      this.almostThereAnnounced = true;
      this.showToast("ALMOST THERE", `${Math.floor(this.claimed * 100)}% CAPTURED`, "almost", 1.35);
    }
    if (this.claimed * 100 >= this.target) {
      this.score += Math.ceil(this.timeRemaining) * (20 + this.skill * 3);
      this.mode = "levelClear";
      this.stateTimer = 1.35;
      this.statusLine = "TARGET SECURED";
      this.showToast("WELL DONE", "NEXT STAGE", "stage", 1.3);
      this.emitSfx("clear");
    }
  }

  private moveSeaEnemies() {
    for (const enemy of this.seaEnemies) {
      const candidateX = enemy.x + enemy.dx;
      const candidateY = enemy.y + enemy.dy;
      if (this.board.get(candidateX, candidateY) === Cell.Trail) {
        this.loseLife("SEA CONTACT ON LIVE TRAIL");
        return;
      }
      if (this.board.get(candidateX, enemy.y) !== Cell.Sea) enemy.dx *= -1;
      if (this.board.get(enemy.x, candidateY) !== Cell.Sea) enemy.dy *= -1;
      const nextX = enemy.x + enemy.dx;
      const nextY = enemy.y + enemy.dy;
      if (this.board.get(nextX, nextY) === Cell.Trail) {
        this.loseLife("SEA CONTACT ON LIVE TRAIL");
        return;
      }
      if (this.board.get(nextX, nextY) === Cell.Sea) {
        enemy.x = nextX;
        enemy.y = nextY;
      }
    }
    this.checkPlayerAgainstEnemies();
  }

  private moveRailEnemies() {
    for (const enemy of this.railEnemies) {
      const nextX = enemy.x + enemy.dx;
      const nextY = enemy.y + enemy.dy;
      if (this.board.get(nextX, nextY) !== Cell.Land) {
        const turns = [
          { dx: -enemy.dy, dy: enemy.dx },
          { dx: enemy.dy, dy: -enemy.dx },
          { dx: -enemy.dx, dy: -enemy.dy },
        ];
        const turn = turns.find((option) => this.board.get(enemy.x + option.dx, enemy.y + option.dy) === Cell.Land);
        if (turn) {
          enemy.dx = turn.dx;
          enemy.dy = turn.dy;
        }
      }
      if (this.board.get(enemy.x + enemy.dx, enemy.y + enemy.dy) === Cell.Land) {
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;
      }
    }
    this.checkPlayerAgainstEnemies();
  }

  private checkPlayerAgainstEnemies() {
    const playerCell = this.board.get(this.player.x, this.player.y);
    if (playerCell === Cell.Trail && this.seaEnemies.some((enemy) => enemy.x === this.player.x && enemy.y === this.player.y)) {
      this.loseLife("SEA CONTACT ON LIVE TRAIL");
      return;
    }
    if (playerCell === Cell.Land && this.railEnemies.some((enemy) => enemy.x === this.player.x && enemy.y === this.player.y)) {
      this.loseLife("RAIL CONTACT");
    }
  }

  private loseLife(reason: string) {
    if (this.mode !== "playing") return;
    this.lives -= 1;
    this.statusLine = reason;
    this.effect = { kind: "busted", x: this.player.x, y: this.player.y, startedAt: this.visualTime };
    this.emitSfx("busted");
    this.showToast("BUSTED", this.lives > 0 ? "REBUILDING SAFE RAIL" : "LAST LIFE LOST", "busted", 1.05);
    if (this.lives <= 0) {
      this.mode = "gameOver";
      this.qualifiesForHighScore = this.scoreStore.qualifies(this.score);
      this.callsign = "";
      return;
    }
    this.mode = "lost";
    this.stateTimer = 1.05;
  }

  private finishGameOver() {
    if (this.qualifiesForHighScore) {
      this.scoreStore.submit(this.callsign, this.score);
      this.qualifiesForHighScore = false;
      this.callsign = "";
    }
    this.mode = "title";
    this.statusLine = "DEPLOY WHEN READY";
  }

  private showToast(title: string, detail: string, kind: ToastKind, duration: number) {
    this.toast = { title, detail, kind, startedAt: this.visualTime, duration };
  }

  private emitSfx(name: SfxName) {
    this.soundEventId += 1;
    this.soundEvent = { id: this.soundEventId, name };
  }
}
