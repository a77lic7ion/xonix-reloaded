# Sound Effects Sources and Integration Map

The implementation will use **Kenney’s Creative Commons CC0** audio packs. The Interface Sounds pack contains 100 interaction effects and is suitable for skill controls, settings toggles, and short confirmation cues. The Impact Sounds pack contains 130 effects and is suitable for closure bursts, collision damage, and stronger game-state transitions. Both pages identify their content as CC0. [1] [2]

| Xonix event | Planned source family | Intended character |
|---|---|---|
| Skill/menu selection and settings toggle | Interface Sounds | Short clean UI click or confirmation. |
| Live trail start | Interface Sounds | Brief restrained digital tick. |
| Territory closure | Interface Sounds plus light impact | Brighter confirmation burst. |
| BUSTED / collision | Impact Sounds | Dry, compact glitch-like impact. |
| Stage clear | Interface Sounds | Short success accent. |

The selected files will be hosted as permanent web assets and are triggered only after a player gesture. Their playback is gated by the in-game SFX toggle. Music uses the user-supplied tracks and remains separately controllable.

## References

[1]: https://kenney.nl/assets/interface-sounds "Kenney Interface Sounds — CC0"

[2]: https://kenney.nl/assets/impact-sounds "Kenney Impact Sounds — CC0"
