//	Asset preloading and sound playback (replaces the Flash [Embed] tags)
var Assets = {
	images: {},

	//	Every image the game uses, by base name (without ".png")
	IMAGE_NAMES: [
		'Background', 'Title', 'Heart', 'SpeechBubble', 'Star', 'Selector',
		'LevelComplete', 'GameComplete', 'WasabiLogo',
		'Title_StandardLevels', 'Title_CustomLevels',
		'Label_3x3', 'Label_4x4', 'Label_5x5', 'Label_6x6',
		'Button_CustomLevels_Off', 'Button_CustomLevels_On',
		'Button_StandardLevels_Off', 'Button_StandardLevels_On',
		'Button_LevelEditor_Off', 'Button_LevelEditor_On',
		'Button_Next_Off', 'Button_Next_Over',
		'Button_Return_Off', 'Button_Return_Over',
		'Next_Page_Button', 'Previous_Page_Button',
		'Brown Block', 'Dirt Block', 'Grass Block', 'Plain Block',
		'Stone Block', 'Stone Block Tall', 'Water Block', 'Wood Block',
		'Door Tall Closed', 'Wall Block Tall', 'Window Tall',
		'Roof North', 'Roof South', 'Roof East', 'Roof West',
		'Roof North East', 'Roof North West', 'Roof South East', 'Roof South West',
		'Tree Short', 'Tree Tall', 'Tree Ugly', 'Rock',
		'Character Boy', 'Character Cat Girl', 'Character Horn Girl',
		'Character Pink Girl', 'Character Princess Girl'
	],

	PEOPLE: [
		'Character Boy', 'Character Cat Girl', 'Character Horn Girl',
		'Character Pink Girl', 'Character Princess Girl'
	],

	//	Level select button images (Level_01 .. Level_40)
	levelButtonName: function (i) {
		return 'Level_' + (i + 1 < 10 ? '0' : '') + (i + 1)
	},

	loadAll: function (onComplete) {
		var names = Assets.IMAGE_NAMES.slice()
		for (var i = 0; i < 40; i++) names.push(Assets.levelButtonName(i))

		var remaining = names.length

		names.forEach(function (name) {
			var img = new Image()
			img.onload = img.onerror = function () {
				remaining--
				if (remaining === 0) onComplete()
			}
			img.src = 'assets/images/' + name + '.png'
			Assets.images[name] = img
		})
	}
}

var Sounds = {
	play: function (name, volume) {
		console.log(`Playing sound: ${name}`)
		// var audio = new Audio('assets/sounds/' + name + '.mp3');
		var audio = new Audio('assets/sounds/' + name + '.wav')
		audio.volume = (volume === undefined) ? 1.0 : volume
		//	Browsers block audio before the first user interaction; ignore that
		audio.play().catch(function () { })
	},

	PlayMove: function () { Sounds.play('Neutral_Select_butom_08') },
	PlaySmallSuccess: function () { Sounds.play('Stars_complete_Level_02') },
	PlayLargeSuccess: function () { Sounds.play('Bonus_02') },
	PlayButtonHover: function () { Sounds.play('Neutral_Select_butom_12', 0.25) },
	PlayButtonClick: function () { Sounds.play('Select_Item_05', 0.5) }
}
