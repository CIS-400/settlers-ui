import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
class Node extends PIXI.Sprite {
  readonly id: number;

  constructor(
    gameui: GameUI,
    { id, x, y }: { id: number; x: number; y: number }
  ) {
    super();
    const width = GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    this.id = id;
    this.hitArea = new PIXI.Circle(0, 0, width * 0.025);
    this.interactive = true;
    this.on("click", () => gameui.handleNodeClick(id));
    this.anchor.set(0.5);
    this.position.set(x, y);
  }
}
export default Node;
