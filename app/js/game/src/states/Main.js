import { COLORS } from '../constants'
import Board from '../objects/Board'

export default class Main extends Phaser.State {

  create() {
    this.myBoard = new Board(this.game, 1, this.game.world.width/2, this.game.world.height/2)
  }

}
