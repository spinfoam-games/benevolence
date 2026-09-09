//	Game bootstrap and state switching (Main.as). The Mochi/Kongregate service
//	integrations from the Flash version are gone (those services no longer
//	exist), so all content -- the 5x5/6x6 level packs and the level editor --
//	is unlocked.
var Game = {
	VERSION: '3.0',

	container: null,
	stateEl: null,

	levelCompletionData: [],
	customLevelList: [],

	init: function () {
		Game.container = document.getElementById('game')
		Game.levelCompletionData = Storage.loadLevelCompletionData()

		Assets.loadAll(function () {
			document.getElementById('loading').style.display = 'none'

			var particleCanvas = document.getElementById('particles')
			Particles.init(particleCanvas)

			Game.showTitle()
		})
	},

	setState: function (el) {
		if (Game.stateEl) {
			if (Game.stateEl._shutdown) Game.stateEl._shutdown()
			Game.container.removeChild(Game.stateEl)
		}

		Particles.clear()
		Game.stateEl = el

		//	Keep the particle canvas on top of everything
		var particleCanvas = document.getElementById('particles')
		Game.container.insertBefore(el, particleCanvas)
	},

	showTitle: function () {
		TitleState.show()
	},

	showCustomLevelSelection: function () {
		TitleState.show()
		TitleState.showCustomLevelsOverlay()
	},

	showEditor: function () {
		EditorState.show()
		Game.stateEl._shutdown = EditorState.shutdown
	},

	startLevel: function (levelNumber, customLevel) {
		PlayingState.show(levelNumber, customLevel)
	}
}

window.addEventListener('load', Game.init)
