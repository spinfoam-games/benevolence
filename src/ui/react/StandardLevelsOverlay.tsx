//	Standard-levels picker overlay (React port of StandardLevelsOverlay.as).
import { useState } from "react";
import { useGameStore } from "../../store.ts";
import { Assets, Sounds } from "../../core/assets.ts";
import { Game } from "../../game.ts";
import { HoverButton } from "./HoverButton.tsx";

const ROW_LABELS = ["Label_3x3", "Label_4x4", "Label_5x5", "Label_6x6"];

interface TooltipState {
	text: string;
	x: number;
	y: number;
}

function completionText(i: number): string {
	const data = Game.levelCompletionData[i];
	if (!data) return "Level: " + (i + 1) + "\nNever completed.";

	const minutes = Math.floor(data.BestTime / 60);
	const seconds = Math.floor(data.BestTime - minutes * 60);
	return (
		"Level: " + (i + 1) + "\n" +
		"Best time: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + "\n" +
		"Fewest moves: " + data.FewestMoves
	);
}

export function StandardLevelsOverlay() {
	const close = useGameStore((s) => s.closeTitleOverlay);
	const [tooltip, setTooltip] = useState<TooltipState | null>(null);

	function showTooltip(i: number, event: React.MouseEvent) {
		Sounds.PlayButtonHover();
		const rect = event.currentTarget.closest(".full-overlay")!.getBoundingClientRect();
		setTooltip({
			text: completionText(i),
			x: Math.min(event.clientX - rect.left, 600 - 154),
			y: event.clientY - rect.top - 70 - 5,
		});
	}

	return (
		<div className="full-overlay">
			<img className="overlay-title" src={Assets.imageSrc("Title_StandardLevels")} alt="Standard Levels" />

			{tooltip && (
				<div className="tooltip" style={{ display: "block", left: tooltip.x, top: tooltip.y }}>
					{tooltip.text}
				</div>
			)}

			<div className="level-grid">
				{ROW_LABELS.map((label, row) => (
					<div className="level-row" key={label}>
						<img className="level-row-label" src={Assets.imageSrc(label)} alt="" />
						{Array.from({ length: 10 }, (_, col) => {
							const i = row * 10 + col;
							return (
								<div
									className="level-button"
									key={i}
									onClick={() => {
										Sounds.PlayButtonClick();
										Game.startLevel(i, false);
									}}
									onMouseEnter={(event) => showTooltip(i, event)}
									onMouseLeave={() => setTooltip(null)}
								>
									<img src={Assets.imageSrc(Assets.levelButtonName(i))} alt={"Level " + (i + 1)} />
								</div>
							);
						})}
					</div>
				))}
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
