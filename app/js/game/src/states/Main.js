import { COLORS, SIZES } from '../constants'
import Board from '../objects/Board'
import io from 'socket.io-client'

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
      this.myBoard = new Board(this.game, SCALERATIO, this.game.world.centerX/2, this.game.world.centerY)
      this.myBoard.background.destroy() // Delete this later

      const socket = io()
      socket.emit('join game', socket.id)

      socket.on('waiting', function() {
        console.log('waiting')
      })

      socket.on('start game', function(game) {
        console.log(game)
      })
      // this.opponentBoard = new Board(this.game, SCALERATIO, this.game.world.centerX*1.5, this.game.world.centerY)
      // this.opponentBoard.disableBoardInput()
      // this.opponentBoard.background.destroy()
      // this.opponentBoard.hideSettings()
    } else {
      this.board = new Board(this.game, SCALERATIO, this.game.world.centerX, this.game.world.centerY)
    }
  }

}
