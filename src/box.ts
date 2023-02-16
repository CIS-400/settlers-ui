import * as PIXI from "pixi.js";

class Box extends PIXI.Graphics {
  static FILL = 0xfff4c8;
  static BORDER = 0x563440;
  constructor(x, y, width, height) {
    super();
    this.beginFill(Box.BORDER);
    this.drawRoundedRect(x, y, width, height, 5);
    this.endFill();
    this.beginFill(Box.FILL);
    this.drawRect(x + 4, y + 4, width - 8, height - 8);
    this.endFill();
  }
}

export default Box;
