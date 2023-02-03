import * as PIXI from "pixi.js";
import { Game } from "settlers";
const { Text, Sprite, Assets } = PIXI;
const rgbColor = PIXI.utils.rgb2hex;

const Layer = PIXI.Container;

const g = new Game();
const children: any = [];
const appBg = rgbColor([100, 100, 100]);
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: appBg,
});
// const stage = app.stage;
// stage.interactive = true;

// const mouseEvents = ["pointerdown", "pointerup", "pointerover", "pointerout"];
// const events = flyd.stream();
// flyd.on(e => console.log(e), events);
async function init() {
  console.log(g.toLog());
  children.map((x: any) => app.stage.addChild(x));
  // const viewElement = app.view;
  // const evTgts = ["click"];
  // evTgts.map(tgt => viewElement.addEventListener(tgt, events));
  document.body.appendChild(app.view);
  // load the texture we need
  const texture = await Assets.load(require("../assets/test.png"));

  // This creates a texture from a 'bunny.png' image
  const bunny = new Sprite(texture);

  // Setup the position of the bunny
  bunny.x = app.renderer.width / 2;
  bunny.y = app.renderer.height / 2;

  // Rotate around the center
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  // Add the bunny to the scene we are building
  app.stage.addChild(bunny);

  // Listen for frame updates
  app.ticker.add(() => {
    // each frame we spin the bunny around a bit
    bunny.rotation += 0.01;
  });
}

export default init();
