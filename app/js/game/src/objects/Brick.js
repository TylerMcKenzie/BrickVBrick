export default class Brick {
  constructor(game, scale, x, y, color) {
    this.game = game
    this.scale = scale || 1
    this.color = color
    this.x = x
    this.y = y

    this.sprite = this.game.add.sprite(this.x, this.y, 'bricks', this.color)
    this.sprite.inputEnabled = true
    this.sprite.scale.setTo(this.scale, this.scale)
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

  destroy() {
    this.sprite.destroy()
  }

  isEmpty() {
    if(this.color === 7) {
      return true
    }

    return false
  }

}
