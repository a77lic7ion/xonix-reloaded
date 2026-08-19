# Xonix: Modern Rebuild — Design Directions

## Three possible directions

### Approach 1
**Theme Name:** Liquid Blueprint

**Very Brief Intro:** A calm technical cartography aesthetic in mineral blue, porcelain, and electric orange, treating every territorial cut as a plotted route across a living nautical chart. It makes a high-pressure arcade game feel precise rather than frantic.

**Probability:** 0.071

### Approach 2
**Theme Name:** Cabinet Afterglow

**Very Brief Intro:** An amber-and-cobalt reinterpretation of a late-night arcade control panel, with tactile labels and illuminated score hardware. It takes nostalgic cues from the era without recreating a faux CRT screen.

**Probability:** 0.038

### Approach 3
**Theme Name:** Paper Circuit

**Very Brief Intro:** A graphic editorial game surface where the field resembles a screen-printed technical poster, with crisp inked vectors, natural paper grain, and purposeful blocks of colour. This direction foregrounds legibility on a small touch screen.

**Probability:** 0.086

---

# Selected Direction: Liquid Blueprint

## Design Movement

**Post-war information design reinterpreted as a contemporary arcade instrument panel.** The game field is a piece of active cartography: ocean-like unclaimed territory, charted land, measured grid marks, and accurate but playful technical labels. This is not a pixel-art or neon-cyberpunk treatment.

## Core Principles

1. **Gameplay is the hero.** The field claims most of the screen; all chrome is compact, anchored to its edges, and never competes with movement.
2. **Readable pressure.** Enemy state, lives, safe border, vulnerable trail, and claimed land have unmistakably different materials and colours at a glance.
3. **Honest tactility.** Fine rules, numeric labels, shallow inset surfaces, and deliberate hard edges provide physicality without skeuomorphism.
4. **Mobile as a first-class format.** The portrait layout makes room for two-handed touch controls while retaining a generously sized playing field.

## Color Philosophy

The core palette evokes **a coastal survey map under protective glass**: deep Prussian blue frames the experience and grounds the eye; a mineral cyan sea lets enemies remain visible; pale charted territory creates a high-contrast record of player success. **Signal orange** is the ownable danger-and-action colour: it marks the player, their vulnerable trail, the current touch direction, and urgent prompts. Saturated red is reserved for imminent failure, not decoration.

## Layout Paradigm

The experience is an **instrument strip wrapped around a central field**, rather than a stack of cards. A narrow score rail sits above the arena; the field itself sits in a broad, offset technical frame; a thumb-zone control dock attaches below it on phones. On larger screens, the side annotations migrate into the left and right margins of the field, preserving the arena as the visual centre of gravity.

## Signature Elements

1. **Survey ticks:** sparse coordinate ticks and small measurement labels around the arena frame.
2. **Claim texture:** captured land uses a warm off-white field with a subtle stipple/technical-paper grain, while the sea remains smooth cyan.
3. **Vector trail:** an orange live-cut line with a small square pilot marker and a restrained sweeping pulse, visually distinct from the blue safe border.

## Interaction Philosophy

Every input should resemble operating a precise instrument. Directional controls respond immediately with a short physical press, keyboard controls are always available, and a clear pause affordance is present. Claim completion earns a confident field-fill animation; collisions create a brief, sharply bounded warning rather than a distracting screen shake.

## Animation

Movement is discrete and crisp, matching the original grid logic. The live trail receives a 650ms travelling glint, enemies have calm continuous motion, and a newly claimed region fades from cyan to chart-paper over 220ms with a very subtle ink-spread edge. Controls use 120–160ms press transitions; panels may enter with a 180ms opacity-and-translate transition. All nonessential animation is disabled under `prefers-reduced-motion`.

## Typography System

**Space Grotesk** provides the navigational title, numeric score, and concise labels because its engineered geometry supports the instrument-panel motif. **IBM Plex Mono** handles statistics, coordinates, tutorial notation, and small metadata at a larger-than-usual small-screen size. Headlines are tight and assertive; gameplay values use tabular numerals; sentence copy stays spare and instructional.

## Brand Essence

**Xonix is a precision territory-capture arcade game for players who want original rules with a clearer, touch-native interface.**

Personality adjectives: **exact, kinetic, charted.**

## Brand Voice

Headlines are directive and economical. Calls to action name the concrete action, and microcopy describes risk without theatrics.

> “Trace a route. Lock the water out.”

> “Outside the rail, your line is exposed.”

## Wordmark & Logo

The wordmark uses a bespoke square-cut construction: the **X** is built from two opposing mapped routes, with the **O** represented as a contained territory cell. The accompanying mark is a bold orange square track interrupted by a cyan diagonal cut—recognisable at favicon scale and independent of text.

## Signature Brand Color

**Signal Vermilion — `#FF6B35`**: the unmistakable Xonix action colour used only for active traversal, focus, and meaningful urgency.
