import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Node from "./node";

class Edge extends PIXI.Sprite {
  private readonly nodes: [Node, Node];

  constructor(gameui: GameUI, { nodes }: { nodes: [Node, Node] }) {
    super(gameui.textures[`road_0`]);
    this.nodes = nodes;
    this.interactive = true;
    this.on("click", () => gameui.handleEdgeClick([nodes[0].id, nodes[1].id]));
    this.anchor.set(0.5);
    this.scale.set(0.9);
    this.rotation = this.getAngle(
      [nodes[0].x, nodes[0].y],
      [nodes[1].x, nodes[1].y]
    );
    this.position.set(
      (nodes[0].x + nodes[1].x) / 2,
      (nodes[0].y + nodes[1].y) / 2
    );
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
