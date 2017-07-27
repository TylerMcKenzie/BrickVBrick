import { COLORS, SIZES } from '../constants'
import Game from '../objects/Game'

let { SCREENWIDTH, SCREENHEIGHT, SCALERATIO } = SIZES

export default class Main extends Phaser.State {

  create() {
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.refresh()
    this.game.forceSingleUpdate = true

    this.myGame = new Game(this.game, SCALERATIO, this.game.world.centerX, this.game.world.centerY)
  }

}
