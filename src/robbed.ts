import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import Box from "./box";
import Button from "./button";
import GameUI from "./game-ui";
import Updatable from "./updatable";

class Robbed extends PIXI.Container implements Updatable {
  gameui: GameUI;
  private pfps: PIXI.Sprite[];
  private widthBox: number;
  private heightBox: number;
  private chosenVictim: number;

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.x = 0.7 * gameui.app.view.width;
    this.y = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 1.7;
    this.widthBox = 0.3 * gameui.app.view.width;
    this.heightBox = GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height / 5;
    this.addChild(new Box(0, 0, this.widthBox, this.heightBox));

    const robberText = new PIXI.Text("Choose a player to steal 1 random card", {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0x000000,
    });
    robberText.anchor.set(0.5, 0);
    robberText.position.set(this.x/4.5, this.y/10);
    this.addChild(robberText);
  }

  _onclick() {
    const { game } = this.gameui;
    const action = this.getPotentialAction();
    if (!game.isValidAction(action).valid) return;
    game.handleAction(action);
    this.gameui.update();
  }

  private getPotentialAction() {
    console.log(this.chosenVictim)
    return new SETTLERS.Action(
      SETTLERS.ActionType.Rob,
      this.gameui.game.getTurn(),
      {victim: this.chosenVictim}
    );
  }

  update() {
    // clear pfps
    this.pfps = [];

    // const victims = [0, 1, 2]; // TODO delete
    const victims = this.gameui.game.getRobberVictims();
    const numVictims = victims.length;
    for (let i = 0; i < numVictims; i++) {
        const victim = victims[i];
        const pfp = new PIXI.Sprite(this.gameui.textures[`player_icon${victim}`]);
        pfp.width = this.heightBox * 0.3;
        pfp.height = this.heightBox * 0.3;
        pfp.anchor.set(0.5, 0)

        let x = this.widthBox * i/(numVictims+1) + this.widthBox/(numVictims+1);
        let y = this.heightBox / 2;
        pfp.position.set(x, y);
        this.addChild(pfp);

        pfp.interactive = true;
        pfp.on("click", (event) => {
            this.chosenVictim = victims[i];
            this._onclick();
          });
        // pfp.on("click", this._onclick.bind(this));
        this.pfps.push(pfp);
    }
  }
}

export default Robbed;
