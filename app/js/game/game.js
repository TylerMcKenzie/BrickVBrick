// Phaser Dependencies
import 'pixi'
import 'p2'

import Phaser from 'phaser'
import { Main, Preload} from './src/states'

class Game extends Phaser.Game {
  constructor() {
    super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO)
    this.state.add('Preload', Preload, false)
    this.state.add('Main', Main, false);
    this.state.start('Preload');
  }
}

new Game()
