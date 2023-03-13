import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
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
      this.sprite.texture = this.gameui.textures[`city_${p}`];
    } else if (!n.isEmpty()) {
      this.sprite.texture = this.gameui.textures[`settlement_${p}`];
    }
    this.sprite.alpha = 1;
  }

  private _onclick() {
    const { game } = this.gameui;
    const action = this.getPotentialAction();
    if (!game.isValidAction(action)) return;
    game.handleAction(action);
    this.gameui.update();
  }

  private _onmouseenter() {
    const { game } = this.gameui;
    const n: SETTLERS.Node = game.getNode(this.id);
    if (game.isValidAction(this.getPotentialAction()).valid) {
      this.sprite.texture =
        this.gameui.textures[
          `${n.isEmpty() ? "settlement" : "city"}_${game.getTurn()}`
        ];
      this.sprite.alpha = 0.75;
    }
  }
  private _onmouseleave() {
    const { game } = this.gameui;
    const n: SETTLERS.Node = game.getNode(this.id);
    const p = n.getPlayer();
    if (!game.isValidAction(this.getPotentialAction()).valid) return;
    if (n.hasCity()) {
      this.sprite.texture = this.gameui.textures[`city_${p}`];
    } else if (!n.isEmpty()) {
      this.sprite.texture = this.gameui.textures[`settlement_${p}`];
    } else {
      this.sprite.texture = PIXI.Texture.EMPTY;
    }
  }

  private getPotentialAction() {
    const { game } = this.gameui;
    return new SETTLERS.Action(
      game.getNode(this.id).isEmpty()
        ? SETTLERS.ActionType.BuildSettlement
        : SETTLERS.ActionType.BuildCity,
      game.getTurn(),
      { node: this.id }
    );
  }
}
export default Node;
