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
  private widthBox: number;
  private heightBox: number;

  private discardText: PIXI.Text;

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.toDiscardText = [];
    this.toDiscard = new SETTLERS.ResourceBundle();
    this.x = 0.7 * gameui.app.view.width;
    this.y = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 1.7;
    this.visible = false;

    this.widthBox = 0.3 * gameui.app.view.width;
    this.heightBox = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 5;
    this.addChild(new Box(0, 0, this.widthBox, this.heightBox));

    const acceptIcon = new PIXI.Sprite(gameui.textures["accept"]);
    acceptIcon.scale.set(0.8);
    this.addChild(
      new Button({
        x: 0,
        y: this.heightBox,
        width: 0.2 * this.widthBox,
        height: 0.5 * this.heightBox,
        content: acceptIcon,
        onclick: this.discard.bind(this),
      })
    );

    // instructions text
    const discardText = new PIXI.Text(
      `Discard ${Math.floor(
        gameui.game.players[gameui.getPerspective()].resources.size() / 2
      )} resources`,
      {
        fontFamily: "Arial",
        fontSize: 13,
        fill: 0x000000,
      }
    );
    discardText.anchor.set(0.5, 0);
    discardText.position.set(this.x / 4.5, this.y / 15);
    this.addChild(discardText);
    this.discardText = discardText;

    // display cards
    let card: PIXI.Sprite, text: PIXI.Text;
    for (let i = 0; i < SETTLERS.NUM_RESOURCE_TYPES; i++) {
      const x = (this.widthBox * i) / SETTLERS.NUM_RESOURCE_TYPES;
      let resource = i as SETTLERS.Resource;
      card = new PIXI.Sprite(
        gameui.textures[`${SETTLERS.resStr(resource)}_card`]
      );
      card.position.set(x, 0.45 * this.heightBox);
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
      text = new PIXI.Text(0, {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0x000000,
      });
      text.anchor.set(0.5);
      text.position.set(
        x + 0.5 * card.width,
        0.45 * this.heightBox + 1.25 * card.height
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

    this.discardText.text = `Discard ${Math.floor(
      this.gameui.game.players[this.gameui.getPerspective()].resources.size() /
        2
    )} resources`;
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
    arrow.anchor.set(0.3, 0);
    arrow.scale.set(0.5);
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
