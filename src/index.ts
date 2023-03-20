import * as PIXI from "pixi.js";

import { Game } from "settlers";
import GameUI from "./game-ui";

async function init() {
  const pixiContainer = document.getElementById("pixi-container")!;
  const gameui = new GameUI(new Game(), pixiContainer);
  pixiContainer.appendChild(gameui.getUI());
  const radios = document.getElementsByName("perspective");
  let persp = 0;
  radios.forEach((radio, index) => {
    radio.addEventListener("click", () => {
      persp = index;
      gameui.setPerspective(index);
    });
  });
  const x = document.getElementsByName("follow")[0];
  x.addEventListener("click", () => {
    gameui.followTurnPerspective = !gameui.followTurnPerspective;
    gameui.setPerspective(persp);
  });
}

export default init();
