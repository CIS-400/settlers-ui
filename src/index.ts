import * as PIXI from "pixi.js";

import { Game } from "settlers";
import GameUI from "./game-ui";

async function init() {
  const gameui = new GameUI(new Game());
  gameui.displayPlayerInfo();
  document.body.appendChild(gameui.getUI());
}

export default init();
