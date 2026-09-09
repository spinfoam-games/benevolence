//	Shared game data + navigation adapter. The Mochi/Kongregate service
//	integrations from the Flash version are gone (those services no longer
//	exist), so all content -- the 5x5/6x6 level packs and the level editor --
//	is unlocked.
//
//	Navigation now lives in the Zustand store (src/store.ts); this object keeps
//	the cross-cutting game data and exposes the same imperative navigation
//	methods the still-imperative playing/editor screens call.
import { Storage, type LevelCompletion, type CustomLevel } from "./core/storage.ts";
import { useGameStore } from "./store.ts";

export const Game = {
	VERSION: "3.2.0",

	levelCompletionData: [] as Array<LevelCompletion | undefined>,
	customLevelList: [] as CustomLevel[],

	//	Called once at startup, before the title screen is shown
	loadSavedData(): void {
		Game.levelCompletionData = Storage.loadLevelCompletionData();
	},

	showTitle(): void {
		useGameStore.getState().showTitle();
	},

	showCustomLevelSelection(): void {
		useGameStore.getState().showCustomLevelSelection();
	},

	showEditor(): void {
		useGameStore.getState().showEditor();
	},

	startLevel(levelNumber: number, customLevel: boolean): void {
		useGameStore.getState().startLevel(levelNumber, customLevel);
	},
};
