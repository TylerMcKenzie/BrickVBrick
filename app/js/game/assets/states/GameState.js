import { COLORS } from '../constants'

export default class GameState extends Phaser.State {
  create() {
    this.stage.backgroundColor = COLORS.DARKBLUE;
  }
}
