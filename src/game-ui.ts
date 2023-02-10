import { Game } from "settlers";
import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";

class GameUI {
  private readonly game: Game;
  private readonly app: PIXI.Application<PIXI.ICanvas>;
  private readonly nodeSprites: PIXI.Sprite[];

  constructor(game: Game) {
    this.game = game;
    this.app = new PIXI.Application({
      width: 800,
      height: 800,
      backgroundColor: "#78bac2",
    });
    this.app.stage.interactive = true;
    this.nodeSprites = [];
    this.handleNodeClick = this.handleNodeClick.bind(this);

    this.initialize();
  }

  async initialize() {
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
    const texture = await PIXI.Assets.load(require("../assets/wood-tile.svg"));

    // initialize nodes
    for (let i = 0; i < SETTLERS.NUM_NODES; i++) {
      const ns = new PIXI.Sprite(texture);
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

  getUI() {
    return this.app.view;
  }
}

export default GameUI;
