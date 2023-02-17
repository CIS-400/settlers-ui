import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import GameUI from "./game-ui";

class Dice extends PIXI.Container {
  private sprites: [PIXI.Sprite, PIXI.Sprite];
  constructor(gameui: GameUI) {
    super();
    const width = 0.2 * gameui.app.view.width;
    const height = (1 - GameUI.BOARD_HEIGHT_RATIO) * gameui.app.view.height;
    this.position.set(
      0.85 * gameui.app.view.width,
      GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height
    );
    this.sprites = [
      new PIXI.Sprite(gameui.textures[`dice_1`]),
      new PIXI.Sprite(gameui.textures[`dice_1`]),
    ];
    this.sprites[0].anchor.set(0.5);
    this.sprites[1].anchor.set(0.5);
    this.sprites[0].y = height / 2;
    this.sprites[1].y = height / 2;
    this.sprites[1].x = width / 2;
    this.addChild(...this.sprites);
  }
}

export default Dice;
