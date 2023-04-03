import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import Box from "./box";
import Button from "./button";
import GameUI, { UIEvents } from "./game-ui";
import Updatable from "./updatable";

class YearPlenty extends PIXI.Container implements Updatable {
  gameui: GameUI;
  private widthBox: number;
  private heightBox: number;
  private offer: SETTLERS.ResourceBundle;
  private offerText: PIXI.Text[];

  private selectedResources: SETTLERS.Resource[];

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.offer = new SETTLERS.ResourceBundle();
    this.offerText = [];
    this.selectedResources = [];

    this.x = 0.7 * gameui.app.view.width;
    this.y = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 1.7;
    this.widthBox = 0.3 * gameui.app.view.width;
    this.heightBox = (GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height) / 5;
    this.addChild(new Box(0, 0, this.widthBox, this.heightBox));
    this.visible = false;

    // instructions text
    const yearText = new PIXI.Text("Take exactly two resources from the bank", {
      fontFamily: "Arial",
      fontSize: 13,
      fill: 0x000000,
    });
    yearText.anchor.set(0.5, 0);
    yearText.position.set(this.x / 4.5, this.y / 15);
    this.addChild(yearText);

    // accept button
    const acceptIcon = new PIXI.Sprite(gameui.textures["accept"]);
    acceptIcon.scale.set(0.8);
    this.addChild(
      new Button({
        x: 0,
        y: this.heightBox,
        width: 0.2 * this.widthBox,
        height: 0.5 * this.heightBox,
        content: acceptIcon,
        onclick: () => {
          this.selectedResources = [];
          const sum = this.offer.bundle.reduce((total, num) => total + num, 0);

          // YEAR of Plenty needs 2 resources
          if (sum === 2) {
            const resources = this.offer.bundle.reduce((acc, cur, index) => {
              if (cur !== 0) acc.push(index);
              return acc;
            }, []);

            // got 1 type or 2 types of resources?
            if (resources.length === 1) {
              this.selectedResources.push(resources[0]);
              this.selectedResources.push(resources[0]);
            } else {
              resources.map((resourceIndex) => {
                this.selectedResources.push(resourceIndex);
              });
            }

            // console.log(this.selectedResources);

            // check if resources are valid (enough in bank)
            const action = this.getPotentialAction();
            if (gameui.game.isValidAction(action).valid) {
              gameui.game.handleAction(action);
              gameui.update();

              this.visible = false;
            }
          }
        },
      })
    );

    // render cards, arrows
    const CARD_TYPES = SETTLERS.NUM_RESOURCE_TYPES;
    for (let i = 0; i < CARD_TYPES; i++) {
      // get the resource card image
      const resource = i as SETTLERS.Resource;
      const resourceStr = SETTLERS.resStr(resource);

      const x = (this.widthBox * i) / CARD_TYPES;
      const card = new PIXI.Sprite(this.gameui.textures[`${resourceStr}_card`]);
      card.position.set(x, 0.45 * this.heightBox);
      card.scale.set(0.3);
      this.addChild(card);
      this.addChild(
        this.makeArrow(this.gameui, {
          card,
          type: "up",
          onclick: () => {
            this.offer.set(resource, this.offer.get(resource) + 1);
            this.offerText[i].text = this.offer.get(resource);
          },
        })
      );
      this.addChild(
        this.makeArrow(this.gameui, {
          card,
          type: "down",
          onclick: () => {
            this.offer.set(resource, this.offer.get(resource) - 1);
            this.offerText[i].text = this.offer.get(resource);
          },
        })
      );

      const text = new PIXI.Text(0, {
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
      this.offerText.push(text);
    }
  }

  // reset stuff back to 0
  private reset() {
    this.selectedResources = [];
    this.offer = new SETTLERS.ResourceBundle();
    const CARD_TYPES = SETTLERS.NUM_RESOURCE_TYPES;
    for (let i = 0; i < CARD_TYPES; i++) {
      this.offerText[i].text = 0;
    }
  }

  update() {
    // check if in choosing resources YoP state
    if (
      this.gameui.game.getTurnState() !==
      SETTLERS.TurnState.SelectingYearOfPlentyResources
    ) {
      return;
    }

    // clear previous, old resources
    this.reset();

    // make ui visible
    this.visible = true;
  }

  _onclick() {
    const { game } = this.gameui;
    const action = this.getPotentialAction();
    if (!game.isValidAction(action).valid) return;
    game.handleAction(action);
    this.gameui.runEventHandlers(UIEvents.SelectYearOfPlentyResources, action);
    this.gameui.update();
  }

  private getPotentialAction() {
    return new SETTLERS.Action(
      SETTLERS.ActionType.SelectYearOfPlentyResources,
      this.gameui.getPerspective(),
      {
        resources: this.selectedResources,
      }
    );
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
}

export default YearPlenty;
