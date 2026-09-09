# Benevolence — Changelog

## Unreleased

- Blocks now slide into place with a quick animation; the board ignores clicks
  while a block is moving.
- Another fix for the puzzle board sometimes rendering blank until the first
  click.

## 3.1.1 — 2026-09-08

- Fixed the puzzle tiles sometimes not showing up until you clicked the board.

## 3.1.0 — 2026-09-08

- New animated background: soft blue clouds that gently drift and billow,
  replacing the old tiled sky image.
- The game now fills your whole browser window. The puzzle, character, and
  speech bubble stay centred, the level / moves / time readout sits in the
  top-right corner, and the Return to Title button is in the bottom-left.
- Refreshed the title screen and footer with a lighter look and a new typeface.
- Rebuilt on a modern toolchain (Bun, Vite, TypeScript, React, Mantine) so
  future updates land faster and more reliably.

## 3.0.0

- First web version of Benevolence, ported from the original Flash game. Your
  progress is saved in your browser, every level pack and the level editor are
  unlocked, and custom levels you build are saved locally.
