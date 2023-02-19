import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import Box from "./box";
import Button from "./button";
import GameUI from "./game-ui";

class TradeOfferStagingArea extends PIXI.Container {
  private offer: SETTLERS.ResourceBundle;
  private request: SETTLERS.ResourceBundle;
  private offerText: PIXI.Sprite[];
  private requestText: PIXI.Sprite[];

  constructor(gameui: GameUI) {
    super();
    this.offerText = [];
    this.requestText = [];
    this.offer = new SETTLERS.ResourceBundle();
    this.request = new SETTLERS.ResourceBundle();
    this.x = GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    this.y = gameui.app.view.height / 2;
    const width = gameui.app.view.width - this.x;
    const height = 0.3 * gameui.app.view.height;

    const STAGE_AREA_HEIGHT = 0.75 * height;
    const BTN_AREA_HEIGHT = height - STAGE_AREA_HEIGHT;
    this.addChild(new Box(0, 0, width, STAGE_AREA_HEIGHT));

    const tradeWithBankIcon = new PIXI.Sprite(gameui.textures["bank_icon"]);
    tradeWithBankIcon.scale.set(0.2);
    this.addChild(
      new Button({
        x: 0,
        y: STAGE_AREA_HEIGHT + 0.05 * BTN_AREA_HEIGHT,
        width: 0.2 * width,
        height: 0.9 * BTN_AREA_HEIGHT,
        content: tradeWithBankIcon,
      })
    );
    const acceptIcon = new PIXI.Sprite(gameui.textures["accept"]);
    acceptIcon.scale.set(0.8);
    this.addChild(
      new Button({
        x: 0.2 * width,
        y: STAGE_AREA_HEIGHT + 0.05 * BTN_AREA_HEIGHT,
        width: 0.2 * width,
        height: 0.9 * BTN_AREA_HEIGHT,
        content: acceptIcon,
      })
    );
    const declineIcon = new PIXI.Sprite(gameui.textures["decline"]);
    declineIcon.scale.set(0.8);
    this.addChild(
      new Button({
        x: 0.4 * width,
        y: STAGE_AREA_HEIGHT + 0.05 * BTN_AREA_HEIGHT,
        width: 0.2 * width,
        height: 0.9 * BTN_AREA_HEIGHT,
        content: declineIcon,
      })
    );

    const game = gameui.game;
    let x: number, card: PIXI.Sprite, text: PIXI.Text;
    for (let i = 0; i < SETTLERS.NUM_RESOURCE_TYPES; i++) {
      x = (i * width) / SETTLERS.NUM_RESOURCE_TYPES;
      card = new PIXI.Sprite(
        gameui.textures[`${SETTLERS.resStr(i as SETTLERS.Resource)}_card`]
      );
      card.position.set(x, 0.05 * STAGE_AREA_HEIGHT);
      this.addChild(card);
      card = new PIXI.Sprite(
        gameui.textures[`${SETTLERS.resStr(i as SETTLERS.Resource)}_card`]
      );
      card.position.set(x, 0.5 * STAGE_AREA_HEIGHT);
      this.addChild(card);
      text = new PIXI.Text(0);
      text.anchor.set(0.5);
      text.position.set(
        x + 0.5 * card.width,
        0.05 * STAGE_AREA_HEIGHT + 1.25 * card.height
      );
      this.addChild(text);
      this.offerText.push(text);
      text = new PIXI.Text(0);
      text.anchor.set(0.5);
      text.position.set(
        x + 0.5 * card.width,
        0.5 * STAGE_AREA_HEIGHT + 1.25 * card.height
      );
      this.addChild(text);
      this.requestText.push(text);
    }
  }
}

export default TradeOfferStagingArea;
