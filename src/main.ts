//	Entry point: load styles and start the game once the page is ready.
import "./style.css";
import { Game } from "./game.ts";

window.addEventListener("load", () => Game.init());
