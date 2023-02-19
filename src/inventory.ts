import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Box from "./box";

class Inventory extends PIXI.Container {
  private cardCountText: PIXI.Text[];
  constructor(gameui: GameUI) {
    super();
    this.y =
      0.05 * (1 - GameUI.BOARD_HEIGHT_RATIO) * gameui.app.view.height +
      GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    this.x = 0;
    this.cardCountText = [];
    const width = 0.5 * gameui.app.view.width;
    const height = 0.9 * (gameui.app.view.height - this.y);

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
        card = new PIXI.Sprite(gameui.textures[`grain_card`]);
        text = new PIXI.Text(
          game.players[game.getTurn()].devCards.get(
            (i - SETTLERS.NUM_RESOURCE_TYPES) as SETTLERS.DevCard
          )
        );
      }
      card!.position.set(x, height / 5);
      text.anchor.set(0.5, 0);
      text!.position.set(x + card!.width / 2, height / 5 + card!.height);
      this.cardCountText.push(text!);
      this.addChild(card!, text!);
    }
  }
}

export default Inventory;
