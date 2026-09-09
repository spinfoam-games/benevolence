//	Persistent data. The Flash version used a SharedObject (and MochiCoins user
//	properties when logged in); the web version uses localStorage. Custom levels
//	were stored on The Wasabi Project's servers, which are long gone, so they
//	now live in localStorage too.

export interface LevelCompletion {
	BestTime: number;
	FewestMoves: number;
}

export interface CustomLevel {
	name: string;
	author: string;
	size: number;
	data: string;
}

const COMPLETION_KEY = "wasabi_benevolence_completion";
const CUSTOM_LEVELS_KEY = "wasabi_benevolence_custom_levels";

export const Storage = {
	loadLevelCompletionData(): Array<LevelCompletion | undefined> {
		try {
			const raw = localStorage.getItem(COMPLETION_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	},

	saveLevelCompletionData(data: Array<LevelCompletion | undefined>): void {
		try {
			localStorage.setItem(COMPLETION_KEY, JSON.stringify(data));
		} catch {
			/* storage unavailable / full */
		}
	},

	loadCustomLevels(): CustomLevel[] {
		try {
			const raw = localStorage.getItem(CUSTOM_LEVELS_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	},

	saveCustomLevel(level: CustomLevel): boolean {
		const levels = Storage.loadCustomLevels();
		levels.push(level);
		try {
			localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(levels));
			return true;
		} catch {
			return false;
		}
	},
};
