//	Navigation state for the game shell. Screen rendering is driven by React
//	off this store; the canvas-heavy playing/editor screens are still built
//	imperatively but are mounted/unmounted by React bridge components.
import { create } from "zustand";

export type Screen = "loading" | "title" | "playing" | "editor";
export type TitleOverlay = "none" | "standard" | "custom";

interface GameStore {
	screen: Screen;
	titleOverlay: TitleOverlay;

	//	Playing screen parameters
	levelNumber: number;
	isCustomLevel: boolean;

	assetsReady(): void;
	showTitle(): void;
	openStandardLevels(): void;
	openCustomLevels(): void;
	closeTitleOverlay(): void;
	showEditor(): void;
	startLevel(levelNumber: number, isCustom: boolean): void;
	//	Return to the title with the custom-levels overlay already open
	showCustomLevelSelection(): void;
}

export const useGameStore = create<GameStore>((set) => ({
	screen: "loading",
	titleOverlay: "none",
	levelNumber: 0,
	isCustomLevel: false,

	assetsReady: () => set((s) => (s.screen === "loading" ? { screen: "title" } : {})),
	showTitle: () => set({ screen: "title", titleOverlay: "none" }),
	openStandardLevels: () => set({ titleOverlay: "standard" }),
	openCustomLevels: () => set({ titleOverlay: "custom" }),
	closeTitleOverlay: () => set({ titleOverlay: "none" }),
	showEditor: () => set({ screen: "editor", titleOverlay: "none" }),
	startLevel: (levelNumber, isCustom) =>
		set({ screen: "playing", levelNumber, isCustomLevel: isCustom, titleOverlay: "none" }),
	showCustomLevelSelection: () => set({ screen: "title", titleOverlay: "custom" }),
}));
