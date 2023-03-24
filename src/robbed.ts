import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import Box from "./box";
import GameUI from "./game-ui";
import Updatable from "./updatable";

class Robbed extends PIXI.Container implements Updatable {
  gameui: GameUI;
  private widthBox: number;
  private heightBox: number;
  private chosenVictim: number;

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.x = 0.7 * gameui.app.view.width;
    this.y = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 1.7;
    this.widthBox = 0.3 * gameui.app.view.width;
    this.heightBox = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 5;
    this.addChild(new Box(0, 0, this.widthBox, this.heightBox));
    this.addRobberText();
    this.visible = false;
  }

  private addRobberText() {
    const robberText = new PIXI.Text("Choose a player to steal 1 random card", {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0x000000,
    });
    robberText.anchor.set(0.5, 0);
    robberText.position.set(this.x / 4.5, this.y / 10);
    this.addChild(robberText);
  }

  // for each new robber time moment, clear all children then draw back box and text
  private clearVictims() {
    this.removeChildren();
    this.addChild(new Box(0, 0, this.widthBox, this.heightBox));
    this.addRobberText();
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
      SETTLERS.ActionType.Rob,
      this.gameui.getPerspective(),
      { victim: this.chosenVictim }
    );
  }

  update() {
    // check if in robbing state
    if (this.gameui.game.getTurnState() !== SETTLERS.TurnState.Robbing) {
      return;
    }

    // make ui visible
    this.visible = true;

    // clear previous, old pfps
    this.clearVictims();

    const victims = this.gameui.game.getRobberVictims();
    const numVictims = victims.length;
    for (let i = 0; i < numVictims; i++) {
      const victim = victims[i];
      const pfp = new PIXI.Sprite(this.gameui.textures[`player_icon${victim}`]);
      pfp.width = this.heightBox * 0.3;
      pfp.height = this.heightBox * 0.3;
      pfp.anchor.set(0.5, 0);

      const x =
        (this.widthBox * i) / (numVictims + 1) +
        this.widthBox / (numVictims + 1);
      const y = this.heightBox / 2;
      pfp.position.set(x, y);
      this.addChild(pfp);

      pfp.interactive = true;
      pfp.on("click", (event) => {
        this.chosenVictim = victims[i];
        this._onclick();
        this.visible = false;
      });
      // pfp.on("click", this._onclick.bind(this));
    }
  }
}

export default Robbed;
