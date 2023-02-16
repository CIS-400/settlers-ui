import * as PIXI from "pixi.js";

import { Game } from "settlers";
import GameUI from "./game-ui";

async function init() {
  const pixiContainer = document.getElementById("pixi-container")!;
  const gameui = new GameUI(new Game(), pixiContainer);
  pixiContainer.appendChild(gameui.getUI());
}

export default init();
