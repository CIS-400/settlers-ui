import * as PIXI from "pixi.js";

class Button extends PIXI.Graphics {
  static FILL = 0xfff4c8;
  static BORDER = 0x563440;
  constructor({
    x,
    y,
    width,
    height,
    content,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    content: PIXI.Sprite;
  }) {
    super();
    this.position.set(x, y);
    this.beginFill(Button.BORDER);
    this.drawRoundedRect(0, 0, width, height, 5);
    this.endFill();
    this.beginFill(Button.FILL);
    this.drawRect(4, 4, width - 8, height - 8);
    this.endFill();
    this.interactive = true;
    this.alpha = 0.85;
    this.on("mouseenter", () => {
      this.position.set(x - 0.05 * width, y - 0.05 * height);
      this.scale.set(1.1);
      this.alpha = 1.0;
    });
    this.on("mouseleave", () => {
      this.scale.set(1);
      this.position.set(x, y);
      this.alpha = 0.85;
    });
    content.anchor.set(0.5);
    content.position.set(width / 2, height / 2);
    this.addChild(content);
  }
}

export default Button;
