//	Brown footer bar with credits (React equivalent of UI.wasabiBar / WasabiBar.as)

interface Props {
	thanks: string;
}

export function WasabiBar({ thanks }: Props) {
	return (
		<div
			className="wasabi-bar"
			onClick={() => window.open("http://www.spinfoamgames.com/", "_blank")}
		>
			<div className="wasabi-label wasabi-bar-copyright" style={{ fontSize: 18, color: "#FFF874" }}>
				Copyright 2026 - Spinfoam Games
			</div>
			<div className="wasabi-label wasabi-bar-site">http://www.spinfoamgames.com/</div>
			<div className="wasabi-label wasabi-bar-thanks" style={{ fontSize: 12, color: "#7D4C30" }}>
				{thanks}
			</div>
		</div>
	);
}
