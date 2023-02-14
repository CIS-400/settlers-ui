import { Game } from "settlers";
import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";

class GameUI {
  private readonly game: Game;
  private readonly app: PIXI.Application<PIXI.ICanvas>;
  private readonly nodeSprites: PIXI.Sprite[];
  private readonly tileSprites: PIXI.Sprite[];
  private readonly tokenSprites: PIXI.Sprite[];
  private readonly edgeSprites: PIXI.Sprite[];
  private textures: Record<string, any>;

  constructor(game: Game) {
    this.game = game;
    this.app = new PIXI.Application({
      width: 800,
      height: 800,
      backgroundColor: "#78bac2",
    });
    this.nodeSprites = [];
    this.tileSprites = [];
    this.tokenSprites = [];
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleTileClick = this.handleTileClick.bind(this);
    this.loadTextures().then((textures) => {
      this.textures = textures;
      this.initialize();
    });
  }

  initialize() {
    const HEX_CROSS = 5; // hexes across middle row
    const w = 80; // width in user units
    const x_offset = 0.5 * (100 - w);
    const h = 80; // height in user units
    const y_offset = 0.5 * (100 - h);
    const root3 = Math.sqrt(3);
    const s = w / (HEX_CROSS * root3); // side length
    let y = 0.5 * h - 3.5 * s; // starting y so that nodes are vertically aligned
    let x = 0.5 * w - 1.5 * root3 * s; // starting x so that nodes are horizontally aligned
    let rowSize = [7, 9, 11, 11, 9, 7]; // nodes per row
    const halfRowSize = Math.floor(rowSize.length / 2);
    let col = 0;
    let row = 0;
    let rx = x;
    let ry = y;

    // initialize nodes
    for (let i = 0; i < SETTLERS.NUM_NODES; i++) {
      const ns = new PIXI.Sprite();
      ns.hitArea = new PIXI.Circle(0, 0, 50);
      ns.interactive = true;
      ns.on("click", () => this.handleNodeClick(i));
      ns.anchor.set(0.5);
      ns.position.set(8 * (x + x_offset), 8 * (y + y_offset));
      this.nodeSprites.push(ns);
      col++;
      if (col === rowSize[row]) {
        ry += row === halfRowSize - 1 ? s : 1.5 * s;
        y = ry;
        if (row < halfRowSize - 1) {
          rx -= 0.5 * root3 * s;
        } else if (row > halfRowSize - 1) {
          rx += 0.5 * root3 * s;
        }
        x = rx;
        col = 0;
        row++;
      } else {
        x += 0.5 * root3 * s;
        y += 0.5 * s * (col % 2 === (row < halfRowSize ? 1 : 0) ? -1 : 1);
      }
    }
    // // initialize edges
    // // Establish our connections.
    // rowSize = [7, 9, 11, 11, 9, 7]; // nodes per row
    // const downOffset = [8, 10, 11, 10, 8];
    // col = 0;
    // row = 0;
    // for (let i = 0; i < SETTLERS.NUM_NODES; i++) {
    //   // establish the connection between node and its right node
    //   if (col + 1 !== rowSize[row]) {
    //     edges.push([i, i + 1]);
    //   }
    //   // establish the conneciton between node and its downward node
    //   if (row < 3 && col % 2 === 0) {
    //     edges.push([i, i + downOffset[row]]);
    //   } else if ((row === 3 || row === 4) && col % 2 === 1) {
    //     edges.push([i, i + downOffset[row]]);
    //   }

    //   col++;
    //   if (col === rowSize[row]) {
    //     col = 0;
    //     row++;
    //   }
    // }
    // initialize tiles and tokesn
    for (let i = 0; i < SETTLERS.NUM_TILES; i++) {
      const tile = this.game.getTile(i);
      const nodes = tile.nodes;
      const num = tile.getNumber();
      let x =
        0.5 * (this.nodeSprites[nodes[0]].x + this.nodeSprites[nodes[5]].x);
      let y =
        0.5 * (this.nodeSprites[nodes[0]].y + this.nodeSprites[nodes[5]].y);
      const ts = new PIXI.Sprite(
        this.textures[`${SETTLERS.resStr(tile.resource)}_tile`]
      );
      ts.interactive = true;
      ts.on("click", () => this.handleTileClick(i));
      ts.scale.set(0.9);
      ts.anchor.set(0.5);
      ts.position.set(x, y);
      this.tileSprites.push(ts);

      const toks = new PIXI.Sprite(
        this.textures[num == 7 ? `robber` : `no_${num}`]
      );
      toks.scale.set(0.9);
      toks.anchor.set(0.5);
      toks.position.set(x, y - 30);
      this.tokenSprites.push(toks);
    }

    const backdrop = new PIXI.Sprite(this.textures["backdrop"]);
    backdrop.scale.set(0.25);
    backdrop.anchor.set(0.5);
    backdrop.position.set(400);

    this.app.stage.addChild(
      backdrop,
      ...this.tileSprites,
      ...this.tokenSprites,
      ...this.nodeSprites
    );

    // initialize bank
    // TODO insert bank picture
    // insert the cards
    for (let i = 0; i < SETTLERS.NUM_RESOURCE_TYPES; i++) {
      const resource = i as SETTLERS.Resource;
      const resourceStr = SETTLERS.resStr(resource);
      if (resourceStr !== "None") {
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
    }
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

  displayPlayerInfo() {
    this.game.players.map((p, index) => {
      // TODO: display player names

      const victoryPs = new PIXI.Text(p.victoryPoints, {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xdb04e9,
        align: "right",
      });
      victoryPs.x = 500;
      this.app.stage.addChild(victoryPs);

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
      backdrop: await PIXI.Assets.load(require("../assets/backdrop.png")),
    };
  }
}

export default GameUI;
