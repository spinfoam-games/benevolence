//	Game bootstrap and state switching (Main.as). The Mochi/Kongregate service
//	integrations from the Flash version are gone (those services no longer
//	exist), so all content -- the 5x5/6x6 level packs and the level editor --
//	is unlocked.
import { Assets } from "./core/assets.ts";
import { Storage, type LevelCompletion, type CustomLevel } from "./core/storage.ts";
import { Particles } from "./core/particles.ts";
import { TitleState } from "./states/titleState.ts";
import { PlayingState } from "./states/playingState.ts";
import { EditorState } from "./states/editorState.ts";

export interface StateElement extends HTMLDivElement {
	_shutdown?: () => void;
}

export const Game = {
	VERSION: "3.0",

	container: null as HTMLElement | null,
	stateEl: null as StateElement | null,

	levelCompletionData: [] as Array<LevelCompletion | undefined>,
	customLevelList: [] as CustomLevel[],

	init(): void {
		Game.container = document.getElementById("game");
		Game.levelCompletionData = Storage.loadLevelCompletionData();

		Assets.loadAll(() => {
			const loading = document.getElementById("loading");
			if (loading) loading.style.display = "none";

			const particleCanvas = document.getElementById("particles") as HTMLCanvasElement;
			Particles.init(particleCanvas);

			Game.showTitle();
		});
	},

	setState(el: StateElement): void {
		if (Game.stateEl) {
			if (Game.stateEl._shutdown) Game.stateEl._shutdown();
			Game.container?.removeChild(Game.stateEl);
		}

		Particles.clear();
		Game.stateEl = el;

		//	Keep the particle canvas on top of everything
		const particleCanvas = document.getElementById("particles");
		Game.container?.insertBefore(el, particleCanvas);
	},

	showTitle(): void {
		TitleState.show();
	},

	showCustomLevelSelection(): void {
		TitleState.show();
		TitleState.showCustomLevelsOverlay();
	},

	showEditor(): void {
		EditorState.show();
		if (Game.stateEl) Game.stateEl._shutdown = EditorState.shutdown;
	},

	startLevel(levelNumber: number, customLevel: boolean): void {
		PlayingState.show(levelNumber, customLevel);
	},
};
