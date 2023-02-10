import * as PIXI from "pixi.js";
import { Game } from "settlers";
import GameUI from "./game-ui";
const { Text, Sprite, Assets } = PIXI;
const rgbColor = PIXI.utils.rgb2hex;

const g = new Game();
const children: any = [];
const appBg = rgbColor([100, 100, 100]);
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: appBg,
});
const stage = app.stage;
stage.interactive = true;

async function init() {
  const gameui = new GameUI(new Game());
  document.body.appendChild(gameui.getUI());
}

export default init();
