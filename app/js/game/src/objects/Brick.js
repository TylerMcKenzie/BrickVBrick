export default class Brick {
  constructor(game, x, y, color) {
    this.x = x
    this.y = y
    this.color = color

    this.sprite = game.add.sprite(this.x, this.y, 'bricks', this.color)
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
