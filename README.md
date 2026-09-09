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

## Changes from the Flash version

- **Save data** uses `localStorage` instead of a Flash SharedObject.
- **Premium content is all unlocked.** The original sold the 5x5/6x6 level packs and the level editor through MochiCoins; that service (and Kongregate's API) no longer exists, so everything is free.
- **Custom levels are stored locally.** The original uploaded/downloaded custom levels via thewasabiproject.com, which is no longer online. The level editor now saves levels to `localStorage`, and the Custom Levels menu plays them from there. The level data format ("size,blocks...,structures...,roofs...") is unchanged.
- MochiBot analytics, MochiAds, and the site-lock check were dropped.

## Credits

- Game design & code: Charles Berube / The Wasabi Project
- Graphics from the PlanetCute set and gameplay inspired by the CuteGod design, both by Daniel Cook (http://lostgarden.com)
