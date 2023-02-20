import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import { ActionPayload } from "settlers";
import GameUI from "./game-ui";
import Updatable from "./updatable";
class Node extends PIXI.Container implements Updatable {
  readonly gameui: GameUI;
  private readonly sprite: PIXI.Sprite;
  readonly id: number;

  constructor(
    gameui: GameUI,
    { id, x, y }: { id: number; x: number; y: number }
  ) {
    super();
    const width = GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    this.gameui = gameui;
    this.id = id;
    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.75);
    this.sprite.position.set(0);
    this.sprite.scale.set(0.4);
    this.addChild(this.sprite);
    this.hitArea = new PIXI.Circle(0, 0, width * 0.015);
    this.interactive = true;
    this.on("click", this._onclick.bind(this));
    this.on("mouseenter", this._onmouseenter.bind(this));
    this.on("mouseleave", this._onmouseleave.bind(this));
    this.position.set(x, y);
  }

  update() {
    const { game } = this.gameui;
    const n: SETTLERS.Node = game.getNode(this.id);
    const p = n.getPlayer();
    if (n.hasCity()) {
      this.sprite.texture = this.gameui.textures[`settlement_${p}`];
    } else if (!n.isEmpty()) {
      this.sprite.texture = this.gameui.textures[`settlement_${p}`];
    }
  }

  private _onclick() {
    const { game } = this.gameui;
    const n: SETTLERS.Node = game.getNode(this.id);

    if ((!n.isEmpty() && n.getPlayer() !== game.getTurn()) || n.hasCity())
      return;

    if (n.isEmpty()) {
      game.handleAction(
        new SETTLERS.Action(
          SETTLERS.ActionType.BuildSettlement,
          game.getTurn(),
          { node: this.id }
        )
      );
    } else {
      game.handleAction(
        new SETTLERS.Action(SETTLERS.ActionType.BuildCity, game.getTurn(), {
          node: this.id,
        })
      );
    }
    this.update();
  }

  private _onmouseenter() {
    const { game } = this.gameui;
    const n: SETTLERS.Node = game.getNode(this.id);
    const p = game.getTurn();
    if (!n.isEmpty() && n.getPlayer() === p) {
      this.sprite.texture = this.gameui.textures[`settlement_${p}`]; // TODO: change to city
      this.sprite.alpha = 0.75;
    } else if (n.isEmpty()) {
      this.sprite.texture = this.gameui.textures[`settlement_${p}`];
      this.sprite.alpha = 0.75;
    }
  }
  private _onmouseleave() {
    const { game } = this.gameui;
    const n: SETTLERS.Node = game.getNode(this.id);
    const p = n.getPlayer();
    if (n.hasCity()) {
      this.sprite.texture = this.gameui.textures[`settlement_${p}`]; // TODO: change to city
    } else if (!n.isEmpty()) {
      this.sprite.texture = this.gameui.textures[`settlement_${p}`];
    } else {
      this.sprite.texture = PIXI.Texture.EMPTY;
    }
    this.sprite.alpha = 1;
  }
}
export default Node;
