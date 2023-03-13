import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Box from "./box";
import Updatable from "./updatable";

class Bank extends PIXI.Container implements Updatable {
  private cardCountText: PIXI.Text[];
  gameui: GameUI;
  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.cardCountText = [];
    this.y = 0;
    this.x = 0.65 * gameui.app.view.width;

    const width = 0.35 * gameui.app.view.width;
    const height = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 8;
    this.addChild(new Box(0, 0, width, height));

    // CARD_TYPES includes +1 for dev card
    const CARD_TYPES = SETTLERS.NUM_RESOURCE_TYPES + 1;
    const bankPic = new PIXI.Sprite(gameui.textures["bank_icon"]);
    bankPic.width = height * 0.7;
    bankPic.height = height * 0.7;
    bankPic.position.set(width / 15, height / 10);
    this.addChild(bankPic);

    for (let i = 0; i < CARD_TYPES; i++) {
      const isResourceCard = i < SETTLERS.NUM_RESOURCE_TYPES;

      // get the resource card image
      const resource = i as SETTLERS.Resource;
      const resourceStr = SETTLERS.resStr(resource);
      if (resourceStr === "none" && isResourceCard) continue;
      const cardChild = new PIXI.Sprite(
        gameui.textures[
          isResourceCard ? `${resourceStr.toLowerCase()}_card` : "dev_card"
        ]
      );

      // get number of cards in bank
      const numInBank = isResourceCard
        ? gameui.game.bank.get(resource)
        : gameui.game.deck.size();
      const numInBankSprite = new PIXI.Text(numInBank, {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0x000000,
      });

      // set positions of card and number
      const x = ((i + 1) * width) / (CARD_TYPES * 1.5) + width / 6;
      cardChild.scale.set(0.3);
      cardChild.position.set(x, height / 9);

      numInBankSprite.anchor.set(0.5, 0);
      numInBankSprite.position.set(
        x + cardChild.width / 2,
        height / 8 + cardChild.height
      );
      this.cardCountText.push(numInBankSprite);
      this.addChild(cardChild, numInBankSprite);
    }
  }

  update() {
    // CARD_TYPES includes +1 for dev card
    const CARD_TYPES = SETTLERS.NUM_RESOURCE_TYPES + 1;
    for (let i = 0; i < CARD_TYPES; i++) {
      const isResourceCard = i < SETTLERS.NUM_RESOURCE_TYPES;
      const resource = i as SETTLERS.Resource;

      const numInBank = isResourceCard
        ? this.gameui.game.bank.get(resource)
        : this.gameui.game.deck.size();

      this.cardCountText[i].text = numInBank;
    }
  }
}

export default Bank;
