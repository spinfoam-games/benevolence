//	Shared isometric puzzle renderer (the drawPuzzle logic from
//	PlayingState.as / EditorState.as)
var PuzzleRenderer = {
	//	options: { selectedOffset, selectorRaised } for the editor's hover selector
	draw: function (ctx, puzzleSize, puzzleTop, puzzleLeft, blocks, structures, drawStructures, structureVisible, scale, options) {
		options = options || {};

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		for (var y = 0; y < puzzleSize; y++) {
			var blockY = y * (Block.BlockHeight * scale) + puzzleTop;

			for (var x = 0; x < puzzleSize; x++) {
				var blockX = x * (Block.BlockWidth * scale) + puzzleLeft;
				var offset = y * puzzleSize + x;
				var type = blocks[offset];

				//	Don't draw the empty slot
				if (type === -1) continue;

				var img = Block.getBlockImage(type);
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
					var selY = (options.selectorRaised && structures[0][offset] > 0)
						? blockY - (Block.BlockTopHeight + Block.BlockRoofHeight) * scale
						: blockY - Block.BlockTopHeight * scale;

					img = Assets.images['Selector'];
					ctx.globalAlpha = 0.5;
					ctx.drawImage(img, blockX, selY, img.width * scale, img.height * scale);
					ctx.globalAlpha = 1.0;
				}
			}
		}
	},

	//	Translate a mouse position (relative to the game area) into a block
	//	offset, or -1 when off the puzzle. Ported from findBlockOffset.
	hitTest: function (x, y, puzzleSize, puzzleTop, puzzleLeft, scale) {
		var skipY = 51 * scale;

		var blockX = Math.floor((x - puzzleLeft) / (Block.BlockTopWidth * scale));
		var blockY = Math.floor((y - puzzleTop - skipY) / (Block.BlockHeight * scale));

		if (blockX < 0 || blockX > puzzleSize - 1 || blockY < 0 || blockY > puzzleSize - 1) {
			return -1;
		}

		return blockY * puzzleSize + blockX;
	}
};
