import Button from "./button";
import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import GameUI, { UIEvents } from "./game-ui";

class BuyDevCard extends PIXI.Container {
  readonly gameui: GameUI;
  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    const { width, height } = gameui.app.view;
    this.x = width * 0.525;
    this.y =
      GameUI.BOARD_HEIGHT_RATIO * height +
      0.05 * (1 - GameUI.BOARD_HEIGHT_RATIO) * height;
    const devCardButtonIcon = new PIXI.Sprite(gameui.textures["dev_card"]);
    devCardButtonIcon.scale.set(0.5);
    const buyDevCard = new Button({
      x: 0,
      y: 0,
      width: 0.1 * width,
      height: 0.9 * (1 - GameUI.BOARD_HEIGHT_RATIO) * height,
      content: devCardButtonIcon,
      onclick: this._onclick.bind(this),
    });
    this.addChild(buyDevCard);
  }

  _onclick() {
    const { game } = this.gameui;
    const action = new SETTLERS.Action(
      SETTLERS.ActionType.DrawDevCard,
      this.gameui.getPerspective(),
      {}
    );
    if (game.isValidAction(action).valid) {
      const resultAction = game.handleAction(action);
      this.gameui.runEventHandlers(UIEvents.BuyDevCard, resultAction!);
      this.gameui.update();
    }
  }
}

export default BuyDevCard;
