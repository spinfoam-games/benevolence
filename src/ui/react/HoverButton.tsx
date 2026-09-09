//	Image button that swaps between an "off" and "over" image on hover
//	(the React equivalent of UI.hoverButton / the Flash HoverButton.as).
import { useState, type CSSProperties } from "react";
import { Assets, Sounds } from "../../core/assets.ts";

interface Props {
	offName: string;
	overName: string;
	onClick: () => void;
	className?: string;
	style?: CSSProperties;
}

export function HoverButton({ offName, overName, onClick, className, style }: Props) {
	const [hover, setHover] = useState(false);

	return (
		<div
			className={"hover-button" + (className ? " " + className : "")}
			style={style}
			onMouseEnter={() => {
				setHover(true);
				Sounds.PlayButtonHover();
			}}
			onMouseLeave={() => setHover(false)}
			onClick={(event) => {
				event.stopPropagation();
				Sounds.PlayButtonClick();
				onClick();
			}}
		>
			<img src={Assets.imageSrc(hover ? overName : offName)} alt="" />
		</div>
	);
}
