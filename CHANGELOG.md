# Changelog

All notable changes to Benevolence (web version) are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).
Changes accumulate under **Unreleased**; when the project version is bumped they
move under a new `## [x.y.z] - YYYY-MM-DD` heading.

## [Unreleased]

### Added

- Bun + Vite + TypeScript toolchain (`bun run dev` / `build` / `preview` /
  `typecheck`).
- React + Zustand app shell. The title screen and its Standard Levels / Custom
  Levels overlays are React components; a Zustand store owns screen navigation.
- Animated cloud background: a full-page canvas renders a low-resolution
  fractal-noise buffer each frame (soft blue → white, drifting and slowly
  evolving) and upscales it with smoothing. Throttled to 30 fps, pauses on
  hidden tabs, and honours `prefers-reduced-motion`.

### Changed

- Source restructured from `js/` script files into ES modules under `src/`
  (`core/`, `ui/`, `render/`, `states/`, `background/`).
- Assets moved to `public/assets/` and referenced with root-relative URLs.
- The game fills the whole page instead of a centred 600×600 box. In the
  playing state the stats HUD is pinned to the page's top-right corner and the
  Return to Title button to the bottom-left, while the puzzle, character, and
  speech bubble stay in a fixed 600×600 region centred on the page.
- The playing and editor screens keep their imperative canvas renderers but are
  now mounted/unmounted by React bridge components.

### Removed

- Tiled `Background.png` (replaced by the animated cloud background).

## [3.0.0]

- Initial JavaScript + HTML5 port of the Flash game **Benevolence**. Save data
  uses `localStorage`, all premium content is unlocked, and custom levels are
  stored locally. See `README.md` for the full list of changes from the Flash
  version.

[Unreleased]: https://github.com/cberube/benevolence/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/cberube/benevolence/releases/tag/v3.0.0
