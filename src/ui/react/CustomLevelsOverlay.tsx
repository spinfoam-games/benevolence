//	Custom-levels picker overlay (React port of CustomLevelOverlay.as).
import { useEffect, useState } from "react";
import { useGameStore } from "../../store.ts";
import { Assets, Sounds } from "../../core/assets.ts";
import { Storage } from "../../core/storage.ts";
import { Game } from "../../game.ts";
import { HoverButton } from "./HoverButton.tsx";

const PER_PAGE = 10;

export function CustomLevelsOverlay() {
	const close = useGameStore((s) => s.closeTitleOverlay);
	const startLevel = useGameStore((s) => s.startLevel);
	const [levels] = useState(() => Storage.loadCustomLevels());
	const [startAt, setStartAt] = useState(0);

	//	Keep the shared list in sync so PlayingState can look levels up by index
	useEffect(() => {
		Game.customLevelList = levels;
	}, [levels]);

	const page = levels.slice(startAt, startAt + PER_PAGE);
	const atStart = startAt === 0;
	const atEnd = startAt + PER_PAGE >= levels.length;

	return (
		<div className="full-overlay">
			<img className="overlay-title" src={Assets.imageSrc("Title_CustomLevels")} alt="Custom Levels" />

			<div className="custom-level-list">
				{levels.length === 0 && (
					<div className="wasabi-label custom-level-empty" style={{ textAlign: "center", fontSize: 20 }}>
						At the moment, there don't seem to be any custom levels available. Use the level editor to
						build your own!
					</div>
				)}

				{page.map((level, offset) => {
					const index = startAt + offset;
					return (
						<div
							className="custom-level-button"
							key={index}
							onMouseEnter={() => Sounds.PlayButtonHover()}
							onClick={() => {
								Sounds.PlayButtonClick();
								startLevel(index, true);
							}}
						>
							{level.name} ({level.size}x{level.size}) by {level.author}
						</div>
					);
				})}
			</div>

			<div className="custom-level-pager">
				<div
					className="page-button"
					style={{ opacity: atStart ? 0.2 : 1 }}
					onClick={() => !atStart && setStartAt(startAt - PER_PAGE)}
				>
					<img src={Assets.imageSrc("Previous_Page_Button")} alt="Previous page" />
				</div>
				<div
					className="page-button"
					style={{ opacity: atEnd ? 0.2 : 1 }}
					onClick={() => !atEnd && setStartAt(startAt + PER_PAGE)}
				>
					<img src={Assets.imageSrc("Next_Page_Button")} alt="Next page" />
				</div>
			</div>

			<HoverButton
				className="return-button"
				offName="Button_Return_Off"
				overName="Button_Return_Over"
				onClick={close}
			/>
		</div>
	);
}
