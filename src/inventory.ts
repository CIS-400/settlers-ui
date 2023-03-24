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
          game.players[gameui.getPerspective()].resources.get(
            i as SETTLERS.Resource
          ),
          {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0x000000,
          }
        );
      } else {
        const devCard = i - SETTLERS.NUM_RESOURCE_TYPES;
        card = new PIXI.Sprite(
          gameui.textures[
            `${SETTLERS.devCardStr(devCard as SETTLERS.DevCard)
              .toLowerCase()
              .replace(/\s/g, "")}_card`
          ]
        );

        // make dev cards playable
        const isMonopoly = devCard === SETTLERS.DevCard.Monopoly;
        const isKnight = devCard === SETTLERS.DevCard.Knight;
        const isYoP = devCard === SETTLERS.DevCard.YearOfPlenty;
        const isRoadBuilder = devCard === SETTLERS.DevCard.RoadBuilder;
        if (isMonopoly || isKnight || isYoP || isRoadBuilder) {
          card.interactive = true;
          card.on("click", (event) => {
            if (
              (isMonopoly &&
                game.players[gameui.getPerspective()].devCards.has(
                  SETTLERS.DevCard.Monopoly
                )) ||
              (isKnight &&
                game.players[gameui.getPerspective()].devCards.has(
                  SETTLERS.DevCard.Knight
                )) ||
              (isYoP &&
                game.players[gameui.getPerspective()].devCards.has(
                  SETTLERS.DevCard.YearOfPlenty
                )) ||
              (isRoadBuilder &&
                game.players[gameui.getPerspective()].devCards.has(
                  SETTLERS.DevCard.RoadBuilder
                ))
            ) {
              this._onclick(devCard);
            }
          });
        }

        // text stuff
        const c = (i - SETTLERS.NUM_RESOURCE_TYPES) as SETTLERS.DevCard;
        const persp = gameui.getPerspective();
        text = new PIXI.Text(
          game.players[persp].devCards.get(c) + persp === game.getTurn()
            ? game.purchasedCards.get(c)
            : 0,
          {
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0x000000,
          }
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
          this.gameui.getPerspective()
        ].resources.get(i as SETTLERS.Resource);
      } else {
        const c = (i - SETTLERS.NUM_RESOURCE_TYPES) as SETTLERS.DevCard;
        const persp = this.gameui.getPerspective();
        this.cardCountText[i].text =
          this.gameui.game.players[persp].devCards.get(c) + persp ===
          this.gameui.game.getTurn()
            ? this.gameui.game.purchasedCards.get(c)
            : 0;
      }
    }
  }

  _onclick(devCard: SETTLERS.DevCard) {
    const { game } = this.gameui;
    const action = this.getPotentialAction(devCard);
    if (!game.isValidAction(action).valid) return;
    game.handleAction(action);
    this.gameui.update();
  }

  private getPotentialAction(devCard: SETTLERS.DevCard) {
    switch (devCard) {
      case SETTLERS.DevCard.Knight:
        return new SETTLERS.Action(
          SETTLERS.ActionType.PlayRobber,
          this.gameui.game.getTurn(),
          {}
        );
      case SETTLERS.DevCard.YearOfPlenty:
        return new SETTLERS.Action(
          SETTLERS.ActionType.PlayYearOfPlenty,
          this.gameui.getPerspective(),
          {}
        );
      case SETTLERS.DevCard.Monopoly:
        return new SETTLERS.Action(
          SETTLERS.ActionType.PlayMonopoly,
          this.gameui.getPerspective(),
          {}
        );
      default: // road builder case
        return new SETTLERS.Action(
          SETTLERS.ActionType.PlayRoadBuilder,
          this.gameui.getPerspective(),
          {}
        );
    }
  }
}

export default Inventory;
