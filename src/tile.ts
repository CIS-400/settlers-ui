import * as SETTLERS from "settlers";
import * as PIXI from "pixi.js";
import GameUI from "./game-ui";
import Node from "./node";
import Updatable from "./updatable";

class Tile extends PIXI.Sprite implements Updatable {
  readonly id: number;
  readonly token: PIXI.Sprite;
  gameui: GameUI;

  constructor(gameui: GameUI, nodes: Node[], { id }: { id: number }) {
    const tile = gameui.game.getTile(id);
    super(gameui.textures[`${SETTLERS.resStr(tile.resource)}_tile`]);

    this.gameui = gameui;
    this.id = id;
    const num = tile.getNumber();
    let x = 0.5 * (nodes[tile.nodes[0]].x + nodes[tile.nodes[5]].x);
    let y = 0.5 * (nodes[tile.nodes[0]].y + nodes[tile.nodes[5]].y);
    
    
    this.scale.set(0.75);
    this.anchor.set(0.5);
    this.position.set(x, y);
    this.token = new PIXI.Sprite(
      gameui.textures[num === 7 ? `robber` : `no_${num}`]
    );
    this.token.interactive = true;
    this.token.on("click", this._onclick.bind(this));
    this.token.scale.set(0.9);
    this.token.anchor.set(0.5);
    this.token.position.set(0, -0.285 * this.width);
    this.addChild(this.token);
  }

  private getPotentialAction() {
    return new SETTLERS.Action(
      SETTLERS.ActionType.MoveRobber,
      this.gameui.game.getTurn(),
      {
        to: this.id,
      }
    );
  }

  private _onclick() {
    const { game } = this.gameui;
    const action = this.getPotentialAction();
    if (!game.isValidAction(action).valid) return;
    game.handleAction(action);
    this.gameui.update();
  }

  update() {
    const { game } = this.gameui;
    const num = game.getTile(this.id).getNumber();
    const isDesert = num === 7;
    if (isDesert) {
      this.token.texture = game.getRobberTile() === this.id ? this.gameui.textures['robber'] : PIXI.Texture.EMPTY;
    } else {
      this.token.texture =
        this.gameui.textures[
          game.getRobberTile() === this.id ? "robber" : `no_${num}`
        ];
    }
  }
}
export default Tile;
