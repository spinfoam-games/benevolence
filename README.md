# Benevolence (Web Version)

A JavaScript + HTML5 port of the Flash game **Benevolence** by Charles Berube / The Wasabi Project.

Match the sliding-tile puzzle to the pattern shown by the character in the corner, and they'll build their home on the tiles you've arranged. Includes 40 standard levels (3x3 through 6x6), a level editor, and custom levels.

## Running

Serve the folder with any static web server and open `index.html`, e.g.:

```
python -m http.server 8000
# then browse to http://localhost:8000/
```

(Opening `index.html` directly from disk also works in browsers that allow canvas image drawing from `file://`, but a local server is the reliable path.)

## Changes from the Flash version

- **Save data** uses `localStorage` instead of a Flash SharedObject.
- **Premium content is all unlocked.** The original sold the 5x5/6x6 level packs and the level editor through MochiCoins; that service (and Kongregate's API) no longer exists, so everything is free.
- **Custom levels are stored locally.** The original uploaded/downloaded custom levels via thewasabiproject.com, which is no longer online. The level editor now saves levels to `localStorage`, and the Custom Levels menu plays them from there. The level data format ("size,blocks...,structures...,roofs...") is unchanged.
- MochiBot analytics, MochiAds, and the site-lock check were dropped.

## Credits

- Game design & code: Charles Berube / The Wasabi Project
- Graphics from the PlanetCute set and gameplay inspired by the CuteGod design, both by Daniel Cook (http://lostgarden.com)
