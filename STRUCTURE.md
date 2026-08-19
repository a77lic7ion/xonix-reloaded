# Xonix: Modern Rebuild — Architecture

## Runtime Boundary

React mounts one lifecycle-safe `GameCanvas` component. Babylon owns the WebGL canvas, a single 2D camera, and one `DynamicTexture` that contains the entire Liquid Blueprint game surface. Gameplay code is framework-independent and resides in `client/src/game/`.

```text
GameCanvas.tsx
  └── scene.ts
        └── GameWorld
              ├── GridBoard
              ├── InputManager
              ├── SeaEnemy[]
              ├── RailEnemy[]
              ├── ScoreStore
              └── CanvasRenderer
```

## Modules

| Module | Responsibility |
|---|---|
| `scene.ts` | Creates and disposes the Babylon scene, 2D camera, texture-backed plane, and world update loop. |
| `GameWorld.ts` | Explicit title, play, paused, level-clear, and game-over state machine; fixed-step simulation and rules orchestration. |
| `GridBoard.ts` | Grid cells, surface checks, flood fill, claimed-percentage calculation, and layout reset. |
| `InputManager.ts` | Semantic directions, whole-frame swipe recognition, tap actions, and pointer-listener cleanup. |
| `entities.ts` | Player and two enemy data models with position, direction, and pace. |
| `CanvasRenderer.ts` | Pure 2D drawing for the portrait technical frame, HUD, full-height board, player, trail, enemies, overlays, and swipe-led composition. |
| `ScoreStore.ts` | Local-only top-ten persistence and qualifying-score insertion. |

## Core Data Model

`Cell = Sea | Land | Trail`. A player is safe on `Land` and exposed on `Sea`/`Trail`; a sea enemy can move only on `Sea`; a rail enemy can move only on `Land`. The board is reset for each level while score, lives, selected skill, and high-score eligibility remain world-level state.

## Asset Hints

The design uses deliberately procedural primitives: a textured cyan sea, stippled ivory land, cobalt safe rail, orange vector trail, navy sea discs, red rail diamonds, and an orange/cyan geometric brand mark. These are all drawn at device resolution by `CanvasRenderer` so that they remain crisp at full mobile height. The interactive surface is intentionally unobstructed: swipes anywhere outside the compact pause action steer the player. No external art is loaded.
