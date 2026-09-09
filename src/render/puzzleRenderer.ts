//	Shared isometric puzzle renderer (the drawPuzzle logic from
//	PlayingState.as / EditorState.as)
import { Block } from "../core/blocks.ts";
import { Assets } from "../core/assets.ts";

export interface PuzzleRenderOptions {
	//	Editor's hover selector
	selectedOffset?: number;
	selectorRaised?: boolean;
}

export const PuzzleRenderer = {
	draw(
		ctx: CanvasRenderingContext2D,
		puzzleSize: number,
		puzzleTop: number,
		puzzleLeft: number,
		blocks: number[],
		structures: number[][],
		drawStructures: boolean,
		structureVisible: Array<number | undefined>,
		scale: number,
		options: PuzzleRenderOptions = {},
	): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		for (let y = 0; y < puzzleSize; y++) {
			const blockY = y * (Block.BlockHeight * scale) + puzzleTop;

			for (let x = 0; x < puzzleSize; x++) {
				const blockX = x * (Block.BlockWidth * scale) + puzzleLeft;
				const offset = y * puzzleSize + x;
				const type = blocks[offset];

				//	Don't draw the empty slot
				if (type === -1) continue;

				let img = Block.getBlockImage(type);
				ctx.drawImage(img, blockX, blockY, img.width * scale, img.height * scale);

				if (drawStructures && structureVisible[offset]) {
					//	Structures
					if (structures[0][offset] > 0) {
						img = Block.getStructureImage(structures[0][offset]);
						ctx.drawImage(img, blockX, blockY - Block.BlockTopHeight * scale, img.width * scale, img.height * scale);
					}

					//	And the roof
					if (structures[1][offset] > 0) {
						img = Block.getRoofImage(structures[1][offset]);
						ctx.drawImage(img, blockX, blockY - (Block.BlockTopHeight + Block.BlockRoofHeight) * scale, img.width * scale, img.height * scale);
					}
				}

				//	Editor hover selector
				if (offset === options.selectedOffset) {
					const selY = (options.selectorRaised && structures[0][offset] > 0)
						? blockY - (Block.BlockTopHeight + Block.BlockRoofHeight) * scale
						: blockY - Block.BlockTopHeight * scale;

					img = Assets.image("Selector");
					ctx.globalAlpha = 0.5;
					ctx.drawImage(img, blockX, selY, img.width * scale, img.height * scale);
					ctx.globalAlpha = 1.0;
				}
			}
		}
	},

	//	Translate a mouse position (relative to the game area) into a block
	//	offset, or -1 when off the puzzle. Ported from findBlockOffset.
	hitTest(
		x: number,
		y: number,
		puzzleSize: number,
		puzzleTop: number,
		puzzleLeft: number,
		scale: number,
	): number {
		const skipY = 51 * scale;

		const blockX = Math.floor((x - puzzleLeft) / (Block.BlockTopWidth * scale));
		const blockY = Math.floor((y - puzzleTop - skipY) / (Block.BlockHeight * scale));

		if (blockX < 0 || blockX > puzzleSize - 1 || blockY < 0 || blockY > puzzleSize - 1) {
			return -1;
		}

		return blockY * puzzleSize + blockX;
	},
};
