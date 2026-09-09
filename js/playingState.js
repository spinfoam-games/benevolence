//	The main puzzle-playing screen (PlayingState.as, LevelCompleteOverlay.as,
//	Pattern.as, People.as)
var PlayingState = {
	root: null,
	canvas: null,
	ctx: null,

	puzzleSize: 4,
	puzzleScale: 1.0,
	puzzleTop: 50,
	puzzleLeft: 50,

	blocks: null,
	structures: null,
	structureVisible: null,
	goal: null,
	emptySlotType: 0,
	slotX: 0,
	slotY: 0,

	isSolved: false,
	structureAppearing: false,
	structureClock: 0,
	structureDelay: 0.2,
	structureRevealList: null,

	currentLevel: 0,
	isCustomLevel: false,
	movesMade: 0,
	clock: 0,

	movesLabel: null,
	timeLabel: null,
	patternCanvas: null,
	heartEl: null,
	returnButton: null,
	completeOverlay: null,
	completeAlpha: 0,

	animationFrame: 0,
	lastTime: 0,

	show: function (levelNumber, customLevel) {
		PlayingState.currentLevel = levelNumber;
		PlayingState.isCustomLevel = customLevel;
		PlayingState.isSolved = false;
		PlayingState.structureAppearing = false;
		PlayingState.structureClock = 0;
		PlayingState.movesMade = 0;
		PlayingState.clock = 0;
		PlayingState.completeOverlay = null;

		var root = document.createElement('div');
		root.className = 'state playing-state';
		PlayingState.root = root;

		//	Puzzle canvas
		var canvas = document.createElement('canvas');
		canvas.width = 600;
		canvas.height = 600;
		canvas.className = 'puzzle-canvas';
		root.appendChild(canvas);
		PlayingState.canvas = canvas;
		PlayingState.ctx = canvas.getContext('2d');

		//	Labels (top right)
		var labels = document.createElement('div');
		labels.className = 'playing-labels';

		var levelLabel = UI.label('right', 24);

		//	Level data
		var levelData;
		if (customLevel) {
			var custom = Game.customLevelList[levelNumber];
			levelData = Levels.ParseData(custom.data);
			levelLabel.textContent = custom.name + ' by ' + custom.author;
		} else {
			levelData = Levels.LevelData[levelNumber];
			if (levelData.data) levelData = Levels.ParseData(levelData.data);
			levelLabel.textContent = 'Level ' + (levelNumber + 1);
		}

		PlayingState.movesLabel = UI.label('right', 24);
		PlayingState.movesLabel.textContent = 'Moves: 0';
		PlayingState.timeLabel = UI.label('right', 24);
		PlayingState.timeLabel.textContent = 'Time: 0:00';

		labels.appendChild(levelLabel);
		labels.appendChild(PlayingState.movesLabel);
		labels.appendChild(PlayingState.timeLabel);
		root.appendChild(labels);

		PlayingState.puzzleSize = levelData.size;
		PlayingState.blocks = levelData.blocks.slice();
		PlayingState.structures = [levelData.structures[0].slice(), levelData.structures[1].slice()];
		PlayingState.structureVisible = [];

		//	Person and speech bubble with the goal pattern
		var person = document.createElement('div');
		person.className = 'person';
		var personImg = Assets.images[Assets.PEOPLE[Math.floor(Math.random() * Assets.PEOPLE.length)]].cloneNode();
		person.appendChild(personImg);
		root.appendChild(person);

		var bubble = document.createElement('div');
		bubble.className = 'speech-bubble';
		bubble.appendChild(Assets.images['SpeechBubble'].cloneNode());

		PlayingState.patternCanvas = document.createElement('canvas');
		PlayingState.patternCanvas.className = 'pattern-canvas';
		bubble.appendChild(PlayingState.patternCanvas);

		PlayingState.heartEl = Assets.images['Heart'].cloneNode();
		PlayingState.heartEl.className = 'bubble-heart';
		PlayingState.heartEl.style.display = 'none';
		bubble.appendChild(PlayingState.heartEl);

		root.appendChild(bubble);

		//	Return button
		PlayingState.returnButton = UI.hoverButton('Button_Return_Off', 'Button_Return_Over', function () {
			Game.showTitle();
		});
		PlayingState.returnButton.className += ' return-button';
		root.appendChild(PlayingState.returnButton);

		//	Remove the bottom-right block to create the empty slot
		var size = PlayingState.puzzleSize;
		PlayingState.emptySlotType = PlayingState.blocks[size * size - 1];
		PlayingState.blocks[size * size - 1] = -1;
		PlayingState.slotX = size - 1;
		PlayingState.slotY = size - 1;

		//	Store the goal layout
		PlayingState.goal = PlayingState.blocks.slice();

		//	Draw the goal pattern in the speech bubble
		PlayingState.drawPattern();

		//	Build the shuffled structure-reveal list
		var pointList = [];
		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {
				var offset = y * size + x;
				if (PlayingState.structures[0][offset] > 0 || PlayingState.structures[1][offset] > 0) {
					pointList.push({ x: x, y: y });
				}
			}
		}

		PlayingState.structureRevealList = [];
		while (pointList.length > 0) {
			var which = Math.floor(Math.random() * pointList.length);
			PlayingState.structureRevealList.push(pointList[which]);
			pointList.splice(which, 1);
		}

		PlayingState.puzzleScale = 1.0;
		if (size === 5) PlayingState.puzzleScale = 0.80;
		if (size === 6) PlayingState.puzzleScale = 0.70;

		PlayingState.scramble(2000);
		PlayingState.drawPuzzle();

		canvas.addEventListener('click', PlayingState.click);

		Game.setState(root);

		PlayingState.lastTime = 0;
		cancelAnimationFrame(PlayingState.animationFrame);
		PlayingState.animationFrame = requestAnimationFrame(PlayingState.update);
	},

	drawPattern: function () {
		var size = PlayingState.puzzleSize;
		var blockSize = 10;
		var spacing = 2;

		var canvas = PlayingState.patternCanvas;
		canvas.width = size * (blockSize + spacing);
		canvas.height = size * (blockSize + spacing);

		var ctx = canvas.getContext('2d');

		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {
				//	The blank space is drawn as blank in the pattern,
				//	since it was confusing people
				if (x === size - 1 && y === size - 1) continue;

				ctx.fillStyle = Block.BLOCK_COLOR[PlayingState.goal[y * size + x]];
				ctx.fillRect(x * (blockSize + spacing), y * (blockSize + spacing), blockSize, blockSize);
			}
		}
	},

	scramble: function (steps) {
		var s = PlayingState;

		for (var count = 0; count < steps; count++) {
			var done = false;

			while (!done) {
				if (s.slotX > 0 && Math.random() < 0.33) {
					s.swapBlock(s.slotX - 1, s.slotY);
					done = true;
				} else if (s.slotX < s.puzzleSize - 1 && Math.random() < 0.33) {
					s.swapBlock(s.slotX + 1, s.slotY);
					done = true;
				} else if (s.slotY > 0 && Math.random() < 0.33) {
					s.swapBlock(s.slotX, s.slotY - 1);
					done = true;
				} else if (s.slotY < s.puzzleSize - 1 && Math.random() < 0.33) {
					s.swapBlock(s.slotX, s.slotY + 1);
					done = true;
				}
			}
		}
	},

	swapBlock: function (blockX, blockY) {
		var s = PlayingState;
		s.blocks[s.slotY * s.puzzleSize + s.slotX] = s.blocks[blockY * s.puzzleSize + blockX];
		s.blocks[blockY * s.puzzleSize + blockX] = -1;
		s.slotX = blockX;
		s.slotY = blockY;
	},

	click: function (event) {
		var s = PlayingState;

		if (s.isSolved) return;

		var rect = s.canvas.getBoundingClientRect();
		var offset = PuzzleRenderer.hitTest(
			event.clientX - rect.left, event.clientY - rect.top,
			s.puzzleSize, s.puzzleTop, s.puzzleLeft, s.puzzleScale
		);

		if (offset < 0) return;

		var blockX = offset % s.puzzleSize;
		var blockY = Math.floor(offset / s.puzzleSize);

		var adjacent =
			(s.slotX === blockX + 1 && s.slotY === blockY) ||
			(s.slotX === blockX - 1 && s.slotY === blockY) ||
			(s.slotY === blockY - 1 && s.slotX === blockX) ||
			(s.slotY === blockY + 1 && s.slotX === blockX);

		if (adjacent) {
			s.swapBlock(blockX, blockY);
			s.movesMade++;
			Sounds.PlayMove();
		}

		s.movesLabel.textContent = 'Moves: ' + s.movesMade;
		s.drawPuzzle();
		s.checkForGoal();
	},

	checkForGoal: function () {
		var s = PlayingState;
		var size = s.puzzleSize;

		for (var i = 0; i < size * size; i++) {
			if (s.goal[i] !== s.blocks[i]) return false;
		}

		//	Solved!
		s.isSolved = true;
		s.patternCanvas.style.display = 'none';
		s.heartEl.style.display = 'block';

		//	Stars around the person / speech bubble
		Particles.spawn(510, 480, 10);

		Sounds.PlaySmallSuccess();

		//	Reset the block in the slot to fill the slot
		s.blocks[size * size - 1] = s.emptySlotType;

		//	Store best time / fewest moves (custom levels aren't tracked,
		//	matching the original)
		if (!s.isCustomLevel) {
			var data = Game.levelCompletionData[s.currentLevel];
			if (!data) {
				Game.levelCompletionData[s.currentLevel] = { BestTime: s.clock, FewestMoves: s.movesMade };
			} else {
				data.BestTime = Math.min(s.clock, data.BestTime);
				data.FewestMoves = Math.min(s.movesMade, data.FewestMoves);
			}
			Storage.saveLevelCompletionData(Game.levelCompletionData);
		}

		s.structureClock = 0;
		s.structureAppearing = true;

		return true;
	},

	update: function (time) {
		var s = PlayingState;
		if (!s.root || !s.root.parentNode) return;

		var dt = s.lastTime ? (time - s.lastTime) / 1000 : 0;
		s.lastTime = time;
		if (dt > 0.1) dt = 0.1;

		if (!s.isSolved) {
			s.clock += dt;
			var minutes = Math.floor(s.clock / 60);
			var seconds = Math.floor(s.clock - minutes * 60);
			s.timeLabel.textContent = 'Time: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
		} else if (s.completeOverlay) {
			//	Fade the overlay in over ~2 seconds while the return button fades out
			s.completeAlpha = Math.min(1, s.completeAlpha + dt / 2);
			s.completeOverlay.style.opacity = s.completeAlpha;
			s.returnButton.style.opacity = 1 - s.completeAlpha;
		}

		if (s.structureAppearing) {
			s.structureClock += dt;

			if (s.structureClock >= s.structureDelay && s.structureRevealList.length > 0) {
				var point = s.structureRevealList.shift();
				s.structureVisible[point.y * s.puzzleSize + point.x] = 1;
				s.structureClock = 0;

				Particles.spawn(
					point.x * Block.ImageWidth * s.puzzleScale + s.puzzleLeft,
					point.y * Block.BlockHeight * s.puzzleScale + s.puzzleTop,
					10
				);

				Sounds.PlaySmallSuccess();
				s.drawPuzzle();
			}

			if (s.structureRevealList.length <= 0) {
				Sounds.PlayLargeSuccess();
				s.structureAppearing = false;
				s.showLevelComplete();
			}
		}

		s.animationFrame = requestAnimationFrame(s.update);
	},

	drawPuzzle: function () {
		var s = PlayingState;
		PuzzleRenderer.draw(
			s.ctx, s.puzzleSize, s.puzzleTop, s.puzzleLeft,
			s.blocks, s.structures, s.isSolved, s.structureVisible, s.puzzleScale
		);
	},

	showLevelComplete: function () {
		var s = PlayingState;

		var overlay = document.createElement('div');
		overlay.className = 'level-complete-overlay';
		overlay.style.opacity = 0;
		s.completeAlpha = 0;
		s.completeOverlay = overlay;

		var message = Assets.images['LevelComplete'].cloneNode();
		message.className = 'complete-message';
		overlay.appendChild(message);

		var buttons = document.createElement('div');
		buttons.className = 'complete-buttons';

		var returnButton = UI.hoverButton('Button_Return_Off', 'Button_Return_Over', function () {
			Game.showTitle();
		});

		var nextButton;
		if (s.isCustomLevel) {
			nextButton = UI.hoverButton('Button_CustomLevels_Off', 'Button_CustomLevels_On', function () {
				Game.showCustomLevelSelection();
			});
		} else {
			nextButton = UI.hoverButton('Button_Next_Off', 'Button_Next_Over', function () {
				Game.startLevel((s.currentLevel + 1) % Levels.LevelData.length, false);
			});
		}

		buttons.appendChild(returnButton);
		buttons.appendChild(nextButton);
		overlay.appendChild(buttons);

		s.root.appendChild(overlay);
	}
};
