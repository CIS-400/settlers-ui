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
    this.handleNodeClick = this.handleNodeClick.bind(this);

    // initialize nodes
    this.nodeSprites = [];
    for (let i = 0; i < SETTLERS.NUM_NODES; i++) {
      const ns = new PIXI.Sprite();
      ns.onclick = () => this.handleNodeClick(i);
      ns.anchor.set(0.5);
      this.nodeSprites.push(ns);
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
