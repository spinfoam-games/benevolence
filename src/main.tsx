//	Entry point: mount the React app.
import "@mantine/core/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.ts";
import "./style.css";
import { App } from "./App.tsx";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");

createRoot(container).render(
	<StrictMode>
		<MantineProvider theme={theme} defaultColorScheme="light">
			<App />
		</MantineProvider>
	</StrictMode>,
);
