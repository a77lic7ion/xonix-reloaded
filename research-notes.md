# Historical Xonix Research Notes

## Recoverable supplied-package findings

The supplied archive is a working-era DOS package rather than readable source. `xonix.exe`, `xonix.se`, and `basrun.exe` are MS-DOS MZ executables, while `xonix.bin` appears to be the packaged gameplay payload invoked by the launcher. The executable contains the labels `Enter skill (1-9) <5>`, `HISCORES TABLE`, `Score:`, `Full:`, `TIME:`, `SCORE:`, a top-ten qualification prompt, a name-entry prompt, and an explicit replay prompt. The high-score file is line-oriented text containing ten name-and-score entries. The package is treated as a behavioural reference, not executed or copied.

## Verified rules to preserve

| Rule | Rebuild interpretation | Evidence |
|---|---|---|
| The player operates in a fixed top-down field. | A rectangular canvas is the primary interaction surface. | [1] [2] |
| The goal is to draw into the main field and close a route to capture territory. | A player may leave only from a safe border/claimed cell and must return to a safe cell to trigger a claim. | [1] [2] [3] |
| There are threats in both the drawable field and the margins. | Sea enemies collide with the exposed live trail; border/rail enemies collide with the player while travelling on a safe route. | [1] [2] |
| Capturing a target percentage advances the level. | Claimed-area percentage is continuously calculated, with an 80% stage target for this rebuild. | [1] [3] |
| The DOS package supports skill selection and displays score, filled percentage, time, high scores, and replay. | The modern interface retains a difficulty selector, score, claimed percentage, countdown, lives, local top scores, and play-again flow. | Supplied package inspection |
| Original-style operation uses cursor keys; Enter starts/selects and Escape pauses. | Keyboard support follows those controls; touch controls provide a mobile equivalent. | [4] |
| Sea and rail enemies occupy different native surfaces. | Sea enemies move only through unclaimed cells and invalidate an exposed live trail; rail enemies move only along claimed/border cells and can hit the player there. | [5] |
| A completed cut should keep the region connected to a sea enemy and convert the other side into land. | The claim algorithm flood-fills from all sea enemies after a cut; all unmarked unclaimed cells become captured land. | [5] |

## Source-code status

No published original 1984 source listing was identified in the initial research. However, the supplied DOS package provides authentic naming and UI evidence, while **Retronix** is a documented open-source implementation explicitly based on the Ilan Rav and Dani Katz game. It will be used only as a mechanics comparison; the remake will be independently implemented.

## Original screen-composition findings

The original gameplay screen is a **320 × 200 landscape display**. A large black rectangular playfield occupies almost the entire upper screen, bounded by a thick bright-cyan rail. Its lower edge is followed immediately by a single black status line reading, from left to right, `Score`, `Xn`, `Full`, and `TIME`. There are no side panels, card surfaces, decorative textures, or persistent touch controls. The field begins almost flush with the screen margins and is intentionally sparse: small cyan balls traverse the black sea, while a cyan fill line and magenta exposed trail provide the active visual contrast. [6]

The original title screen is likewise sparse. It places a large blinking blue/purple `XONIX` wordmark on black, credits beneath it, and a simple `Enter skill (1-9) <5>:` prompt along the bottom. The rebuild revision will use this layout as ground truth: a landscape, playfield-first game screen with one compact status strip and a separate low-chrome title state. [7]

## Live js-dos reference observations

The live original provided at `js-dos.com/xonix` executes the DOS program in a **640 × 400 emulator container**, preserving the original 320 × 200 presentation at a 2× scale. Its initial overlay previews a more specific **version 2.2** title screen: a dotted magenta/pink pixel `XONIX` logo flanked by tall patterned side glyphs, `Ver 2.2` at the lower right, and white credits reading `Made by Ilan Rav` plus `Filling algorithm by Dani Katz`. This confirms that the sparse black background and pixel-led hierarchy are authentic, while giving the revision a stronger title-treatment reference than the earlier gallery screenshot. [8]

The original flow is title → exact console-style prompt `Enter skill (1-9) <5>:` → **HISCORES TABLE**. Entering a skill first shows the high-score table alone on black; it is headed by a centered `HISCORES TABLE` label and lists numbered placements with zero scores before the first field appears. This intermediate screen should be considered for the remake’s start flow rather than jumping directly from the title state into active play. [8]

At default skill 5, the first live field begins with a **black sea**, an extremely thick turquoise/cyan outer rail and a thin magenta rule immediately above the status row. The sea contains three tiny cyan ball enemies, while the player begins on the cyan upper rail. The compact white status string is exactly `Score: 0    Xn: 3    Full: 0%    TIME: 90`; the original therefore starts the first level with **90 seconds**, not a longer adaptive timer. [8]

The running version confirms a four-colour CGA-like treatment: black background and sea, cyan rail/land/enemies, magenta player or exposed trail, and white status text. The 320 × 200 game picture is presented in a 640 × 400 2× browser container, so pixels remain hard-edged. Its title is animated: the dotted magenta letters assemble vertically before resolving to `XONIX`, so a modern remake may keep a restrained pixel-reveal without adding a CRT filter. [8]

The live original accepts `1` at `Enter skill (1-9) <5>:` and then shows its discrete high-score table before the first field, confirming that skill selection is a separate input step rather than a direct play toggle. [8]

In a live skill-1 run, the first field still begins at `TIME: 90` with three sea balls and a top-rail player. The browser emulator advances while inspected but does not provide a reliable real-time stopwatch because browser inspection and input automation interrupt its frame cadence. The visual run nevertheless confirms the remake’s 0.18-second grid step is perceptibly too slow relative to the original’s continuous, brisk movement, so the revision will use a faster fixed step while keeping the larger mobile-readable markers. [8]

## References

[1]: https://archive.org/details/msdos_Xonix_1984 "Internet Archive — Xonix (1984)"

[2]: https://www.mobygames.com/game/46702/xonix/ "MobyGames — Xonix (1984)"

[3]: https://github.com/UsmanPrime/Xonix-Game "UsmanPrime/Xonix-Game README"

[4]: https://retronix.czak.pl/ "Retronix — original-style controls and attribution"

[5]: https://github.com/czak/retronix "czak/retronix — mechanics comparison source"

[6]: https://www.mobygames.com/game/46702/xonix/screenshots/dos/442225/ "MobyGames — Xonix DOS in-game screen"

[7]: https://www.mobygames.com/game/46702/xonix/screenshots/ "MobyGames — Xonix DOS screenshot gallery"

[8]: https://js-dos.com/xonix/ "js-dos — running original Xonix DOS build"
