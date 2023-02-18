import { Game } from "settlers";
import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import Board from "./board";
import Inventory from "./inventory";
import Box from "./box";
import Dice from "./dice";
import Bank from "./bank";

class GameUI {
  static DEFAULT_WIDTH = 1000;
  static DEFAULT_HEIGHT = 0.8 * GameUI.DEFAULT_WIDTH;
  static BOARD_HEIGHT_RATIO = 0.85;
  readonly game: Game;
  readonly app: PIXI.Application<PIXI.ICanvas>;
  bank: Bank;
  board: Board;
  inventory: Inventory;
  dice: Dice;
  textures: Record<string, any>;


  constructor(game: Game, container: HTMLElement) {
    this.game = game;
    this.app = new PIXI.Application({
      backgroundColor: "#78bac2",
      resizeTo: container,
    });
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleTileClick = this.handleTileClick.bind(this);
    this.handleEdgeClick = this.handleEdgeClick.bind(this);
    this.initialize = this.initialize.bind(this);
    this.loadTextures().then((textures) => {
      this.textures = textures;
      this.initialize();
    });
  }

  initialize() {
    const { width, height } = this.app.view;

    // VERY IMPORTANT! used for scaling, change scale scale factor to test
    const SCALE_FACTOR = 1;
    this.app.stage.scale.set((SCALE_FACTOR * width) / GameUI.DEFAULT_WIDTH);

    this.board = new Board(this);
    this.app.stage.addChild(this.board);

    this.inventory = new Inventory(this);
    this.app.stage.addChild(this.inventory);

    this.bank = new Bank(this);
    this.app.stage.addChild(this.bank);

    const buyDevCard = new PIXI.Container();
    buyDevCard.x = this.app.view.width * 0.5;
    buyDevCard.y = GameUI.BOARD_HEIGHT_RATIO * this.app.view.height;
    buyDevCard.addChild(
      new Box(
        0,
        0,
        0.1 * width,
        (1 - GameUI.BOARD_HEIGHT_RATIO) * this.app.view.height
      )
    );
    buyDevCard.addChild(new PIXI.Text("buy dev \ncard"));
    this.app.stage.addChild(buyDevCard);

    const trade = new PIXI.Container();
    trade.x = this.app.view.width * 0.6;
    trade.y = GameUI.BOARD_HEIGHT_RATIO * this.app.view.height;
    trade.addChild(
      new Box(
        0,
        0,
        0.1 * width,
        (1 - GameUI.BOARD_HEIGHT_RATIO) * this.app.view.height
      )
    );
    trade.addChild(new PIXI.Text("trade"));
    this.app.stage.addChild(trade);

    const roll = new PIXI.Container();
    roll.x = this.app.view.width * 0.7;
    roll.y = GameUI.BOARD_HEIGHT_RATIO * this.app.view.height;
    roll.addChild(
      new Box(
        0,
        0,
        0.1 * width,
        (1 - GameUI.BOARD_HEIGHT_RATIO) * this.app.view.height
      )
    );
    roll.addChild(new PIXI.Text("roll"));
    this.app.stage.addChild(roll);

    this.dice = new Dice(this);
    this.app.stage.addChild(this.dice);

    /*
    // initialize bank
    const bankPic = new PIXI.Sprite(this.textures["bank"]);
    bankPic.position.set(500, 400);
    this.app.stage.addChild(bankPic);

    // initialize the # of resource cards in bank
    for (let i = 0; i < SETTLERS.NUM_RESOURCE_TYPES; i++) {
      const resource = i as SETTLERS.Resource;
      const resourceStr = SETTLERS.resStr(resource);
      if (resourceStr === "none") continue;

      const cardChild = new PIXI.Sprite(
        this.textures[`${resourceStr.toLowerCase()}_card`]
      );
      const numInBank = this.game.bank.get(resource);

      cardChild.anchor.set(0.5);
      cardChild.position.set((i + 1) * 50 + 500, 500);

      const numInBankSprite = new PIXI.Text(numInBank, {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xdb04e9,
        align: "right",
      });
      numInBankSprite.position.set((i + 1) * 50 + 480, 520);
      this.app.stage.addChild(numInBankSprite);
      this.app.stage.addChild(cardChild);
    }

    // intialize the player information
    this.game.players.map((p, index) => {
      const recWidth = width / 4;
      const recHeight = height / 8;

      const recX = width - recWidth;
      const recY = height - recHeight * (index + 1);

      // draw rectangles containing player info
      const g = new PIXI.Graphics();
      const notTurnColor = 0xc9d7e9;
      const turnColor = 0xfff4c8;

      g.beginFill(this.game.getTurn() === index ? turnColor : notTurnColor);
      g.drawRect(recX, recY, recWidth - 1, recHeight - 1);
      // g.scale.set(width / GameUI.DEFAULT_WIDTH)
      g.endFill();
      this.app.stage.addChild(g);

      // display player information inside rectangles
      // TODO: display player names

      const victoryPs = new PIXI.Text(p.victoryPoints, {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0x000000,
      });
      victoryPs.position.set(
        recX + recWidth / 5,
        height - (recHeight * (index + 1)) / 2
      );
      g.addChild(victoryPs);

      const numDevCards = new PIXI.Text(p.devCards.size(), {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xdb04e9,
        align: "right",
      });
      this.app.stage.addChild(numDevCards);

      const numCardsHand = new PIXI.Text(p.resources.size(), {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xdb04e9,
        align: "right",
      });
      this.app.stage.addChild(numCardsHand);

      const knightsPlayed = new PIXI.Text(p.knightsPlayed, {
        fontFamily: "Arial",
        fontSize: 50,
        fill: 0xff1010,
        align: "left",
      });
      knightsPlayed.x = 10;
      this.app.stage.addChild(knightsPlayed);

      const numLongestRoad = new PIXI.Text(
        this.game.board.getLongestRoad(index),
        {
          fontFamily: "Arial",
          fontSize: 50,
          fill: 0xff1010,
          align: "left",
        }
      );
      this.app.stage.addChild(numLongestRoad);
    });
    */
  }

  render() {
    // draw board
    // draw overlay
  }

  renderBoard() {
    // tiles
    // nodes
    // edges
  }

  handleNodeClick(node: number) {
    console.log(`node ${node} clicked`);
  }
  handleTileClick(tile: number) {
    console.log(`tile ${tile} clicked`);
  }
  handleEdgeClick([n0, n1]: [number, number]) {
    console.log(`edge (${n0}, ${n1}) clicked`);
  }

  getUI() {
    return this.app.view;
  }

  async loadTextures() {
    return {
      // tiles
      brick_tile: await PIXI.Assets.load(
        require("../assets/tiles/brick_tile.png")
      ),
      none_tile: await PIXI.Assets.load(
        require("../assets/tiles/desert_without_robber.png")
      ),
      ore_tile: await PIXI.Assets.load(require("../assets/tiles/ore_tile.png")),
      grain_tile: await PIXI.Assets.load(
        require("../assets/tiles/wheat_tile.png")
      ),
      lumber_tile: await PIXI.Assets.load(
        require("../assets/tiles/wood_tile.png")
      ),
      wool_tile: await PIXI.Assets.load(
        require("../assets/tiles/wool_tile.png")
      ),
      robber: await PIXI.Assets.load(require("../assets/robber.png")),
      road_0: await PIXI.Assets.load(require("../assets/roads/road_0.png")),
      road_1: await PIXI.Assets.load(require("../assets/roads/road_1.png")),
      road_2: await PIXI.Assets.load(require("../assets/roads/road_2.png")),
      road_3: await PIXI.Assets.load(require("../assets/roads/road_3.png")),
      no_2: await PIXI.Assets.load(require("../assets/numbers/no_2.png")),
      no_3: await PIXI.Assets.load(require("../assets/numbers/no_3.png")),
      no_4: await PIXI.Assets.load(require("../assets/numbers/no_4.png")),
      no_5: await PIXI.Assets.load(require("../assets/numbers/no_5.png")),
      no_6: await PIXI.Assets.load(require("../assets/numbers/no_6.png")),
      no_8: await PIXI.Assets.load(require("../assets/numbers/no_8.png")),
      no_9: await PIXI.Assets.load(require("../assets/numbers/no_9.png")),
      no_10: await PIXI.Assets.load(require("../assets/numbers/no_10.png")),
      no_11: await PIXI.Assets.load(require("../assets/numbers/no_11.png")),
      no_12: await PIXI.Assets.load(require("../assets/numbers/no_12.png")),
      settlement_0: await PIXI.Assets.load(
        require("../assets/settlements/settlement_0.png")
      ),
      // bank
      bank: await PIXI.Assets.load(require("../assets/bank.png")),

      // cards
      brick_card: await PIXI.Assets.load(
        require("../assets/resource_cards/brick_card.svg")
      ),
      lumber_card: await PIXI.Assets.load(
        require("../assets/resource_cards/wood_card.svg")
      ),
      wool_card: await PIXI.Assets.load(
        require("../assets/resource_cards/wool_card.svg")
      ),
      grain_card: await PIXI.Assets.load(
        require("../assets/resource_cards/wheat_card.svg")
      ),
      ore_card: await PIXI.Assets.load(
        require("../assets/resource_cards/ore_card.svg")
      ),
      dev_card: await PIXI.Assets.load(require("../assets/dev_card.png")),

      backdrop: await PIXI.Assets.load(require("../assets/backdrop.png")),
      // dice
      dice_1: await PIXI.Assets.load(require("../assets/dice/1.png")),
      dice_2: await PIXI.Assets.load(require("../assets/dice/2.png")),
      dice_3: await PIXI.Assets.load(require("../assets/dice/3.png")),
      dice_4: await PIXI.Assets.load(require("../assets/dice/4.png")),
      dice_5: await PIXI.Assets.load(require("../assets/dice/5.png")),
      dice_6: await PIXI.Assets.load(require("../assets/dice/6.png")),
    };
  }
}

export default GameUI;
