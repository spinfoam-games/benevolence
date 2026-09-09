//	The custom level editor (EditorState.as). Levels are saved to localStorage
//	instead of being uploaded to The Wasabi Project's servers.
var EditorState = {
	MODE_TILES: 0,
	MODE_STRUCTURES: 1,
	MODE_ROOFS: 2,

	root: null,
	canvas: null,
	ctx: null,

	patternSize: 3,
	puzzleScale: 1.0,
	puzzleTop: 50,
	puzzleLeft: 50,
	selectedBlockOffset: -1,

	blocks: null,
	structures: null,
	structureVisible: null,

	mode: 0,
	showStructures: false,

	modeButtons: null,
	nameField: null,
	overlayEl: null,

	show: function () {
		EditorState.mode = EditorState.MODE_TILES;
		EditorState.showStructures = false;
		EditorState.selectedBlockOffset = -1;
		EditorState.overlayEl = null;
		EditorState.createNewPuzzle(3);

		var root = document.createElement('div');
		root.className = 'state editor-state';
		EditorState.root = root;

		var canvas = document.createElement('canvas');
		canvas.width = 600;
		canvas.height = 600;
		canvas.className = 'puzzle-canvas';
		root.appendChild(canvas);
		EditorState.canvas = canvas;
		EditorState.ctx = canvas.getContext('2d');

		//	Right-hand control panel
		var panel = document.createElement('div');
		panel.className = 'editor-panel';

		var controlWidth = 150;

		panel.appendChild(UI.wasabiSeparator('Mode', controlWidth));

		var tilesButton = UI.wasabiButton('Tiles', function () { EditorState.setMode(EditorState.MODE_TILES); }, controlWidth);
		var structuresButton = UI.wasabiButton('Structures', function () { EditorState.setMode(EditorState.MODE_STRUCTURES); }, controlWidth);
		var roofsButton = UI.wasabiButton('Roofs', function () { EditorState.setMode(EditorState.MODE_ROOFS); }, controlWidth);
		EditorState.modeButtons = [tilesButton, structuresButton, roofsButton];
		tilesButton.setSelected(true);

		panel.appendChild(tilesButton);
		panel.appendChild(structuresButton);
		panel.appendChild(roofsButton);

		panel.appendChild(UI.wasabiSeparator('Create', controlWidth));
		[3, 4, 5, 6].forEach(function (size) {
			panel.appendChild(UI.wasabiButton(size + ' x ' + size, function () {
				EditorState.createNewPuzzle(size);
				EditorState.drawPuzzle();
			}, controlWidth));
		});

		panel.appendChild(UI.wasabiSeparator('Level Name', controlWidth));

		var nameInfo = UI.wasabiLabel('left', 12);
		nameInfo.className += ' editor-name-info';
		nameInfo.textContent = 'Only the letters A-Z, digits, and spaces are allowed.';
		panel.appendChild(nameInfo);

		EditorState.nameField = document.createElement('input');
		EditorState.nameField.type = 'text';
		EditorState.nameField.maxLength = 15;
		EditorState.nameField.className = 'editor-name-field';
		panel.appendChild(EditorState.nameField);

		panel.appendChild(UI.wasabiSeparator('Save', controlWidth));
		panel.appendChild(UI.wasabiButton('Save Level', EditorState.trySaveLevel, controlWidth));

		panel.appendChild(UI.wasabiSeparator('Help', controlWidth));
		panel.appendChild(UI.wasabiButton('Help', EditorState.showHelpOverlay, controlWidth));

		root.appendChild(panel);

		//	Return to title button
		var returnButton = UI.hoverButton('Button_Return_Off', 'Button_Return_Over', function () {
			Game.showTitle();
		});
		returnButton.className += ' return-button';
		root.appendChild(returnButton);

		canvas.addEventListener('click', EditorState.click);
		canvas.addEventListener('mousemove', EditorState.mouseMove);
		document.addEventListener('keydown', EditorState.keyDown);

		Game.setState(root);
		EditorState.drawPuzzle();
	},

	//	Called by Game when leaving this state
	shutdown: function () {
		document.removeEventListener('keydown', EditorState.keyDown);
	},

	createNewPuzzle: function (size) {
		EditorState.patternSize = size;

		EditorState.puzzleScale = 1.0;
		if (size === 5) EditorState.puzzleScale = 0.75;
		if (size === 6) EditorState.puzzleScale = 0.60;

		EditorState.blocks = [];
		EditorState.structures = [[], []];
		EditorState.structureVisible = [];

		for (var i = 0; i < size * size; i++) {
			EditorState.blocks.push(0);
			EditorState.structures[0].push(0);
			EditorState.structures[1].push(0);
			EditorState.structureVisible.push(1);
		}
	},

	setMode: function (mode) {
		EditorState.mode = mode;
		EditorState.showStructures = (mode !== EditorState.MODE_TILES);

		EditorState.modeButtons.forEach(function (button, i) {
			button.setSelected(i === mode);
		});

		EditorState.drawPuzzle();
	},

	canvasPosition: function (event) {
		var rect = EditorState.canvas.getBoundingClientRect();
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	},

	mouseMove: function (event) {
		if (EditorState.overlayEl) return;

		var pos = EditorState.canvasPosition(event);
		var previous = EditorState.selectedBlockOffset;

		EditorState.selectedBlockOffset = PuzzleRenderer.hitTest(
			pos.x, pos.y,
			EditorState.patternSize, EditorState.puzzleTop, EditorState.puzzleLeft, EditorState.puzzleScale
		);

		if (EditorState.selectedBlockOffset !== previous) {
			EditorState.drawPuzzle();
		}
	},

	click: function (event) {
		if (EditorState.overlayEl) return;

		var pos = EditorState.canvasPosition(event);
		var offset = PuzzleRenderer.hitTest(
			pos.x, pos.y,
			EditorState.patternSize, EditorState.puzzleTop, EditorState.puzzleLeft, EditorState.puzzleScale
		);

		if (offset < 0) return;

		switch (EditorState.mode) {
			case EditorState.MODE_TILES:
				EditorState.blocks[offset] = (EditorState.blocks[offset] + 1) % (Block.MAX_BLOCK_ID + 1);
				break;
			case EditorState.MODE_STRUCTURES:
				EditorState.structures[0][offset] = (EditorState.structures[0][offset] + 1) % (Block.MAX_STRUCTURE_ID + 1);
				break;
			case EditorState.MODE_ROOFS:
				EditorState.structures[1][offset] = (EditorState.structures[1][offset] + 1) % (Block.MAX_ROOF_ID + 1);
				break;
		}

		EditorState.drawPuzzle();
	},

	keyDown: function (event) {
		if (EditorState.overlayEl) return;
		if (document.activeElement === EditorState.nameField) return;

		var number = parseInt(event.key, 10);
		if (isNaN(number)) return;

		var offset = EditorState.selectedBlockOffset;
		if (offset < 0) return;

		switch (EditorState.mode) {
			case EditorState.MODE_TILES:
				EditorState.blocks[offset] = number % (Block.MAX_BLOCK_ID + 1);
				break;
			case EditorState.MODE_STRUCTURES:
				EditorState.structures[0][offset] = number % (Block.MAX_STRUCTURE_ID + 1);
				break;
			case EditorState.MODE_ROOFS:
				EditorState.structures[1][offset] = number % (Block.MAX_ROOF_ID + 1);
				break;
		}

		EditorState.drawPuzzle();
	},

	drawPuzzle: function () {
		PuzzleRenderer.draw(
			EditorState.ctx,
			EditorState.patternSize, EditorState.puzzleTop, EditorState.puzzleLeft,
			EditorState.blocks, EditorState.structures,
			EditorState.showStructures, EditorState.structureVisible,
			EditorState.puzzleScale,
			{
				selectedOffset: EditorState.selectedBlockOffset,
				selectorRaised: EditorState.mode !== EditorState.MODE_TILES
			}
		);
	},

	trySaveLevel: function () {
		var name = EditorState.nameField.value.trim();

		if (name === '') {
			EditorState.showMessage("You'll need to enter a name for your level before you can save it!");
			return;
		}

		//	Check that at least two different tile types are used
		var allSame = EditorState.blocks.every(function (b) { return b === EditorState.blocks[0]; });
		if (allSame) {
			EditorState.showMessage(
				'Your level needs to have at least two different types of tiles -- right now, ' +
				'every tile in your level is the same!'
			);
			return;
		}

		//	Serialize in the original "size,blocks...,structures...,roofs..." format
		var dump = [EditorState.patternSize]
			.concat(EditorState.blocks)
			.concat(EditorState.structures[0])
			.concat(EditorState.structures[1]);

		var saved = Storage.saveCustomLevel({
			name: name,
			author: 'You',
			size: EditorState.patternSize,
			data: dump.join(',')
		});

		if (saved) {
			EditorState.showMessage("Your level has been saved! You can play it from the Custom Levels menu. Thanks!");
		} else {
			EditorState.showMessage('There was a problem saving your level. Please try again later.');
		}
	},

	showMessage: function (text) {
		EditorState.closeOverlay();
		EditorState.overlayEl = UI.messageOverlay(text, EditorState.closeOverlay);
		EditorState.root.appendChild(EditorState.overlayEl);
	},

	showHelpOverlay: function () {
		EditorState.showMessage(
			"To build a custom level for Benevolence, start by clicking one of the 'Create' buttons to generate " +
			'a blank level in whichever size you prefer.\n\n' +
			'Once you have a blank level, start by editing the tiles. To change a tile from one type to another, ' +
			"simply click on it. You can also use the number keys (0-6) to instantly set the tile you're pointing " +
			'at to a specific tile type.\n\n' +
			"When you're happy with the layout of your tiles, click the 'Structures' button. Now you can place " +
			'buildings and trees in your level. Once again, to change the structure on a particular tile, just ' +
			'click, or use the number keys (0-9).\n\n' +
			"Once the structures look the way you want them to, click the 'Roofs' button. Clicking on a tile will " +
			"now change the roof that's displayed for that tile. As usual, you can also use the number keys (0-9) " +
			'to set a roof tile more quickly.\n\n' +
			"After you've gotten your level arranged the way you want it, enter a name in the 'Level Name' field, " +
			"then click the 'Save' button to add it to your Custom Levels collection!"
		);
	},

	closeOverlay: function () {
		if (EditorState.overlayEl && EditorState.overlayEl.parentNode) {
			EditorState.overlayEl.parentNode.removeChild(EditorState.overlayEl);
		}
		EditorState.overlayEl = null;
	}
};
