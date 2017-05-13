import { COLORS } from '../constants'
import Board from '../objects/Board'

export default class Main extends Phaser.State {

  create() {
    this.boardX = 300
    this.boardY = 500
    this.myBoard = new Board(this.game)
  }
}
