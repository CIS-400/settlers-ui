import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Node from "./node";

class Edge extends PIXI.Container {
  private readonly sprite: PIXI.Sprite;
  private readonly nodes: [Node, Node];

  constructor(gameui: GameUI, { nodes }: { nodes: [Node, Node] }) {
    super();
    const width = GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    this.nodes = nodes;
    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.9);
    this.sprite.rotation = this.getAngle(
      [nodes[0].x, nodes[0].y],
      [nodes[1].x, nodes[1].y]
    );
    this.hitArea = new PIXI.Circle(0, 0, 0.025 * width);
    this.on("mouseenter", () => {
      this.sprite.texture = gameui.textures[`road_0`];
      this.sprite.alpha = 0.75;
    });
    this.on("mouseleave", () => {
      this.sprite.texture = PIXI.Texture.EMPTY;
      this.sprite.alpha = 1;
    });

    this.interactive = true;
    this.on("click", () => gameui.handleEdgeClick([nodes[0].id, nodes[1].id]));
    this.position.set(
      (nodes[0].x + nodes[1].x) / 2,
      (nodes[0].y + nodes[1].y) / 2
    );
    this.addChild(this.sprite);
  }

  private getAngle(
    [x1, y1]: [number, number],
    [x2, y2]: [number, number]
  ): number {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.atan2(deltaY, deltaX);
  }
}
export default Edge;
