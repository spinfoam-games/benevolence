//	Title screen, standard-levels overlay and custom-levels overlay
//	(TitleState.as, StandardLevelsOverlay.as, CustomLevelOverlay.as)
import { Assets, Sounds } from "../core/assets.ts";
import { Storage } from "../core/storage.ts";
import { UI, type Tooltip } from "../ui/widgets.ts";
import { Game } from "../game.ts";

export const TitleState = {
	root: null as HTMLDivElement | null,
	overlay: null as HTMLDivElement | null,

	show(): void {
		const root = document.createElement("div");
		root.className = "state title-state";
		TitleState.root = root;

		const title = Assets.cloneImage("Title");
		title.className = "title-image";
		root.appendChild(title);

		const buttons = document.createElement("div");
		buttons.className = "title-buttons";

		const standardButton = UI.hoverButton("Button_StandardLevels_Off", "Button_StandardLevels_On", TitleState.showStandardLevelsOverlay);
		const customButton = UI.hoverButton("Button_CustomLevels_Off", "Button_CustomLevels_On", TitleState.showCustomLevelsOverlay);
		const editorButton = UI.hoverButton("Button_LevelEditor_Off", "Button_LevelEditor_On", () => { Game.showEditor(); });
		editorButton.className += " editor-button";

		buttons.appendChild(standardButton);
		buttons.appendChild(customButton);
		buttons.appendChild(editorButton);
		root.appendChild(buttons);

		const instructions = UI.label("center", 16, "#000000");
		instructions.className += " title-instructions";
		instructions.textContent =
			"How to play:\n\n" +
			"In each level you will be shown a pattern by a small character in the lower-right corner of the screen.\n" +
			"Your job is to match the arrangement of the large tiles to the pattern you're shown.\n" +
			"To do this, click on a tile that is adjacent to the empty space; the tile will slide into the space.\n" +
			"When you've correctly matched the pattern, the person will rejoice, and build their home on the tiles you've arranged!";
		root.appendChild(instructions);

		const versionLabel = UI.label("right", 14);
		versionLabel.className += " title-version";
		versionLabel.textContent = "Version " + Game.VERSION;
		root.appendChild(versionLabel);

		root.appendChild(UI.wasabiBar(
			"With graphics from the PlanetCute set and gameplay inspired by\n" +
			"the CuteGod design, both by Daniel Cook (http://lostgarden.com)",
		));

		Game.setState(root);
	},

	hideOverlay(): void {
		if (TitleState.overlay && TitleState.overlay.parentNode) {
			TitleState.overlay.parentNode.removeChild(TitleState.overlay);
		}
		TitleState.overlay = null;
	},

	showStandardLevelsOverlay(): void {
		TitleState.hideOverlay();

		const overlay = document.createElement("div");
		overlay.className = "full-overlay";
		TitleState.overlay = overlay;

		const title = Assets.cloneImage("Title_StandardLevels");
		title.className = "overlay-title";
		overlay.appendChild(title);

		const tooltip = UI.tooltip(overlay);

		const grid = document.createElement("div");
		grid.className = "level-grid";

		const labels = ["Label_3x3", "Label_4x4", "Label_5x5", "Label_6x6"];

		for (let row = 0; row < 4; row++) {
			const rowEl = document.createElement("div");
			rowEl.className = "level-row";

			const labelImg = Assets.cloneImage(labels[row]);
			labelImg.className = "level-row-label";
			rowEl.appendChild(labelImg);

			for (let col = 0; col < 10; col++) {
				const i = row * 10 + col;
				rowEl.appendChild(TitleState.makeLevelButton(i, tooltip));
			}

			grid.appendChild(rowEl);
		}

		overlay.appendChild(grid);

		const returnButton = UI.hoverButton("Button_Return_Off", "Button_Return_Over", TitleState.hideOverlay);
		returnButton.className += " return-button";
		overlay.appendChild(returnButton);

		TitleState.root?.appendChild(overlay);
	},

	makeLevelButton(i: number, tooltip: Tooltip): HTMLDivElement {
		const el = document.createElement("div");
		el.className = "level-button";

		el.appendChild(Assets.cloneImage(Assets.levelButtonName(i)));

		el.addEventListener("click", () => {
			Sounds.PlayButtonClick();
			Game.startLevel(i, false);
		});
		el.addEventListener("mouseenter", (event) => {
			Sounds.PlayButtonHover();
			tooltip.setLevelCompletionText(i);
			const rect = Game.container?.getBoundingClientRect();
			tooltip.placeAt(event.clientX - (rect?.left ?? 0), event.clientY - (rect?.top ?? 0));
			tooltip.show();
		});
		el.addEventListener("mouseleave", () => {
			tooltip.hide();
		});

		return el;
	},

	showCustomLevelsOverlay(): void {
		TitleState.hideOverlay();

		const overlay = document.createElement("div");
		overlay.className = "full-overlay";
		TitleState.overlay = overlay;

		const title = Assets.cloneImage("Title_CustomLevels");
		title.className = "overlay-title";
		overlay.appendChild(title);

		const listEl = document.createElement("div");
		listEl.className = "custom-level-list";
		overlay.appendChild(listEl);

		const pager = document.createElement("div");
		pager.className = "custom-level-pager";
		overlay.appendChild(pager);

		const returnButton = UI.hoverButton("Button_Return_Off", "Button_Return_Over", TitleState.hideOverlay);
		returnButton.className += " return-button";
		overlay.appendChild(returnButton);

		const levels = Storage.loadCustomLevels();
		let startAt = 0;
		const perPage = 10;

		function redraw() {
			listEl.innerHTML = "";
			pager.innerHTML = "";

			if (levels.length === 0) {
				const msg = UI.wasabiLabel("center", 20);
				msg.className += " custom-level-empty";
				msg.textContent =
					"At the moment, there don't seem to be any custom levels available. " +
					"Use the level editor to build your own!";
				listEl.appendChild(msg);
			}

			for (let i = startAt; i < Math.min(startAt + perPage, levels.length); i++) {
				const index = i;
				const level = levels[index];
				const b = document.createElement("div");
				b.className = "custom-level-button";
				b.textContent = level.name + " (" + level.size + "x" + level.size + ") by " + level.author;
				b.addEventListener("mouseenter", () => { Sounds.PlayButtonHover(); });
				b.addEventListener("click", () => {
					Sounds.PlayButtonClick();
					Game.startLevel(index, true);
				});
				listEl.appendChild(b);
			}

			const prev = document.createElement("div");
			prev.className = "page-button";
			prev.appendChild(Assets.cloneImage("Previous_Page_Button"));
			prev.style.opacity = startAt === 0 ? "0.2" : "1.0";
			prev.addEventListener("click", () => {
				if (startAt > 0) { startAt -= perPage; redraw(); }
			});

			const next = document.createElement("div");
			next.className = "page-button";
			next.appendChild(Assets.cloneImage("Next_Page_Button"));
			next.style.opacity = startAt + perPage >= levels.length ? "0.2" : "1.0";
			next.addEventListener("click", () => {
				if (startAt + perPage < levels.length) { startAt += perPage; redraw(); }
			});

			pager.appendChild(prev);
			pager.appendChild(next);
		}

		redraw();

		Game.customLevelList = levels;
		TitleState.root?.appendChild(overlay);
	},
};
