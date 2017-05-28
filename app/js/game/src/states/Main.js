import { COLORS, SIZES } from '../constants'
import Board from '../objects/Board'

export default class Main extends Phaser.State {

  create() {
    this.game.scaleMode = Phaser.ScaleManager.RESIZE
    this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;

    this.myBoard = new Board(this.game, 0.75, window.innerWidth/2, window.innerHeight/2)
  }

}
