import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Box from "./box";
import Updatable from "./updatable";

class PlayerInfo extends PIXI.Container implements Updatable {
  private victoryPText: PIXI.Text[];
  private numCardsText: PIXI.Text[];
  private devCardsText: PIXI.Text[];
  private knightsText: PIXI.Text[];
  private roadsText: PIXI.Text[];
  private pfps: PIXI.Sprite[];
  gameui: GameUI;

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.victoryPText = [];
    this.numCardsText = [];
    this.devCardsText = [];
    this.knightsText = [];
    this.roadsText = [];

    this.pfps = [];

    this.y = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 8;
    this.x = 0.7 * gameui.app.view.width;
    const width = 0.3 * gameui.app.view.width;
    const height = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 10;

    gameui.game.players.map((p, index) => {
      // for text sprite
      const defaultFont = {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0x000000,
      };

      // display player information inside boxes
      this.addChild(new Box(0, height * index + 1, width, height));

      // TODO: display player names
      const pfp = new PIXI.Sprite(gameui.textures[`player_icon${index}`]);
      pfp.alpha = gameui.getPerspective() === index ? 1 : 0.3;
      pfp.width = height * 0.4;
      pfp.height = height * 0.4;
      let x = width / 8;
      let y = height * index + 0.25 * height;
      pfp.position.set(x, y);
      this.addChild(pfp);
      this.pfps.push(pfp);

      const victoryPs = new PIXI.Text(p.victoryPoints, defaultFont);
      victoryPs.anchor.set(0.5, 0);
      victoryPs.position.set(x + pfp.width / 2, y + pfp.height);
      this.addChild(victoryPs);
      this.victoryPText.push(victoryPs);

      // display back of resource card AND number of cards in hand
      const resourceCard = new PIXI.Sprite(gameui.textures["back_card"]);
      const ratio = resourceCard.height / resourceCard.width;
      resourceCard.height = height * 0.65;
      resourceCard.width = resourceCard.height / ratio;
      x = (width / 8) * 2.3;
      y = height * index + 0.1 * height;
      resourceCard.position.set(x, y);
      this.addChild(resourceCard);
      const numCardsHand = new PIXI.Text(p.resources.size(), defaultFont);
      numCardsHand.anchor.set(0.5, 0);
      numCardsHand.position.set(
        x + resourceCard.width / 2,
        y + resourceCard.height
      );
      this.addChild(numCardsHand);
      this.numCardsText.push(numCardsHand);

      // display back of dev card AND number of dev cards in hand
      const devCard = new PIXI.Sprite(gameui.textures["dev_card"]);
      const ratio2 = devCard.height / devCard.width;
      devCard.height = height * 0.65;
      devCard.width = devCard.height / ratio2;
      x = (width / 8) * 3.5;
      y = height * index + 0.1 * height;
      devCard.position.set(x, y);
      this.addChild(devCard);
      const numDevCards = new PIXI.Text(p.devCards.size(), defaultFont);
      numDevCards.anchor.set(0.5, 0);
      numDevCards.position.set(x + devCard.width / 2, y + devCard.height);
      this.addChild(numDevCards);
      this.devCardsText.push(numDevCards);

      // display largest army AND the number of knights each player has played
      const largeArmy = new PIXI.Sprite(
        gameui.textures[
          `large_army${gameui.game.largestArmy.owner === index ? "_gold" : ""}`
        ]
      );
      largeArmy.height = height * 0.65;
      largeArmy.width = largeArmy.height;
      x = (width / 8) * 4.8;
      y = height * index + 0.1 * height;
      largeArmy.position.set(x, y);
      this.addChild(largeArmy);
      const knightsPlayed = new PIXI.Text(p.knightsPlayed, defaultFont);
      knightsPlayed.anchor.set(0.5, 0);
      knightsPlayed.position.set(x + largeArmy.width / 2, y + largeArmy.height);
      this.addChild(knightsPlayed);
      this.knightsText.push(knightsPlayed);

      // display longest road AND the length of the longest road
      const longRoad = new PIXI.Sprite(
        gameui.textures[
          `long_road${gameui.game.longestRoad.owner === index ? "_gold" : ""}`
        ]
      );
      longRoad.height = height * 0.65;
      longRoad.width = longRoad.height;
      x = (width / 8) * 6.1;
      y = height * index + 0.1 * height;
      longRoad.position.set(x, y);
      this.addChild(longRoad);
      const numLongestRoad = new PIXI.Text(
        gameui.game.board.getLongestRoad(index),
        defaultFont
      );
      numLongestRoad.anchor.set(0.5, 0);
      numLongestRoad.position.set(x + longRoad.width / 2, y + longRoad.height);
      this.addChild(numLongestRoad);
      this.roadsText.push(numLongestRoad);
    });
  }

  update() {
    this.gameui.game.players.map((player, i) => {
      this.victoryPText[i].text = player.victoryPoints;
      this.numCardsText[i].text = player.resources.size();
      this.devCardsText[i].text = player.devCards.size();
      this.knightsText[i].text = player.knightsPlayed;
      this.roadsText[i].text = this.gameui.game.board.getLongestRoad(i);
      this.pfps[i].alpha = this.gameui.game.getTurn() === i ? 1 : 0.3;
    });
  }
}

export default PlayerInfo;
