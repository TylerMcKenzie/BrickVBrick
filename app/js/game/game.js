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
    this.state.start('Preload');
  }
}

new Game(SCREENWIDTH, SCREENHEIGHT, Phaser.CANVAS)
