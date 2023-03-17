import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import Box from "./box";
import Button from "./button";
import GameUI from "./game-ui";
import Updatable from "./updatable";

class Discard extends PIXI.Container implements Updatable {
  readonly gameui: GameUI;
  private toDiscard: SETTLERS.ResourceBundle;
  private toDiscardText: PIXI.Text[];

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.toDiscardText = [];
    this.toDiscard = new SETTLERS.ResourceBundle();
    this.x = 0.65 * gameui.app.view.width;
    this.y = gameui.app.view.height / 2;
    this.visible = false;
    const width = gameui.app.view.width - this.x;
    const height = 0.3 * gameui.app.view.height;

    const STAGE_AREA_HEIGHT = 0.75 * height;
    const BTN_AREA_HEIGHT = height - STAGE_AREA_HEIGHT;
    this.addChild(new Box(0, 0, width, STAGE_AREA_HEIGHT));

    const acceptIcon = new PIXI.Sprite(gameui.textures["accept"]);
    acceptIcon.scale.set(0.8);
    this.addChild(
      new Button({
        x: 0.2 * width,
        y: STAGE_AREA_HEIGHT + 0.05 * BTN_AREA_HEIGHT,
        width: 0.2 * width,
        height: 0.9 * BTN_AREA_HEIGHT,
        content: acceptIcon,
        onclick: this.discard.bind(this),
      })
    );
    let x: number, card: PIXI.Sprite, text: PIXI.Text;
    for (let i = 0; i < SETTLERS.NUM_RESOURCE_TYPES; i++) {
      x = (i * width) / SETTLERS.NUM_RESOURCE_TYPES;
      let resource = i as SETTLERS.Resource;
      card = new PIXI.Sprite(
        gameui.textures[`${SETTLERS.resStr(resource)}_card`]
      );
      card.position.set(x, 0.05 * STAGE_AREA_HEIGHT);
      card.scale.set(0.3);
      this.addChild(card);
      this.addChild(
        this.makeArrow(gameui, {
          card,
          type: "up",
          onclick: () => {
            this.toDiscard.set(resource, this.toDiscard.get(resource) + 1);
            this.toDiscardText[i].text = this.toDiscard.get(resource);
          },
        })
      );
      this.addChild(
        this.makeArrow(gameui, {
          card,
          type: "down",
          onclick: () => {
            this.toDiscard.set(resource, this.toDiscard.get(resource) - 1);
            this.toDiscardText[i].text = this.toDiscard.get(resource);
          },
        })
      );
      text = new PIXI.Text(0);
      text.anchor.set(0.5);
      text.position.set(
        x + 0.5 * card.width,
        0.05 * STAGE_AREA_HEIGHT + 1.25 * card.height
      );
      this.addChild(text);
      this.toDiscardText.push(text);
    }
  }

  update() {
    if (this.gameui.game.getTurnState() !== SETTLERS.TurnState.Discarding) {
      this.toDiscard = new SETTLERS.ResourceBundle();
    }
    this.visible =
      this.gameui.game.getTurnState() === SETTLERS.TurnState.Discarding &&
      this.gameui.game.getMustDiscard()[this.gameui.getPerspective()];
  }

  private makeArrow(
    gameui: GameUI,
    {
      card,
      type,
      onclick,
    }: {
      card: PIXI.Sprite;
      type: "up" | "down";
      onclick: () => void;
    }
  ): PIXI.Sprite {
    const arrow = new PIXI.Sprite(
      gameui.textures[type === "up" ? "arrow_up" : "arrow_down"]
    );
    arrow.interactive = true;
    arrow.on("click", onclick);
    arrow.alpha = 0.5;
    arrow.on("mouseenter", function () {
      this.alpha = 1;
    });
    arrow.on("mouseleave", function () {
      this.alpha = 0.5;
    });
    arrow.position.set(
      card.x + card.width,
      card.y + (type === "up" ? 0.25 * card.height : 0.75 * card.height)
    );
    return arrow;
  }

  private discard() {
    const { game } = this.gameui;
    const action = new SETTLERS.Action(
      SETTLERS.ActionType.Discard,
      this.gameui.getPerspective(),
      { bundle: this.toDiscard }
    );
    if (game.isValidAction(action).valid) {
      game.handleAction(action);
      this.gameui.update();
    }
  }
}

export default Discard;
