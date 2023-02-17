import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
class Node extends PIXI.Container {
  private readonly sprite: PIXI.Sprite;
  readonly id: number;

  constructor(
    gameui: GameUI,
    { id, x, y }: { id: number; x: number; y: number }
  ) {
    super();
    const width = GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    this.id = id;
    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.75);
    this.sprite.position.set(0);
    this.sprite.scale.set(0.4);
    this.addChild(this.sprite);
    this.hitArea = new PIXI.Circle(0, 0, width * 0.015);
    this.interactive = true;
    this.on("click", () => gameui.handleNodeClick(id));
    this.on("mouseenter", () => {
      this.sprite.texture = gameui.textures[`settlement_0`];
      this.sprite.alpha = 0.75;
    });
    this.on("mouseleave", () => {
      this.sprite.texture = PIXI.Texture.EMPTY;
      this.sprite.alpha = 1;
    });
    this.position.set(x, y);
  }
}
export default Node;
