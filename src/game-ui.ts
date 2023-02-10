import { Game } from "settlers";
import * as PIXI from "pixi.js";

class GameUI {
  private readonly game: Game;
  private readonly app: PIXI.Application<PIXI.ICanvas>;

  constructor(game: Game) {
    this.game = game;
    this.app = new PIXI.Application({
      width: 800,
      height: 800,
    });
    this.app.stage.interactive = true;
  }

  getUI() {
    return this.app.view;
  }
}

export default GameUI;
