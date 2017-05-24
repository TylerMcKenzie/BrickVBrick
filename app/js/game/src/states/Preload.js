import { COLORS, SIZES } from '../constants'
import src from '../assets/bricksSpaced-V2.png'

export default class Preload extends Phaser.State {
  preload() {
    this.load.onLoadComplete.addOnce(() => this.ready = true)
    this.loadResources()
  }

  create() {
    this.stage.backgroundColor = COLORS.DARKBLUE

    this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Loading ...", { fill: '#fff', align: 'center', fontSize: 50 }).anchor.set(0.5)

  }

  loadResources() {
    this.game.load.spritesheet('bricks', src, 60, 60, 11)
  }

  update() {
    if(this.ready) {
      this.game.state.start('Main')
    }
  }

}
