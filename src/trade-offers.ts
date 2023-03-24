import Box from "./box";
import Updatable from "./updatable";
import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import * as SETTLERS from "settlers";
import Button from "./button";

class TradeOffers extends PIXI.Container implements Updatable {
  readonly gameui;
  private tradeOffers: PIXI.Container[];
  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.tradeOffers = [];
    const { width, height } = gameui.app.view;
    const y_offset = 0.01 * height;
    const x_offset = 0.01 * width;
    this.position.set(x_offset, y_offset);
  }
  update() {
    this.tradeOffers.map((tradeOffer) => this.removeChild(tradeOffer));
    this.tradeOffers = [];
    this.gameui.game.getTradeOffers().map((tradeOffer) => {
      const s = new TradeOffer(
        this.gameui,
        this.tradeOffers.length,
        tradeOffer
      );
      this.tradeOffers.push(s);
      this.addChild(s);
    });
  }
}

class TradeOffer extends PIXI.Container implements Updatable {
  readonly gameui: GameUI;
  readonly tradeOffer: SETTLERS.TradeOffer;
  constructor(gameui: GameUI, index: number, tradeOffer: SETTLERS.TradeOffer) {
    super();
    this.gameui = gameui;
    this.decideOnTradeOffer = this.decideOnTradeOffer.bind(this);
    this.tradeOffer = tradeOffer;
    const cont = new PIXI.Container();
    const { width, height } = this.gameui.app.view;
    const cont_height = height / 10;
    const x = this.x;
    const y = this.y + index * cont_height;
    cont.position.set(x, y);

    // box
    const box = new Box(cont.x, cont.y, 0.4 * width, cont_height);
    this.addChild(box);

    const pfp_width = 0.5 * cont_height;
    // offerer
    const offerer = new PIXI.Sprite(
      this.gameui.textures[`player_icon${tradeOffer.offerer}`]
    );
    offerer.width = pfp_width;
    offerer.height = pfp_width;
    offerer.anchor.set(0, 0.5);
    offerer.position.set(x, y + cont_height / 2);
    this.addChild(offerer);

    // others
    const statuses = Object.entries(tradeOffer.status);
    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i][1];
      const player = Number(statuses[i][0]);
      const pfp = new PIXI.Sprite(this.gameui.textures[`player_icon${player}`]);
      pfp.width = pfp_width;
      pfp.height = pfp_width;
      pfp.anchor.set(0, 0.5);
      pfp.position.set(
        x + 0.4 * width - pfp.width * (i + 1),
        y + cont_height / 2
      );
      this.addChild(pfp);
      if (status !== SETTLERS.TradeStatus.Pending) {
        const statusIcon = new PIXI.Sprite(
          this.gameui.textures[
            `${status === SETTLERS.TradeStatus.Accept ? "accept" : "decline"}`
          ]
        );
        statusIcon.scale.set(0.8);
        statusIcon.position.set(pfp.position.x, pfp.position.y);
        this.addChild(statusIcon);
        pfp.interactive = true;
        console.log("here");
        pfp.on("click", () => this.decideOnTradeOffer(status, player));
      }
    }

    let card_x = offerer.x + offerer.width;
    for (let i = 0; i < SETTLERS.NUM_RESOURCE_TYPES; i++) {
      const r = i as SETTLERS.Resource;
      if (tradeOffer.offer.get(r) == 0) continue;
      const card = new PIXI.Sprite(
        gameui.textures[`${SETTLERS.resStr(r)}_card`]
      );
      const text = new PIXI.Text(tradeOffer.offer.get(r));
      card.scale.set(0.2);
      card.position.set(card_x, y + cont_height / 7);
      card_x += card.width;

      text.anchor.set(0.5);
      text.position.set(card.x + card.width / 3, card.y + 1.4 * card.height);
      this.addChild(card, text);
    }

    card_x = x + 0.4 * width - (1 + statuses.length) * pfp_width;
    for (let i = 0; i < SETTLERS.NUM_RESOURCE_TYPES; i++) {
      const r = i as SETTLERS.Resource;
      if (tradeOffer.request.get(r) == 0) continue;
      const card = new PIXI.Sprite(
        gameui.textures[`${SETTLERS.resStr(r)}_card`]
      );
      const text = new PIXI.Text(tradeOffer.request.get(r));
      card.scale.set(0.2);
      card.position.set(card_x, y + cont_height / 7);
      card_x -= card.width;

      text.anchor.set(0.5);
      text.position.set(card.x + card.width / 3, card.y + 1.4 * card.height);
      this.addChild(card, text);
    }
    // if not offerer, add accept option
    if (tradeOffer.offerer !== this.gameui.getPerspective()) {
      const acceptIcon = new PIXI.Sprite(gameui.textures["accept"]);
      acceptIcon.scale.set(0.8);
      this.addChild(
        new Button({
          x: x + 0.4 * width,
          y: y,
          width: 0.1 * width,
          height: cont_height,
          content: acceptIcon,
          onclick: () => this.decideOnTradeOffer(SETTLERS.TradeStatus.Accept),
        })
      );
    }
    const declineIcon = new PIXI.Sprite(gameui.textures["decline"]);
    declineIcon.scale.set(0.8);
    this.addChild(
      new Button({
        x: x + 0.4 * width + 0.1 * width,
        y: y,
        width: 0.1 * width,
        height: cont_height,
        content: declineIcon,
        onclick: () => this.decideOnTradeOffer(SETTLERS.TradeStatus.Decline),
      })
    );
  }
  update() {}
  decideOnTradeOffer(status: SETTLERS.TradeStatus, withPlayer?: number) {
    const { game } = this.gameui;
    const action = new SETTLERS.Action(
      SETTLERS.ActionType.DecideOnTradeOffer,
      this.gameui.getPerspective(),
      {
        status: status,
        id: this.tradeOffer.id,
        withPlayer: withPlayer,
      }
    );
    console.log(action);
    console.log(game.isValidAction(action));
    if (game.isValidAction(action).valid) {
      game.handleAction(action);
      this.gameui.update();
    }
  }
}

export default TradeOffers;
