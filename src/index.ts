import * as PIXI from "pixi.js";
const { Text } = PIXI;
const rgbColor = PIXI.utils.rgb2hex;

const Layer = PIXI.Container;

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
function init() {
  children.map((x: any) => app.stage.addChild(x));
  // const viewElement = app.view;
  // const evTgts = ["click"];
  // evTgts.map(tgt => viewElement.addEventListener(tgt, events));
  document.body.appendChild(app.view);
}

export default init();
