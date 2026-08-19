# Game Plan: Xonix — Modern Rebuild

## Risk Tasks

### 1. Territory claim and enemy-preserving flood fill
- **Why isolated:** A completed cut must capture exactly the region that does not contain a sea enemy; treating the trail as passable or leaving temporary trail cells behind would corrupt every later move.
- **Approach:** Represent the board as a small typed grid with `sea`, `land`, and `trail` cells. When the player re-enters land, flood-fill from every sea enemy across sea cells, convert all unvisited sea/trail cells to land, then restore the sea region and recalculate the claimed percentage.
- **Verify:** A vertical and a horizontal cut both capture the side without a sea enemy; temporary trail cells disappear after closure; a sea enemy never renders inside newly claimed land.

### 2. Fixed-step movement and collision order
- **Why isolated:** Both enemy surfaces and the player share grid cells; a large render-frame delta could skip a collision or allow a player to reverse into an invalid perpendicular route.
- **Approach:** Advance the simulation through capped fixed timesteps. Process requested directional changes, player movement, sea-enemy movement, rail-enemy movement, trail checks, then player collision. Enforce 90-degree direction changes and state-specific surface constraints.
- **Verify:** A directional swipe takes effect at the next grid step; sea enemies kill an exposed trail and rail enemies can kill a player on land; collision never disappears when the browser stutters.

## Main Build

Build a self-contained, full-height portrait Babylon canvas that renders a 2D Liquid Blueprint instrument panel. The game includes a title state with skill selection, a playable fixed grid, a compact score/time/lives/claimed HUD, pause and game-over states, an 80% level goal, locally persisted high scores, and swipe-only touch steering across the entire field. A deterministic `?demo` mode will move and cut automatically for visual inspection.

- **Assets needed:** The generated-art quota was unavailable during this build, so the field, technical-paper texture, brand mark, enemies, and controls are original procedural vector drawings inside the game canvas. They are deliberately geometric gameplay primitives rather than borrowed art or placeholder imagery.
- **Verify:**
  - A deliberate up, down, left, or right swipe anywhere in the game frame changes the pilot’s requested direction, with no visible directional controls or keyboard route.
  - The player can leave land, form a trail, return to land, and claim territory.
  - Sea and rail enemies move on their correct surfaces and remove a life upon collision.
  - Score, lives, timer, claimed percentage, target, level, pause, restart, and high-score flow are visible and readable on phones and desktop.
  - A 9-skill selector affects pace while preserving the original-style play loop.
  - The `?demo` run visibly shows live play and at least one completed territory claim.
  - No visual clipping, control overlap, missing render regions, TypeScript errors, or browser-console errors occur during verification.
