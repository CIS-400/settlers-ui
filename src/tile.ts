import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Node from "./node";

class Tile extends PIXI.Sprite {
  readonly id: number;
  readonly token: PIXI.Sprite;

  constructor(gameui: GameUI, nodes: Node[], { id }: { id: number }) {
    const tile = gameui.game.getTile(id);
    super(gameui.textures[`${SETTLERS.resStr(tile.resource)}_tile`]);
    this.id = id;
    const num = tile.getNumber();
    let x = 0.5 * (nodes[tile.nodes[0]].x + nodes[tile.nodes[5]].x);
    let y = 0.5 * (nodes[tile.nodes[0]].y + nodes[tile.nodes[5]].y);
    this.interactive = true;
    this.on("click", () => gameui.handleTileClick(id));
    this.scale.set(0.7);
    this.anchor.set(0.5);
    this.position.set(x, y);
    this.token = new PIXI.Sprite(
      gameui.textures[num == 7 ? `robber` : `no_${num}`]
    );
    this.token.scale.set(0.9);
    this.token.anchor.set(0.5);
    this.token.position.set(0, -0.285 * this.width);
    this.addChild(this.token);
  }
}
export default Tile;
