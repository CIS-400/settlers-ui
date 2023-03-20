import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import Box from "./box";
import GameUI from "./game-ui";
import Updatable from "./updatable";

class Monopoly extends PIXI.Container implements Updatable {
  gameui: GameUI;
  private widthBox: number;
  private heightBox: number;
  private chosenResource: SETTLERS.Resource;

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.gameui = gameui;
    this.x = 0.7 * gameui.app.view.width;
    this.y = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 1.7;
    this.widthBox = 0.3 * gameui.app.view.width;
    this.heightBox = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 5;
    this.addChild(new Box(0, 0, this.widthBox, this.heightBox));
    this.visible = false;

    // render box and cards
    const CARD_TYPES = SETTLERS.NUM_RESOURCE_TYPES;
    for (let i = 0; i < CARD_TYPES; i++) {
      // get the resource card image
      const resource = i as SETTLERS.Resource;
      const resourceStr = SETTLERS.resStr(resource);
      const cardChild = new PIXI.Sprite(
        this.gameui.textures[`${resourceStr.toLowerCase()}_card`]
      );
      
      const x = (this.widthBox * i) / (CARD_TYPES + 1) +
      this.widthBox / (CARD_TYPES + 1);

      cardChild.scale.set(0.3);
      cardChild.position.set(x, this.heightBox / 2.5);
      cardChild.anchor.set(0.5, 0);

      cardChild.interactive = true;
      cardChild.on("click", (event) => {
        this.chosenResource = resource;
        this._onclick();
      });

      this.addChild(cardChild);

      const monopolyText = new PIXI.Text("Select resource all other players must give you", {
        fontFamily: "Arial",
        fontSize: 13,
        fill: 0x000000,
      });
      monopolyText.anchor.set(0.5, 0);
      monopolyText.position.set(this.x / 4.5, this.y / 15);
      this.addChild(monopolyText);
    }
  }

//   private clearPrevious() {
//     this.removeChildren();
//     this.addChild(new Box(0, 0, this.widthBox, this.heightBox));
//   }

  update() {
    // check if in choosing resource Monopoly state
    if (
      this.gameui.game.getTurnState() !==
      SETTLERS.TurnState.SelectingMonopolyResource
    ) {
      return;
    }

    // make ui visible
    this.visible = true;

    // clear previous, old resources
    // this.clearPrevious();
  }

  _onclick() {
    const { game } = this.gameui;
    const action = this.getPotentialAction();
    if (!game.isValidAction(action).valid) return;
    game.handleAction(action);
    this.gameui.update();

    // set ui visibility to false after selecting resource
    this.visible = false;
  }

  private getPotentialAction() {
    return new SETTLERS.Action(
      SETTLERS.ActionType.SelectMonopolyResource,
      this.gameui.game.getTurn(),
      { resource: this.chosenResource }
    );
  }
}

export default Monopoly;
