import { Game } from "settlers";
import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import Board from "./board";
import Inventory from "./inventory";
import Dice from "./dice";
import Bank from "./bank";
import Button from "./button";
import PlayerInfo from "./player-info";
import TradeOfferStagingArea from "./trade-offer-staging-area";
import EndTurn from "./end-turn";

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
  endTurn: EndTurn;
  playerInfo: PlayerInfo;
  tradeOfferStagingArea: TradeOfferStagingArea;
  textures: Record<string, any>;

  constructor(game: Game, container: HTMLElement) {
    this.game = game;
    this.app = new PIXI.Application({
      backgroundColor: "#78bac2",
      resizeTo: container,
    });
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

    this.playerInfo = new PlayerInfo(this);
    this.app.stage.addChild(this.playerInfo);

    this.tradeOfferStagingArea = new TradeOfferStagingArea(this);
    this.tradeOfferStagingArea.visible = false;
    this.app.stage.addChild(this.tradeOfferStagingArea);

    const devCardButtonIcon = new PIXI.Sprite(this.textures["dev_card"]);
    devCardButtonIcon.scale.set(0.5);
    const buyDevCard = new Button({
      x: this.app.view.width * 0.525,
      y:
        GameUI.BOARD_HEIGHT_RATIO * this.app.view.height +
        0.05 * (1 - GameUI.BOARD_HEIGHT_RATIO) * this.app.view.height,
      width: 0.1 * width,
      height: 0.9 * (1 - GameUI.BOARD_HEIGHT_RATIO) * this.app.view.height,
      content: devCardButtonIcon,
    });
    this.app.stage.addChild(buyDevCard);

    const trade = new Button({
      x: this.app.view.width * 0.64,
      y:
        GameUI.BOARD_HEIGHT_RATIO * this.app.view.height +
        0.05 * (1 - GameUI.BOARD_HEIGHT_RATIO) * this.app.view.height,
      width: 0.1 * width,
      height: 0.9 * (1 - GameUI.BOARD_HEIGHT_RATIO) * this.app.view.height,
      content: new PIXI.Sprite(this.textures["trade"]),
      onclick: () => {
        this.tradeOfferStagingArea.visible = true;
      },
    });
    this.app.stage.addChild(trade);

    this.dice = new Dice(this);
    this.app.stage.addChild(this.dice);

    this.endTurn = new EndTurn(this);
    this.app.stage.addChild(this.endTurn);
  }

  update() {
    this.board.update();
    this.dice.update();
    this.endTurn.update();
    this.playerInfo.update();
    this.bank.update();
    this.inventory.update();
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
      settlement_1: await PIXI.Assets.load(
        require("../assets/settlements/settlement_1.png")
      ),
      settlement_2: await PIXI.Assets.load(
        require("../assets/settlements/settlement_2.png")
      ),
      settlement_3: await PIXI.Assets.load(
        require("../assets/settlements/settlement_3.png")
      ),
      city_0: await PIXI.Assets.load(require("../assets/cities/city_0.png")),
      city_1: await PIXI.Assets.load(require("../assets/cities/city_1.png")),
      city_2: await PIXI.Assets.load(require("../assets/cities/city_2.png")),
      city_3: await PIXI.Assets.load(require("../assets/cities/city_3.png")),
      // bank
      bank_icon: await PIXI.Assets.load(
        require("../assets/icons/bank_icon.png")
      ),

      // player info stuff
      player_icon0: await PIXI.Assets.load(
        require("../assets/icons/player_0_icon.png")
      ),
      player_icon1: await PIXI.Assets.load(
        require("../assets/icons/player_1_icon.png")
      ),
      player_icon2: await PIXI.Assets.load(
        require("../assets/icons/player_2_icon.png")
      ),
      player_icon3: await PIXI.Assets.load(
        require("../assets/icons/player_3_icon.png")
      ),
      back_card: await PIXI.Assets.load(
        require("../assets/resource_cards/back_card.png")
      ),
      large_army: await PIXI.Assets.load(require("../assets/largest_army.png")),
      long_road: await PIXI.Assets.load(require("../assets/longest_road.png")),

      // cards
      brick_card: await PIXI.Assets.load(
        require("../assets/resource_cards/brick_card.png")
      ),
      lumber_card: await PIXI.Assets.load(
        require("../assets/resource_cards/wood_card.png")
      ),
      wool_card: await PIXI.Assets.load(
        require("../assets/resource_cards/wool_card.png")
      ),
      grain_card: await PIXI.Assets.load(
        require("../assets/resource_cards/wheat_card.png")
      ),
      ore_card: await PIXI.Assets.load(
        require("../assets/resource_cards/ore_card.png")
      ),
      dev_card: await PIXI.Assets.load(
        require("../assets/dev_cards/dev_card.png")
      ),
      knight_card: await PIXI.Assets.load(
        require("../assets/dev_cards/knight.png")
      ),
      monopoly_card: await PIXI.Assets.load(
        require("../assets/dev_cards/monopoly.png")
      ),
      roadbuilder_card: await PIXI.Assets.load(
        require("../assets/dev_cards/road_building.png")
      ),
      victorypoint_card: await PIXI.Assets.load(
        require("../assets/dev_cards/victory_point.png")
      ),
      yearofplenty_card: await PIXI.Assets.load(
        require("../assets/dev_cards/year_of_plenty.png")
      ),

      backdrop: await PIXI.Assets.load(require("../assets/backdrop.png")),
      // dice
      dice_1: await PIXI.Assets.load(require("../assets/dice/1.png")),
      dice_2: await PIXI.Assets.load(require("../assets/dice/2.png")),
      dice_3: await PIXI.Assets.load(require("../assets/dice/3.png")),
      dice_4: await PIXI.Assets.load(require("../assets/dice/4.png")),
      dice_5: await PIXI.Assets.load(require("../assets/dice/5.png")),
      dice_6: await PIXI.Assets.load(require("../assets/dice/6.png")),
      trade: await PIXI.Assets.load(require("../assets/icons/trade_icon.png")),
      accept: await PIXI.Assets.load(
        require("../assets/icons/accept_icon.png")
      ),
      decline: await PIXI.Assets.load(
        require("../assets/icons/decline_icon.png")
      ),
      arrow_up: await PIXI.Assets.load(
        require("../assets/icons/arrow_up_icon.png")
      ),
      arrow_down: await PIXI.Assets.load(
        require("../assets/icons/arrow_down_icon.png")
      ),
      end_turn: await PIXI.Assets.load(
        require("../assets/icons/end_turn_icon.png")
      ),
    };
  }
}

export default GameUI;
