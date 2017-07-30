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
    this.sprite.scale.setTo(this.scale)

    // Set the destroy particles
    this.emitter = this.game.add.emitter(0, 0, 6)
    this.emitter.makeParticles('bricks', this.color)
    this.emitter.minParticleScale = this.scale
    this.emitter.maxParticleScale = this.scale
    this.emitter.gravity = 2000*this.scale
  }

  tweenTo(x, y) {
    this.game.add.tween(this.sprite).to({ x: x, y: y }, 400, "Bounce", true)
  }

  addClickEvent(handler, object) {
    this.sprite.events.onInputDown.add(handler, object)
  }

  enableClickEvents() {
    this.sprite.inputEnabled = true
  }

  disableClickEvents() {
    this.sprite.inputEnabled = false
  }

  changePosition(pos) {
    let { x, y } = pos

    if(!this.isEmpty()) {
      this.tweenTo(x, y)
    } else {
      this.game.world.sendToBack(this.sprite)
      this.sprite.x = x || this.sprite.x
      this.sprite.y = y || this.sprite.y
    }

    this.x = x
    this.y = y
  }

  runDestroyAnim() {
    this.game.world.bringToTop(this.emitter)
    this.emitter.x = this.x+(this.sprite.width/2)
    this.emitter.y = this.y+(this.sprite.width/2)
    this.emitter.start(false, 1000, 1, 1)
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
