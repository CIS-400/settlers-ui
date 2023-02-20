import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Node from "./node";
import Updatable from "./updatable";

class Edge extends PIXI.Container implements Updatable {
  readonly gameui: GameUI;
  private readonly sprite: PIXI.Sprite;
  private readonly nodes: [Node, Node];

  constructor(gameui: GameUI, { nodes }: { nodes: [Node, Node] }) {
    super();
    const width = GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    this.gameui = gameui;
    this.nodes = nodes;
    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.9);
    this.sprite.rotation = this.getAngle(
      [nodes[0].x, nodes[0].y],
      [nodes[1].x, nodes[1].y]
    );
    this.hitArea = new PIXI.Circle(0, 0, 0.025 * width);
    this.on("click", this._onclick.bind(this));
    this.on("mouseenter", this._onmouseenter.bind(this));
    this.on("mouseleave", this._onmouseleave.bind(this));
    this.interactive = true;
    this.position.set(
      (nodes[0].x + nodes[1].x) / 2,
      (nodes[0].y + nodes[1].y) / 2
    );
    this.addChild(this.sprite);
  }

  update() {
    const { game } = this.gameui;
    const r: number = game.getRoad(this.nodes[0].id, this.nodes[1].id);
    if (r !== -1) return;
    this.sprite.texture = this.gameui.textures[`road_${r}`];
    this.sprite.alpha = 1.0;
  }

  private _onclick() {
    const { game } = this.gameui;
    const r: number = game.getRoad(this.nodes[0].id, this.nodes[1].id);
    if (r !== -1) return;
    game.handleAction({
      type: SETTLERS.ActionType.BuildRoad,
      player: game.getTurn(),
      payload: { node0: this.nodes[0].id, node1: this.nodes[1].id },
    });
    this.update();
  }

  private _onmouseenter() {
    const { game } = this.gameui;
    const r: number = game.getRoad(this.nodes[0].id, this.nodes[1].id);
    if (r !== -1) return;
    this.sprite.texture = this.gameui.textures[`road_${game.getTurn()}`];
    this.sprite.alpha = 0.75;
  }
  private _onmouseleave() {
    const { game } = this.gameui;
    const r: number = game.getRoad(this.nodes[0].id, this.nodes[1].id);
    this.sprite.alpha = 1;
    if (r !== -1) return;
    this.sprite.texture = PIXI.Texture.EMPTY;
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
