import { Game } from "settlers";
import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";

class GameUI {
  private readonly game: Game;
  private readonly app: PIXI.Application<PIXI.ICanvas>;
  private readonly nodeSprites: PIXI.Sprite[];
  private readonly tileSprites: PIXI.Sprite[];
  private textures: Record<string, any>;

  constructor(game: Game) {
    this.game = game;
    this.app = new PIXI.Application({
      width: 800,
      height: 800,
      backgroundColor: "#78bac2",
    });
    this.app.stage.interactive = true;
    this.nodeSprites = [];
    this.tileSprites = [];
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.loadTextures().then((textures) => {
      this.textures = textures;
      this.initialize();
    });
  }

  initialize() {
    const HEX_CROSS = 5; // hexes across middle row
    const w = 90; // width in user units
    const x_offset = 0.5 * (100 - w);
    const h = 90; // height in user units
    const y_offset = 0.5 * (100 - h);
    const root3 = Math.sqrt(3);
    const s = w / (HEX_CROSS * root3); // side length
    let y = 0.5 * h - 3.5 * s; // starting y so that nodes are vertically aligned
    let x = 0.5 * w - 1.5 * root3 * s; // starting x so that nodes are horizontally aligned
    const rowSize = [7, 9, 11, 11, 9, 7]; // nodes per row
    const halfRowSize = Math.floor(rowSize.length / 2);
    let col = 0;
    let row = 0;
    let rx = x;
    let ry = y;

    // initialize nodes
    for (let i = 0; i < SETTLERS.NUM_NODES; i++) {
      const ns = new PIXI.Sprite();
      ns.interactive = true;
      ns.onclick = () => this.handleNodeClick(i);
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
    this.app.stage.addChild(...this.nodeSprites);

    // initialize tiles
    for (let i = 0; i < SETTLERS.NUM_TILES; i++) {
      const tile = this.game.getTile(i);
      const nodes = tile.nodes;
      let x =
        0.5 * (this.nodeSprites[nodes[0]].x + this.nodeSprites[nodes[5]].x);
      let y =
        0.5 * (this.nodeSprites[nodes[0]].y + this.nodeSprites[nodes[5]].y);
      const ts = new PIXI.Sprite(
        this.textures[`${SETTLERS.resStr(tile.resource)}_tile`]
      );
      ts.interactive = true;
      ts.onclick = () => this.handleNodeClick(i);
      ts.anchor.set(0.5);
      ts.scale.set(3);
      ts.position.set(x, y);
      this.tileSprites.push(ts);
    }
    this.app.stage.addChild(...this.tileSprites);
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

  displayPlayerInfo() {
    this.game.players.map((p, index) => {
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

      const numLongestRoad = new PIXI.Text(this.game.board.getLongestRoad(index), {
        fontFamily: "Arial",
        fontSize: 50,
        fill: 0xff1010,
        align: "left",
      });
      this.app.stage.addChild(knightsPlayed);
    });
  }

  getUI() {
    return this.app.view;
  }

  async loadTextures() {
    return {
      brick_tile: await PIXI.Assets.load(
        require("../assets/tiles/brick_tile.svg")
      ),
      none_tile: await PIXI.Assets.load(
        require("../assets/tiles/desert_without_robber.svg")
      ),
      ore_tile: await PIXI.Assets.load(require("../assets/tiles/ore_tile.svg")),
      grain_tile: await PIXI.Assets.load(
        require("../assets/tiles/wheat_tile.svg")
      ),
      lumber_tile: await PIXI.Assets.load(
        require("../assets/tiles/wood_tile.svg")
      ),
      wool_tile: await PIXI.Assets.load(
        require("../assets/tiles/wool_tile.svg")
      ),
    };
  }
}

export default GameUI;
