import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import GameUI from "./game-ui";
import Updatable from "./updatable";

class Dice extends PIXI.Container implements Updatable {
  private sprites: [PIXI.Sprite, PIXI.Sprite];
  gameui: GameUI;
  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    const width = 0.2 * gameui.app.view.width;
    const height = (1 - GameUI.BOARD_HEIGHT_RATIO) * gameui.app.view.height;
    this.position.set(
      0.8 * gameui.app.view.width,
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
    this.interactive = true;
    this.addChild(...this.sprites);
    this.on("click", this._onclick.bind(this));
    this.update();
  }

  _onclick() {
    const { game } = this.gameui;
    const action = this.getPotentialAction();
    if (!game.isValidAction(action).valid) return;
    game.handleAction(action);
    this.gameui.update();
  }

  update() {
    const { game } = this.gameui;
    const alpha = game.isValidAction(this.getPotentialAction()).valid
      ? 1.0
      : 0.75;
    this.sprites.map((sprite) => (sprite.alpha = alpha));
    const roll = game.getLastRoll();
    if (roll[0] !== -1) {
      this.sprites[0].texture = this.gameui.textures[`dice_${roll[0]}`];
      this.sprites[1].texture = this.gameui.textures[`dice_${roll[1]}`];
    }
  }

  private getPotentialAction() {
    return new SETTLERS.Action(
      SETTLERS.ActionType.Roll,
      this.gameui.getPerspective(),
      {}
    );
  }
}

export default Dice;
