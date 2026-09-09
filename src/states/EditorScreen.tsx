//	React bridge for the imperative, canvas-based level editor.
import { useEffect, useRef } from "react";
import { EditorState } from "./editorState.ts";

export function EditorScreen() {
	const host = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const parent = host.current;
		if (!parent) return;
		EditorState.mount(parent);
		return () => EditorState.unmount();
	}, []);

	return <div ref={host} className="screen-host" />;
}
