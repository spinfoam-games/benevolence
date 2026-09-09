//	Brown footer bar with credits (React equivalent of UI.wasabiBar / WasabiBar.as)

import { Group, Stack, Text } from "@mantine/core"

interface Props {
	thanks: string
}

export function WasabiBar({ thanks }: Props) {
	return (
		<div
			className="wasabi-bar"
			onClick={() => window.open("http://www.spinfoamgames.com/", "_blank")}
		>
			<Stack align="center" gap='xs' py='xs'>
				<Group>
					<Text>
						Copyright 2026 - Spinfoam Games
					</Text>
					<Text>&middot;</Text>
					<Text component="a" href="http://www.spinfoamgames.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#0000EE", textDecoration: "underline" }}>
						http://www.spinfoamgames.com/
					</Text>
				</Group>
				<Text fz='xs' c='dimmed'>
					{thanks}
				</Text>
			</Stack>
		</div>
	)
}
