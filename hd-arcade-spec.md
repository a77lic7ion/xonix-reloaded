# HD Arcade Presentation Specification

The faithful **52 × 32 logical grid** remains the source of gameplay truth, but its presentation moves from a 320 × 200 output buffer to a high-resolution 1280 × 800 surface. This preserves the original 4:3 composition and proportions while allowing anti-aliased typography, delicate line work, legible micro-HUDs, layered gradients, and clean motion.

| Element | HD treatment |
|---|---|
| Safe rail and claimed area | Mineral-teal perimeter with a low-glow inner line; claimed sectors gain a deep ocean fill with fine contour lines. |
| Sea | Near-black navy with restrained moving pinprick particles, never a flat void. |
| Player | Violet-to-magenta square pilot with a white core and directional notch. |
| Sea enemy ball | Luminous cyan orb with a small glass highlight and a soft halo. |
| Rail enemy | Coral-pink diamond with a dark centre, visually separate from both player and sea ball. |
| Live trail | Hot amber line with a bright leading edge; danger reads instantly without confusing it with the player. |
| Type | Space Grotesk for high-impact headers and IBM Plex Mono for HUD values, both rendered at HD resolution. |
| Feedback | `BEGIN`, `CLOSED`, `ALMOST THERE`, `BUSTED`, and `WELL DONE — NEXT STAGE` appear as concise framed toasts that animate in and dissolve without blocking play. |

Particle effects are tied to gameplay moments, not decoration. A completed capture releases teal-and-amber particles from the closure point; a loss bursts coral fragments; the safe rail maintains only a subtle ambient sparkle. This keeps the modern presentation responsive while preserving the original game’s sparse tension.
