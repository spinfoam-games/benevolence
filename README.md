# Benevolence (Web Version)

A TypeScript + HTML5 port of the Flash game **Benevolence** by Charles Berube / The Wasabi Project. A Spinfoam Games project.

Match the sliding-tile puzzle to the pattern shown by the character in the corner, and they'll build their home on the tiles you've arranged. Includes 40 standard levels (3x3 through 6x6), a level editor, and custom levels.

## Tech stack

- **Bun** – package manager / task runner
- **Vite** – dev server and production bundler
- **TypeScript** – all game code (`src/`), strict mode

## Running

```
bun install
bun run dev        # dev server on http://localhost:5173/
bun run build      # type-check + production build into dist/
bun run preview    # serve the built dist/
bun run typecheck  # tsc --noEmit only
```

## Project layout

```
index.html            Vite entry, loads src/main.ts
public/assets/         images, fonts, sounds (served verbatim at /assets/...)
src/
  main.ts              bootstrap
  game.ts              Game state machine
  core/                assets, blocks, levels, storage, particles
  ui/widgets.ts        DOM widget helpers
  render/              shared isometric puzzle renderer
  states/              title / playing / editor screens
```

Deploys as a static site (default Cloudflare Pages / Worker pipeline); `base` is
`/` and assets are referenced with root-relative URLs.

### itch.io

```
bun run build:itch    # production build into dist-itch/ with relative asset URLs (--mode itch)
bun run deploy:itch    # build:itch, then `butler push` to spinfoam-games/benevolence:html
```

`deploy:itch` needs [butler](https://itch.io/docs/butler/) on PATH and a one-time
`butler login` (or `BUTLER_API_KEY` set for CI). The itch project (HTML kind,
"played in browser", viewport) is already configured; butler handles every update.

## Cloud background

The page background (`src/background/CloudBackground.tsx`) is a full-viewport
canvas. Each frame it fills a small low-resolution buffer with fractal noise
(`src/background/noise.ts`), maps that through a blue→white ramp, and upscales
it with smoothing — the blur is what makes it read as soft clouds. Hidden tabs
pause the animation and `prefers-reduced-motion` renders a single static frame.

Tuning constants at the top of `CloudBackground.tsx`:

| Constant | Effect |
| --- | --- |
| `BASE_R` / `BASE_G` / `BASE_B` | The sky colour shown between clouds (the cloud colour is always white). Keep it in sync with the `#8ccde9` fallback on `html, body` in `src/style.css`. |
| `LOW_EDGE` | Noise below this is clear sky. Lower it for more cloud coverage (~0.40 is noticeably cloudier). |
| `HIGH_EDGE` | Noise above this is solid white. The gap between `LOW_EDGE` and `HIGH_EDGE` is the softness of the cloud edges — widen it for wispier clouds, narrow it for more defined ones. |
| `DRIFT_X` / `DRIFT_Y` | How fast the cloud field scrolls across the screen, in noise units per second. |
| `EVOLVE` | How fast cloud shapes morph over time (the third, animated noise axis). `0` makes clouds only slide without changing shape; larger values billow faster. |
| `CLOUD_SPAN` | How much noise space the long screen edge covers. Larger → more, smaller cloud masses; smaller → fewer, bigger ones. |
| `TARGET_FPS` | Redraw cap. Lowering it cuts CPU use at the cost of smoothness. |

Two more knobs, both a detail-vs-CPU trade-off (fractal noise is evaluated once
per buffer pixel per frame):

- The buffer resolution — the `step` divisor and the `220 × 150` cap in
  `resize()`. Larger buffer = finer clouds, more cost.
- The `octaves` argument to `noise.fbm()` (default `3`) — more octaves add finer
  wisps.

The noise seed passed to `new ValueNoise3D(...)` picks which cloud pattern you
get; change it for a different-looking sky.

## Changes from the Flash version

- **Save data** uses `localStorage` instead of a Flash SharedObject.
- **Premium content is all unlocked.** The original sold the 5x5/6x6 level packs and the level editor through MochiCoins; that service (and Kongregate's API) no longer exists, so everything is free.
- **Custom levels are stored locally.** The original uploaded/downloaded custom levels via thewasabiproject.com, which is no longer online. The level editor now saves levels to `localStorage`, and the Custom Levels menu plays them from there. The level data format ("size,blocks...,structures...,roofs...") is unchanged.
- MochiBot analytics, MochiAds, and the site-lock check were dropped.

## Credits

- Game design & code: Charles Berube / The Wasabi Project
- Graphics from the PlanetCute set and gameplay inspired by the CuteGod design, both by Daniel Cook (http://lostgarden.com)
