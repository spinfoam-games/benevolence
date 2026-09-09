//	Persistent data. The Flash version used a SharedObject (and MochiCoins user
//	properties when logged in); the web version uses localStorage. Custom levels
//	were stored on The Wasabi Project's servers, which are long gone, so they
//	now live in localStorage too.
var Storage = {
	COMPLETION_KEY: 'wasabi_benevolence_completion',
	CUSTOM_LEVELS_KEY: 'wasabi_benevolence_custom_levels',

	loadLevelCompletionData: function () {
		try {
			var raw = localStorage.getItem(Storage.COMPLETION_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch (e) {
			return [];
		}
	},

	saveLevelCompletionData: function (data) {
		try {
			localStorage.setItem(Storage.COMPLETION_KEY, JSON.stringify(data));
		} catch (e) { }
	},

	//	Custom levels are objects: { name, author, size, data }
	loadCustomLevels: function () {
		try {
			var raw = localStorage.getItem(Storage.CUSTOM_LEVELS_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch (e) {
			return [];
		}
	},

	saveCustomLevel: function (level) {
		var levels = Storage.loadCustomLevels();
		levels.push(level);
		try {
			localStorage.setItem(Storage.CUSTOM_LEVELS_KEY, JSON.stringify(levels));
			return true;
		} catch (e) {
			return false;
		}
	}
};
