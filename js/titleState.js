//	Title screen, standard-levels overlay and custom-levels overlay
//	(TitleState.as, StandardLevelsOverlay.as, CustomLevelOverlay.as)
var TitleState = {
	root: null,
	overlay: null,

	show: function () {
		var root = document.createElement('div')
		root.className = 'state title-state'
		TitleState.root = root

		var title = Assets.images['Title'].cloneNode()
		title.className = 'title-image'
		root.appendChild(title)

		var buttons = document.createElement('div')
		buttons.className = 'title-buttons'

		var standardButton = UI.hoverButton('Button_StandardLevels_Off', 'Button_StandardLevels_On', TitleState.showStandardLevelsOverlay)
		var customButton = UI.hoverButton('Button_CustomLevels_Off', 'Button_CustomLevels_On', TitleState.showCustomLevelsOverlay)
		var editorButton = UI.hoverButton('Button_LevelEditor_Off', 'Button_LevelEditor_On', function () { Game.showEditor() })
		editorButton.className += ' editor-button'

		buttons.appendChild(standardButton)
		buttons.appendChild(customButton)
		buttons.appendChild(editorButton)
		root.appendChild(buttons)

		var instructions = UI.label('center', 16, '#000000')
		instructions.className += ' title-instructions'
		instructions.textContent =
			'How to play:\n\n' +
			'In each level you will be shown a pattern by a small character in the lower-right corner of the screen.\n' +
			"Your job is to match the arrangement of the large tiles to the pattern you're shown.\n" +
			'To do this, click on a tile that is adjacent to the empty space; the tile will slide into the space.\n' +
			"When you've correctly matched the pattern, the person will rejoice, and build their home on the tiles you've arranged!"
		root.appendChild(instructions)

		var versionLabel = UI.label('right', 14)
		versionLabel.className += ' title-version'
		versionLabel.textContent = 'Version ' + Game.VERSION
		root.appendChild(versionLabel)

		root.appendChild(UI.wasabiBar(
			'With graphics from the PlanetCute set and gameplay inspired by\n' +
			'the CuteGod design, both by Daniel Cook (http://lostgarden.com)'
		))

		Game.setState(root)
	},

	hideOverlay: function () {
		if (TitleState.overlay && TitleState.overlay.parentNode) {
			TitleState.overlay.parentNode.removeChild(TitleState.overlay)
		}
		TitleState.overlay = null
	},

	showStandardLevelsOverlay: function () {
		TitleState.hideOverlay()

		var overlay = document.createElement('div')
		overlay.className = 'full-overlay'
		TitleState.overlay = overlay

		var title = Assets.images['Title_StandardLevels'].cloneNode()
		title.className = 'overlay-title'
		overlay.appendChild(title)

		var tooltip = UI.tooltip(overlay)

		var grid = document.createElement('div')
		grid.className = 'level-grid'

		var labels = ['Label_3x3', 'Label_4x4', 'Label_5x5', 'Label_6x6']

		for (var row = 0; row < 4; row++) {
			var rowEl = document.createElement('div')
			rowEl.className = 'level-row'

			var labelImg = Assets.images[labels[row]].cloneNode()
			labelImg.className = 'level-row-label'
			rowEl.appendChild(labelImg)

			for (var col = 0; col < 10; col++) {
				var i = row * 10 + col
				rowEl.appendChild(TitleState.makeLevelButton(i, tooltip))
			}

			grid.appendChild(rowEl)
		}

		overlay.appendChild(grid)

		var returnButton = UI.hoverButton('Button_Return_Off', 'Button_Return_Over', TitleState.hideOverlay)
		returnButton.className += ' return-button'
		overlay.appendChild(returnButton)

		TitleState.root.appendChild(overlay)
	},

	makeLevelButton: function (i, tooltip) {
		var el = document.createElement('div')
		el.className = 'level-button'

		el.appendChild(Assets.images[Assets.levelButtonName(i)].cloneNode())

		el.addEventListener('click', function () {
			Sounds.PlayButtonClick()
			Game.startLevel(i, false)
		})
		el.addEventListener('mouseenter', function (event) {
			Sounds.PlayButtonHover()
			tooltip.setLevelCompletionText(i)
			var rect = Game.container.getBoundingClientRect()
			tooltip.placeAt(event.clientX - rect.left, event.clientY - rect.top)
			tooltip.show()
		})
		el.addEventListener('mouseleave', function () {
			tooltip.hide()
		})

		return el
	},

	showCustomLevelsOverlay: function () {
		TitleState.hideOverlay()

		var overlay = document.createElement('div')
		overlay.className = 'full-overlay'
		TitleState.overlay = overlay

		var title = Assets.images['Title_CustomLevels'].cloneNode()
		title.className = 'overlay-title'
		overlay.appendChild(title)

		var listEl = document.createElement('div')
		listEl.className = 'custom-level-list'
		overlay.appendChild(listEl)

		var pager = document.createElement('div')
		pager.className = 'custom-level-pager'
		overlay.appendChild(pager)

		var returnButton = UI.hoverButton('Button_Return_Off', 'Button_Return_Over', TitleState.hideOverlay)
		returnButton.className += ' return-button'
		overlay.appendChild(returnButton)

		var levels = Storage.loadCustomLevels()
		var startAt = 0
		var perPage = 10

		function redraw() {
			listEl.innerHTML = ''
			pager.innerHTML = ''

			if (levels.length === 0) {
				var msg = UI.wasabiLabel('center', 20)
				msg.className += ' custom-level-empty'
				msg.textContent =
					"At the moment, there don't seem to be any custom levels available. " +
					'Use the level editor to build your own!'
				listEl.appendChild(msg)
			}

			for (var i = startAt; i < Math.min(startAt + perPage, levels.length); i++) {
				(function (index) {
					var level = levels[index]
					var b = document.createElement('div')
					b.className = 'custom-level-button'
					b.textContent = level.name + ' (' + level.size + 'x' + level.size + ') by ' + level.author
					b.addEventListener('mouseenter', function () { console.log('mouse enter button'); Sounds.PlayButtonHover() })
					b.addEventListener('click', function () {
						Sounds.PlayButtonClick()
						Game.startLevel(index, true)
					})
					listEl.appendChild(b)
				})(i)
			}

			var prev = document.createElement('div')
			prev.className = 'page-button'
			prev.appendChild(Assets.images['Previous_Page_Button'].cloneNode())
			prev.style.opacity = (startAt === 0) ? 0.2 : 1.0
			prev.addEventListener('click', function () {
				if (startAt > 0) { startAt -= perPage; redraw() }
			})

			var next = document.createElement('div')
			next.className = 'page-button'
			next.appendChild(Assets.images['Next_Page_Button'].cloneNode())
			next.style.opacity = (startAt + perPage >= levels.length) ? 0.2 : 1.0
			next.addEventListener('click', function () {
				if (startAt + perPage < levels.length) { startAt += perPage; redraw() }
			})

			pager.appendChild(prev)
			pager.appendChild(next)
		}

		redraw()

		Game.customLevelList = levels
		TitleState.root.appendChild(overlay)
	}
}
