//	Title screen (React port of TitleState.as). Renders the logo, the three
//	menu buttons, the how-to-play text, and hosts the level-select overlays.
import { useGameStore } from "../../store.ts";
import { Assets } from "../../core/assets.ts";
import { Game } from "../../game.ts";
import { HoverButton } from "./HoverButton.tsx";
import { WasabiBar } from "./WasabiBar.tsx";
import { StandardLevelsOverlay } from "./StandardLevelsOverlay.tsx";
import { CustomLevelsOverlay } from "./CustomLevelsOverlay.tsx";

const INSTRUCTIONS =
	"How to play:\n\n" +
	"In each level you will be shown a pattern by a small character in the lower-right corner of the screen.\n" +
	"Your job is to match the arrangement of the large tiles to the pattern you're shown.\n" +
	"To do this, click on a tile that is adjacent to the empty space; the tile will slide into the space.\n" +
	"When you've correctly matched the pattern, the person will rejoice, and build their home on the tiles you've arranged!";

const THANKS =
	"With graphics from the PlanetCute set and gameplay inspired by\n" +
	"the CuteGod design, both by Daniel Cook (http://lostgarden.com)";

export function TitleScreen() {
	const overlay = useGameStore((s) => s.titleOverlay);
	const openStandardLevels = useGameStore((s) => s.openStandardLevels);
	const openCustomLevels = useGameStore((s) => s.openCustomLevels);

	return (
		<div className="state title-state">
			<img className="title-image" src={Assets.imageSrc("Title")} alt="Benevolence" />

			<div className="title-buttons">
				<HoverButton
					offName="Button_StandardLevels_Off"
					overName="Button_StandardLevels_On"
					onClick={openStandardLevels}
				/>
				<HoverButton
					offName="Button_CustomLevels_Off"
					overName="Button_CustomLevels_On"
					onClick={openCustomLevels}
				/>
				<HoverButton
					className="editor-button"
					offName="Button_LevelEditor_Off"
					overName="Button_LevelEditor_On"
					onClick={() => Game.showEditor()}
				/>
			</div>

			<div className="game-label title-instructions" style={{ textAlign: "center", fontSize: 16, color: "#000000" }}>
				{INSTRUCTIONS}
			</div>

			<div className="game-label title-version" style={{ textAlign: "right", fontSize: 14, color: "#FFFFFF" }}>
				Version {Game.VERSION}
			</div>

			<WasabiBar thanks={THANKS} />

			{overlay === "standard" && <StandardLevelsOverlay />}
			{overlay === "custom" && <CustomLevelsOverlay />}
		</div>
	);
}
