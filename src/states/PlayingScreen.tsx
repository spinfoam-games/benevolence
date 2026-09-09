//	React bridge for the imperative, canvas-based playing screen.
import { useEffect, useRef } from "react";
import { useGameStore } from "../store.ts";
import { PlayingState } from "./playingState.ts";

export function PlayingScreen() {
	const host = useRef<HTMLDivElement>(null);
	const levelNumber = useGameStore((s) => s.levelNumber);
	const isCustomLevel = useGameStore((s) => s.isCustomLevel);

	useEffect(() => {
		const parent = host.current;
		if (!parent) return;
		PlayingState.mount(parent, levelNumber, isCustomLevel);
		return () => PlayingState.unmount();
	}, [levelNumber, isCustomLevel]);

	return <div ref={host} className="screen-host" />;
}
