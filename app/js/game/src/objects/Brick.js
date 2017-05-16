export default class Brick {
  constructor(game, scale, x, y, color) {
    this.scale = scale || 1
    this.color = color
    this.x = x
    this.y = y

    this.sprite = game.add.sprite(this.x, this.y, 'bricks', this.color)
    this.sprite.inputEnabled = true
    this.sprite.scale.setTo(this.scale, this.scale)
  }

  addClickEvent(handler, object) {
    this.sprite.events.onInputDown.add(handler, object)
  }

  disableClickEvents() {
    this.sprite.inputEnabled = false
  }

  changePosition(pos) {
    let { x, y } = pos

    this.x = x
    this.y = y
    this.sprite.x = x || this.sprite.x
    this.sprite.y = y || this.sprite.y
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
