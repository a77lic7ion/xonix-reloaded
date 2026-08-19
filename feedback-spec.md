# Motion and Haptic Feedback Specification

Capture feedback is deliberately light: a **180 ms** decaying diagonal shake reinforces the closure flash without destabilizing precise play. On devices supporting vibration, it uses a small `[10, 25, 14]` pattern that reads as two compact confirmation taps.

BUSTED feedback is stronger but still brief: a **420 ms** decaying horizontal-biased shake gives the collision impact weight, paired with a `[35, 28, 65]` vibration pattern. The feedback manager avoids accidental activation on every frame by consuming each game effect once.

Both effects respect `prefers-reduced-motion`. They are also gated by the game’s existing SFX preference, so players can silence audiovisual event feedback from the current Settings menu. Browsers without `navigator.vibrate` retain screen shake only.
