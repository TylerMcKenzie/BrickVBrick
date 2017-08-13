import { COLORS, SIZES } from '../constants'
// import io from 'socket.io-client'
import Game from '../objects/Game'

let { SCALERATIO } = SIZES

export default class Main extends Phaser.State {
  init(param) {
    this.multiplayer = param
  }

  create() {
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.refresh()
    this.game.forceSingleUpdate = true

    if(this.multiplayer) {
      this.myGame = new Game(this.game, SCALERATIO, this.game.world.centerX/2, this.game.world.centerY)
      this.myGame.background.destroy() // Delete this later
      this.myGame.start()

      // this.opponentBoard = new Board(this.game, SCALERATIO, this.game.world.centerX*1.5, this.game.world.centerY)
      // this.opponentBoard.disableBoardInput()
      // this.opponentBoard.background.destroy()
      // this.opponentBoard.hideSettings()
    } else {
      this.soloGame = new Game(this.game, SCALERATIO, this.game.world.centerX, this.game.world.centerY)

      this.soloGame.start()
    }
  }

}
