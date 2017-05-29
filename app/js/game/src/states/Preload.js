import { COLORS, SIZES } from '../constants'
import brickSpriteSrc from '../assets/sprites/bricksScaled720X240.png'
import brickDestroyWavSrc from '../assets/sounds/brick_destroy.wav'
import gameMusicWavSrc from '../assets/sounds/game_music.wav'
import settingsIcon from '../assets/sprites/settings-50.png'

export default class Preload extends Phaser.State {
  preload() {
    this.load.onLoadComplete.addOnce(() => this.ready = true)
    this.loadResources()
  }

  create() {
    this.stage.backgroundColor = COLORS.DARKBLUE

    this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Loading ...", { fill: '#fff', align: 'center', fontSize: 50*SIZES.SCALERATIO }).anchor.set(0.5)
  }

  loadResources() {
    this.game.load.spritesheet('bricks', brickSpriteSrc, SIZES.BRICKSIZE, SIZES.BRICKSIZE, 11)
    this.game.load.image('settingsIcon', settingsIcon)
    this.game.load.audio('brickDestroy', brickDestroyWavSrc)
    this.game.load.audio('gameMusic', gameMusicWavSrc)

  }

  update() {
    if(this.ready) {
      this.game.state.start('Main')
    }
  }

}
