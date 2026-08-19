# Original Xonix Screen Specification

The revision treats the 320 × 200 DOS frame as the composition reference, not merely a colour reference. The original has one dominant playfield, one narrow status line, and almost no surrounding interface. On mobile, the same hierarchy will occupy the full portrait frame: the black playfield will take nearly all available height, while a compact status strip will remain attached directly below it.

| Original element | Rebuild decision |
|---|---|
| Large black sea field bounded by a thick cyan rail | A full-height black grid field with a 10–14 px bright-cyan border, leaving no cards or side panels. |
| Tiny cyan balls in mostly empty black space | Larger cyan enemy balls with clear 20–28 px silhouettes and deliberately slower movement. |
| Cyan land/fill walls and magenta exposed cut | Cyan claimed routes remain safe; a strongly contrasted magenta trail remains dangerous. |
| One black status line below the field | A single attached strip reading `Score`, `Xn`, `Full`, and `TIME`, in that original order. |
| Sparse title screen with XONIX logo and skill prompt | A black title state with a large violet-blue XONIX wordmark and the original-style `Enter skill (1-9) <5>:` selector at the bottom. |

The player, enemies, and trail must remain visible at a glance. Simulation starts at a slower fixed step and increases only modestly with skill and level. A discrete swipe anywhere in the playfield queues a direction; no arrow dock, keyboard prompt, or secondary navigation chrome appears in the playable frame.

## Reference

[1]: https://www.mobygames.com/game/46702/xonix/screenshots/dos/442225/ "MobyGames — Xonix DOS in-game screen"

[2]: https://www.mobygames.com/game/46702/xonix/screenshots/ "MobyGames — Xonix DOS screenshot gallery"
