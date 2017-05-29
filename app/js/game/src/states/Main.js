import { COLORS, SIZES } from '../constants'
import Board from '../objects/Board'

let { SCREENWIDTH, SCREENHEIGHT, SCALERATIO } = SIZES

export default class Main extends Phaser.State {

  create() {
    // this.game.scaleMode = Phaser.ScaleManager.RESIZE
    // this.game.scale.pageAlignHorizontally = true;
		// this.game.scale.pageAlignVertically = true;

    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.refresh()

    this.myBoard = new Board(this.game, SCALERATIO, this.game.world.centerX, this.game.world.centerY)
  }

}
