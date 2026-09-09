//	DOM-based UI helpers (replacing the Flash Sprite/TextField widgets)
import { Assets, Sounds } from "../core/assets.ts";
import { Game } from "../game.ts";

export interface SelectableButton extends HTMLDivElement {
	setSelected(selected: boolean): void;
}

export interface Tooltip {
	el: HTMLDivElement;
	setText(text: string): void;
	setLevelCompletionText(index: number): void;
	placeAt(x: number, y: number): void;
	show(): void;
	hide(): void;
}

export const UI = {
	//	Image button that swaps between an off and over image (HoverButton.as)
	hoverButton(offName: string, overName: string, callback: () => void): HTMLDivElement {
		const el = document.createElement("div");
		el.className = "hover-button";

		const off = Assets.cloneImage(offName);
		const over = Assets.cloneImage(overName);
		over.style.display = "none";

		el.appendChild(off);
		el.appendChild(over);

		el.addEventListener("mouseenter", () => {
			Sounds.PlayButtonHover();
			off.style.display = "none";
			over.style.display = "block";
		});
		el.addEventListener("mouseleave", () => {
			off.style.display = "block";
			over.style.display = "none";
		});
		el.addEventListener("click", (event) => {
			event.stopPropagation();
			Sounds.PlayButtonClick();
			callback();
		});

		return el;
	},

	//	Kootenay-font text label (Label.as)
	label(align?: string, size?: number, color?: string): HTMLDivElement {
		const el = document.createElement("div");
		el.className = "game-label";
		el.style.textAlign = align || "left";
		el.style.fontSize = (size || 24) + "px";
		el.style.color = color || "#FFFFFF";
		return el;
	},

	//	Miramonte-font text label (WasabiLabel.as)
	wasabiLabel(align?: string, size?: number, color?: string): HTMLDivElement {
		const el = document.createElement("div");
		el.className = "wasabi-label";
		el.style.textAlign = align || "left";
		el.style.fontSize = (size || 24) + "px";
		el.style.color = color || "#FFFFFF";
		return el;
	},

	//	Flat rectangular text button with hover/click sounds (WasabiButton.as)
	wasabiButton(text: string, onclick?: () => void, width?: number): SelectableButton {
		const el = document.createElement("div") as SelectableButton;
		el.className = "wasabi-button";
		el.style.width = (width || 200) + "px";
		el.textContent = text;

		el.addEventListener("mouseenter", () => { Sounds.PlayButtonHover(); });
		el.addEventListener("click", (event) => {
			event.stopPropagation();
			Sounds.PlayButtonClick();
			if (onclick) onclick();
		});

		el.setSelected = (selected: boolean) => {
			el.classList.toggle("selected", selected);
		};

		return el;
	},

	//	Section separator: text over a horizontal rule (WasabiSeparator.as)
	wasabiSeparator(text: string, width: number): HTMLDivElement {
		const el = document.createElement("div");
		el.className = "wasabi-separator";
		el.style.width = width + "px";
		const span = document.createElement("span");
		span.textContent = text;
		el.appendChild(span);
		return el;
	},

	//	Cyan tooltip box (Tooltip.as)
	tooltip(container: HTMLElement): Tooltip {
		const el = document.createElement("div");
		el.className = "tooltip";
		el.style.display = "none";
		container.appendChild(el);

		return {
			el,
			setText(t: string) {
				el.textContent = t;
			},
			setLevelCompletionText(i: number) {
				const data = Game.levelCompletionData[i];
				if (data) {
					const time = data.BestTime;
					const minutes = Math.floor(time / 60);
					const seconds = Math.floor(time - minutes * 60);
					el.textContent =
						"Level: " + (i + 1) + "\n" +
						"Best time: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "\n" +
						"Fewest moves: " + data.FewestMoves;
				} else {
					el.textContent = "Level: " + (i + 1) + "\nNever completed.";
				}
			},
			placeAt(x: number, y: number) {
				x = Math.min(x, 600 - 154);
				el.style.left = x + "px";
				el.style.top = (y - 70 - 5) + "px";
			},
			show() { el.style.display = "block"; },
			hide() { el.style.display = "none"; },
		};
	},

	//	Brown footer bar with logo and credits (WasabiBar.as)
	wasabiBar(thanksText: string): HTMLDivElement {
		const bar = document.createElement("div");
		bar.className = "wasabi-bar";

		const copyright = UI.wasabiLabel("left", 18, "#FFF874");
		copyright.className += " wasabi-bar-copyright";
		copyright.textContent = "Copyright 2026 - Spinfoam Games";
		bar.appendChild(copyright);

		const site = document.createElement("div");
		site.className = "wasabi-label wasabi-bar-site";
		site.textContent = "http://www.spinfoamgames.com/";
		bar.appendChild(site);

		const thanks = UI.wasabiLabel("left", 12, "#7D4C30");
		thanks.className += " wasabi-bar-thanks";
		thanks.textContent = thanksText;
		bar.appendChild(thanks);

		bar.addEventListener("click", () => {
			window.open("http://www.spinfoamgames.com/", "_blank");
		});

		return bar;
	},

	//	Full-screen black overlay with a message and an Ok button
	//	(SubmitLevelResponseOverlay.as / CustomLevelsResponseOverlay.as)
	messageOverlay(text: string, onOk: () => void): HTMLDivElement {
		const overlay = document.createElement("div");
		overlay.className = "full-overlay";

		const info = UI.wasabiLabel("left", 18);
		info.className += " overlay-text";
		info.textContent = text;
		overlay.appendChild(info);

		const ok = UI.wasabiButton("Ok", onOk);
		ok.style.position = "absolute";
		ok.style.left = (300 - 100) + "px";
		ok.style.bottom = "10px";
		overlay.appendChild(ok);

		return overlay;
	},
};
