import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Box from "./box";
import Updatable from "./updatable";

class Inventory extends PIXI.Container implements Updatable {
  private cardCountText: PIXI.Text[];
  gameui: GameUI;
  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;

    this.y =
      0.05 * (1 - GameUI.BOARD_HEIGHT_RATIO) * gameui.app.view.height +
      GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    this.x = 0.01 * gameui.app.view.width;
    this.cardCountText = [];
    const width = 0.5 * gameui.app.view.width;
    const height =
      0.9 * ((1 - GameUI.BOARD_HEIGHT_RATIO) * gameui.app.view.height);

    this.addChild(new Box(0, 0, width, height));

    const CARD_TYPES =
      SETTLERS.NUM_RESOURCE_TYPES + SETTLERS.NUM_DEV_CARD_TYPES;
    const game = gameui.game;
    let x: number, card: PIXI.Sprite, text: PIXI.Text;
    for (let i = 0; i < CARD_TYPES; i++) {
      x = (i * width) / CARD_TYPES;
      if (i < SETTLERS.NUM_RESOURCE_TYPES) {
        card = new PIXI.Sprite(
          gameui.textures[`${SETTLERS.resStr(i as SETTLERS.Resource)}_card`]
        );
        text = new PIXI.Text(
          game.players[game.getTurn()].resources.get(i as SETTLERS.Resource)
        );
      } else {
        card = new PIXI.Sprite(
          gameui.textures[
            `${SETTLERS.devCardStr(
              (i - SETTLERS.NUM_RESOURCE_TYPES) as SETTLERS.DevCard
            )
              .toLowerCase()
              .replace(/\s/g, "")}_card`
          ]
        );
        text = new PIXI.Text(
          game.players[game.getTurn()].devCards.get(
            (i - SETTLERS.NUM_RESOURCE_TYPES) as SETTLERS.DevCard
          )
        );
      }
      card!.position.set(x, height / 5);
      card!.scale.set(0.3);
      text.anchor.set(0.5, 0);
      text!.position.set(x + card!.width / 2, height / 5 + card!.height);
      this.cardCountText.push(text!);
      this.addChild(card!, text!);
    }
  }

  update() {
    const CARD_TYPES =
      SETTLERS.NUM_RESOURCE_TYPES + SETTLERS.NUM_DEV_CARD_TYPES;
    for (let i = 0; i < CARD_TYPES; i++) {
      if (i < SETTLERS.NUM_RESOURCE_TYPES) {
        this.cardCountText[i].text = this.gameui.game.players[
          this.gameui.game.getTurn()
        ].resources.get(i as SETTLERS.Resource);
      } else {
        this.cardCountText[i].text = this.gameui.game.players[
          this.gameui.game.getTurn()
        ].devCards.get((i - SETTLERS.NUM_RESOURCE_TYPES) as SETTLERS.DevCard);
      }
    }
  }
}

export default Inventory;
