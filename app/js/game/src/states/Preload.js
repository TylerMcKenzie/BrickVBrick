import { COLORS, SIZES } from '../constants'
import src from '../assets/bricks.png'

export default class Preload extends Phaser.State {
  preload() {
    this.load.onLoadComplete.addOnce(() => this.ready = true)
    this.loadResources()
  }

  create() {
    this.stage.backgroundColor = COLORS.DARKBLUE

    this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Loading ...", { fill: COLORS.YELLOWGREEN, align: 'center', fontSize: 50 }).anchor.set(0.5)

  }

  loadResources() {
    this.game.load.spritesheet('bricks', src, 20, 20, 8)
  }

  update() {
    if(this.ready) {
      this.game.state.start('Main')
    }
  }

}
