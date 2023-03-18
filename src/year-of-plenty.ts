import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import Box from "./box";
import GameUI from "./game-ui";
import Updatable from "./updatable";

class YearPlenty extends PIXI.Container implements Updatable {
  gameui: GameUI;
  private widthBox: number;
  private heightBox: number;
  private chosenResources: SETTLERS.Resource[];

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.gameui = gameui;
    this.x = 0.7 * gameui.app.view.width;
    this.y = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 1.7;
    this.widthBox = 0.3 * gameui.app.view.width;
    this.heightBox = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 5;
    this.addChild(new Box(0, 0, this.widthBox, this.heightBox));
  }

  private clearPrevious() {
    this.removeChildren();
    this.addChild(new Box(0, 0, this.widthBox, this.heightBox));
  }

  update() {
    // check if in choosing resources YoP state
    if (
      this.gameui.game.getTurnState() !==
      SETTLERS.TurnState.SelectingYearOfPlentyResources
    ) {
      return;
    }

    // make ui visible
    this.visible = true;

    // clear previous, old resources
    this.clearPrevious();

    const CARD_TYPES = SETTLERS.NUM_RESOURCE_TYPES;
    for (let i = 0; i < CARD_TYPES; i++) {
      // get the resource card image
      const resource = i as SETTLERS.Resource;
      const resourceStr = SETTLERS.resStr(resource);

      // TODO, show all resources and up arrow and down arrow indicating how many of each (format like trade UI)
      // check if chosen resources are available in bank.
    }
  }

  _onclick() {
    const { game } = this.gameui;
    const action = this.getPotentialAction();
    if (!game.isValidAction(action).valid) return;
    game.handleAction(action);
    this.gameui.update();
  }

  private getPotentialAction() {
    return new SETTLERS.Action(
      SETTLERS.ActionType.SelectYearOfPlentyResources,
      this.gameui.game.getTurn(),
      { /* TODO */ }
    );
  }
}

export default YearPlenty;
