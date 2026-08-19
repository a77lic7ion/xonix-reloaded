# Xonix CGA Render Specification

The game will draw into a **320 × 200 internal canvas** using only the original four-colour CGA-style role set: black (`#000000`) for sea and background, cyan (`#00AAAA`) for safe rail, claimed area, and sea balls, magenta (`#AA00AA`) for the player and live cut, and white (`#FFFFFF`) for score text. The game remains modern in its responsive shell, accessible input model, and crisp motion—not by adding visual noise or a fake CRT filter.

| Context | Scaling rule |
|---|---|
| Desktop landscape | Render the 320 × 200 frame into a centred 4:3 presentation area, vertically stretching the 200-line buffer to 240 logical display lines where room permits. Preserve nearest-neighbour pixels. |
| Phone portrait | Fit the complete 4:3 frame within the available width and reserve the remaining height as an unobtrusive black surround. The playable field remains large, but is never cropped or distorted. |
| High-density display | Keep the source texture at 320 × 200, disable smoothing, and allow integer-like scale steps where possible. |

The physical game board occupies a large rectangle inside the 320 × 200 screen. A short status strip below it carries `Score`, `Xn`, `Full`, and `TIME`. The renderer maps the current logical grid into this compact board area, so original proportions are maintained while player and enemy cells are still visibly distinct on modern phones.

Keyboard arrows and four-direction swipes both feed the same direction queue. No graphical arrow-key dock or controller overlay is present.
