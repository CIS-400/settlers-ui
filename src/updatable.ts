import GameUI from "./game-ui";

/**
 * A UI component that defines an update function to update itself
 * based on the state of its reference to gameui
 */
export default interface Updatable {
  readonly gameui: GameUI;
  update: () => void;
}
