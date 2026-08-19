# Supplied Media Integration Specification

The supplied title image is a **1310 × 816** illustrated arcade panel. The title screen will display it as a responsive, cover-fitted right-side hero illustration within the game’s 4:3 presentation surface, while the XONIX wordmark and skill command module remain on the left. On narrow screens, the artwork will fade and crop toward the right so the skill selection stays unobstructed and fully tappable.

The seven supplied `.mpeg` files are MP3 audio streams at 128 kbps. They will be renamed to `.mp3` only for correct browser content-type delivery, then hosted as permanent web assets. A music controller will shuffle the tracks using a no-immediate-repeat queue, advance after a track ends, and honour the existing music toggle. Browser autoplay restrictions mean playback begins with the player’s first explicit interaction; the title screen will show its selected track name in a discreet status line.

| Asset group | Integration |
|---|---|
| Hero artwork | Responsive title-panel background with a left-to-right readability gradient and no loss of the skill controls. |
| Seven MP3 tracks | Shuffled background playlist with no immediate repeat, start-on-interaction playback, and persisted in-session music toggle. |
| SFX setting | Retained as a future-ready toggle; no generated or placeholder SFX are added in this revision. |
