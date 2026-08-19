# Xonix Build Memory

## Source and fidelity decisions

- The supplied DOS files are retained as a non-executed behavioural reference. Their embedded strings confirm skill selection (1–9), score, full/claimed percentage, timer, a top-ten high-score table, name entry, and replay flow.
- Historical catalogues verify a Qix-style fixed top-down game: draw into the field, avoid threats in the drawable space and margins, and fill a target percentage to advance.
- Retronix provides an open-source mechanics comparison: sea enemies traverse unclaimed sea, land enemies traverse claimed rail/land, and capture preserves the sea region connected to enemy positions.
- No trustworthy published original 1984 source listing was found; this is an independent implementation, not a code copy.

## Product decisions

- Visual direction is **Liquid Blueprint**. The arena is a technical cartography instrument, not a retro CRT recreation.
- Controls must work with cursor keys and touch. Enter starts/selects; Escape pauses; WASD is a modern secondary keyboard option.
- The visual-asset generation request was blocked by the account’s daily limit. Original procedural canvas artwork is used instead of borrowed images or placeholder media.

## Verification reminders

- Test a successful closure with enemies on one side of the cut.
- Test a sea enemy touching the live trail and a rail enemy touching the player.
- Check portrait touch-control hit regions and desktop keyboard focus.
- Use `?demo` for a deterministic screenshot of active gameplay.

