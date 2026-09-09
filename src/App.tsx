//	Top-level screen router. Reads the current screen from the Zustand store and
//	renders the matching component. Title and its overlays are React; the
//	canvas-heavy playing/editor screens are mounted by bridge components.
import { useEffect } from "react";
import { useGameStore } from "./store.ts";
import { Assets } from "./core/assets.ts";
import { Particles } from "./core/particles.ts";
import { Game } from "./game.ts";
import { TitleScreen } from "./ui/react/TitleScreen.tsx";
import { PlayingScreen } from "./states/PlayingScreen.tsx";
import { EditorScreen } from "./states/EditorScreen.tsx";

let bootstrapped = false;

function bootstrap(onReady: () => void): void {
	if (bootstrapped) {
		onReady();
		return;
	}
	bootstrapped = true;

	Game.loadSavedData();
	Assets.loadAll(() => {
		const canvas = document.getElementById("particles") as HTMLCanvasElement | null;
		if (canvas) Particles.init(canvas);
		onReady();
	});
}

export function App() {
	const screen = useGameStore((s) => s.screen);
	const assetsReady = useGameStore((s) => s.assetsReady);

	useEffect(() => {
		bootstrap(assetsReady);
	}, [assetsReady]);

	//	Clear leftover particles whenever the screen changes
	useEffect(() => {
		Particles.clear();
	}, [screen]);

	switch (screen) {
		case "loading":
			return <div id="loading">Loading...</div>;
		case "title":
			return <TitleScreen />;
		case "playing":
			return <PlayingScreen />;
		case "editor":
			return <EditorScreen />;
	}
}
