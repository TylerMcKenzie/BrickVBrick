export default class Brick {
  constructor(game, scale, x, y, color) {
    this.game = game
    this.scale = scale || 1
    this.color = color
    this.x = x
    this.y = y

    // Set the sprite
    this.sprite = this.game.add.sprite(this.x, this.y, 'bricks', this.color)
    this.sprite.inputEnabled = true
    this.sprite.scale.setTo(this.scale, this.scale)
    // Keep color bricks on top
    this.game.world.bringToTop(this.sprite)

    // Set the destroy particles
    this.emitter = this.game.add.emitter(0, 0, 10)
    this.emitter.makeParticles('bricks', this.color)
    this.emitter.minParticleScale = 0.3
    this.emitter.maxParticleScale = 0.6
    this.emitter.gravity = 1000
  }

  tweenTo(x, y) {
    this.game.add.tween(this.sprite).to({ x: x, y: y }, 400, "Bounce", true)
  }

  addClickEvent(handler, object) {
    this.sprite.events.onInputDown.add(handler, object)
  }

  disableClickEvents() {
    this.sprite.inputEnabled = false
  }

  changePosition(pos) {
    let { x, y } = pos
    if(!this.isEmpty()) {
      this.tweenTo(x, y)
    } else {
      this.sprite.x = x || this.sprite.x
      this.sprite.y = y || this.sprite.y
    }

    this.x = x
    this.y = y

  }

  runDestroyAnim() {

    this.game.world.bringToTop(this.emitter)
    this.emitter.x = this.x+30
    this.emitter.y = this.y+30

    let numOfPart = Math.floor(Math.random()* 5)+1

    this.emitter.start(true, 700, null, numOfPart)
  }

  destroy() {
    this.runDestroyAnim()

    this.sprite.destroy()
  }

  isEmpty() {
    if(this.color === 7) {
      return true
    }

    return false
  }

}
