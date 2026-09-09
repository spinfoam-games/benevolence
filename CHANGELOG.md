# Benevolence — Changelog

## Unreleased

## 3.2.0 — 2026-09-08

- Blocks now slide into place with a quick animation, and the board ignores
  clicks while a block is moving.
- Fixed the puzzle board sometimes staying blank until the first click.

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
