//	Title screen (React port of TitleState.as). Renders the logo, the three
//	menu buttons, the how-to-play text, and hosts the level-select overlays.
import { useGameStore } from "../../store.ts"
import { Assets } from "../../core/assets.ts"
import { Game } from "../../game.ts"
import { HoverButton } from "./HoverButton.tsx"
import { WasabiBar } from "./WasabiBar.tsx"
import { StandardLevelsOverlay } from "./StandardLevelsOverlay.tsx"
import { CustomLevelsOverlay } from "./CustomLevelsOverlay.tsx"
import { Card, Group, ScrollArea, Stack, Text } from "@mantine/core"

const INSTRUCTIONS =
	"How to play:\n\n" +
	"In each level you will be shown a pattern by a small character in the lower-right corner of the screen.\n" +
	"Your job is to match the arrangement of the large tiles to the pattern you're shown.\n" +
	"To do this, click on a tile that is adjacent to the empty space; the tile will slide into the space.\n" +
	"When you've correctly matched the pattern, the person will rejoice, and build their home on the tiles you've arranged!"

const THANKS =
	"With graphics from the PlanetCute set and gameplay inspired by\n" +
	"the CuteGod design, both by Daniel Cook (http://lostgarden.com)"

export function TitleScreen() {
	const overlay = useGameStore((s) => s.titleOverlay)
	const openStandardLevels = useGameStore((s) => s.openStandardLevels)
	const openCustomLevels = useGameStore((s) => s.openCustomLevels)

	return (
		<ScrollArea.Autosize type="auto" style={{ width: '100%', height: '100%' }} scrollbarSize={12}
			p={0} m={0}
		>
			<Stack
				align="stretch"
				justify="space-between"
				h='100vh'
				style={{ position: 'relative', zIndex: 10 }}
				gap={0}
				py={0}
				m={0}
			>
				<Group align="center" justify="center" py='xl'>
					<img src={Assets.imageSrc("Title")} alt="Benevolence" />
				</Group>

				<Group align="center" justify="center" py='xl'>
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
				</Group>

				<Group align="center" justify="center" py='xl'>
					<Card
						withBorder w='60%'
						bg='rgba(255, 255, 255, 0.5)'
						p='md' shadow='md'
						style={{ borderTop: '1px solid white', borderBottom: '1px solid var(--mantine-color-gray-1)' }}
					>
						<Text fz='sm' style={{ whiteSpace: 'pre-line' }}>
							{INSTRUCTIONS}
						</Text>
					</Card>
				</Group>

				<Text ta="right" px='md' fz='xs' c='white'
					style={{ textShadow: '1px 0 black, -1px 0 black, 0 1px black, 0 -1px black' }}
				>
					Version {Game.VERSION}
				</Text>

				<WasabiBar thanks={THANKS} />

				{overlay === "standard" && <StandardLevelsOverlay />}
				{overlay === "custom" && <CustomLevelsOverlay />}
			</Stack>
		</ScrollArea.Autosize>
	)
}
