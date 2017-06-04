// Phaser Dependencies
import 'pixi'
import 'p2'

import Phaser from 'phaser'
import { Main, Preload} from './src/states'
import { SIZES } from './src/constants'
let { SCREENWIDTH, SCREENHEIGHT } = SIZES

class Game extends Phaser.Game {
  constructor(width, height, canvas) {
    super(width, height, canvas)
    this.state.add('Preload', Preload, false)
    this.state.add('Main', Main, false);
  }

  startSolo() {
    this.state.start('Preload', true, false, { multiplayer: false })
  }

  startMultiplayer() {
    this.state.start('Preload', true, false, { multiplayer: true })
  }
}

let multiplayerRegex = new RegExp('/game/multiplayer')
let soloPlayerRegex = new RegExp('/game/play')

let game = new Game(SCREENWIDTH, SCREENHEIGHT, Phaser.CANVAS)

if(multiplayerRegex.test(window.location)) {
  game.startMultiplayer()
} else if(soloPlayerRegex.test(window.location)) {
  game.startSolo()
}
