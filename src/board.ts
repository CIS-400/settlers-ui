import * as PIXI from "pixi.js";
import * as SETTLERS from "settlers";
import Edge from "./edge";
import GameUI from "./game-ui";
import Node from "./node";
import Tile from "./tile";
import Updatable from "./updatable";

class Board extends PIXI.Container implements Updatable {
  gameui: GameUI;
  nodes: Node[];
  edges: Edge[];
  tiles: Tile[];

  constructor(gameui: GameUI) {
    super();
    this.gameui = gameui;
    this.nodes = [];
    this.edges = [];
    this.tiles = [];
    this.position.set(0, 0);
    const height = GameUI.BOARD_HEIGHT_RATIO * gameui.app.view.height;
    const width = height;
    const HEX_CROSS = 5; // hexes across middle row
    const w = 80; // width in user units
    const x_offset = 0.5 * (100 - w);
    const h = 80; // height in user units
    const y_offset = 0.5 * (100 - h);
    const root3 = Math.sqrt(3);
    const s = w / (HEX_CROSS * root3); // side length
    let y = 0.5 * h - 3.5 * s; // starting y so that nodes are vertically aligned
    let x = 0.5 * w - 1.5 * root3 * s; // starting x so that nodes are horizontally aligned
    let rowSize = [7, 9, 11, 11, 9, 7]; // nodes per row
    const halfRowSize = Math.floor(rowSize.length / 2);
    let col = 0;
    let row = 0;
    let rx = x;
    let ry = y;

    // initialize nodes
    for (let i = 0; i < SETTLERS.NUM_NODES; i++) {
      this.nodes.push(
        new Node(gameui, {
          id: i,
          x: 0.01 * width * (x + x_offset),
          y: 0.01 * height * (y + y_offset),
        })
      );
      col++;
      if (col === rowSize[row]) {
        ry += row === halfRowSize - 1 ? s : 1.5 * s;
        y = ry;
        if (row < halfRowSize - 1) {
          rx -= 0.5 * root3 * s;
        } else if (row > halfRowSize - 1) {
          rx += 0.5 * root3 * s;
        }
        x = rx;
        col = 0;
        row++;
      } else {
        x += 0.5 * root3 * s;
        y += 0.5 * s * (col % 2 === (row < halfRowSize ? 1 : 0) ? -1 : 1);
      }
    }
    // initialize edges
    // Establish our connections.
    rowSize = [7, 9, 11, 11, 9, 7]; // nodes per row
    const downOffset = [8, 10, 11, 10, 8];
    col = 0;
    row = 0;
    for (let i = 0; i < SETTLERS.NUM_NODES; i++) {
      // establish the connection between node and its right node
      if (col + 1 !== rowSize[row]) {
        this.edges.push(
          new Edge(gameui, { nodes: [this.nodes[i], this.nodes[i + 1]] })
        );
      }
      // establish the conneciton between node and its downward node
      if (
        (row < 3 && col % 2 === 0) ||
        ((row === 3 || row === 4) && col % 2 === 1)
      ) {
        this.edges.push(
          new Edge(gameui, {
            nodes: [this.nodes[i], this.nodes[i + downOffset[row]]],
          })
        );
      }
      col++;
      if (col === rowSize[row]) {
        col = 0;
        row++;
      }
    }
    // initialize tiles and tokesn
    for (let i = 0; i < SETTLERS.NUM_TILES; i++) {
      this.tiles.push(new Tile(gameui, this.nodes, { id: i }));
    }

    const backdrop = new PIXI.Sprite(gameui.textures["backdrop"]);
    backdrop.scale.set(0.21);
    backdrop.anchor.set(0.5);
    backdrop.position.set(0.5 * width);
    backdrop.angle = 180;

    this.addChild(backdrop, ...this.tiles, ...this.edges, ...this.nodes);
  }

  update() {
    this.edges.forEach((e) => e.update());
    this.nodes.forEach((e) => e.update());
    this.tiles.forEach((e) => e.update());
  }
}

export default Board;
