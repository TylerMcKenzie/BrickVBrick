import Brick from './Brick'
import getEffect from '../constants/effects'

export default class PowerUp extends Brick {
  constructor(game, scale, x, y, color) {
    super(game, scale, x, y, color)

    this.effect = getEffect(this.color)
  }

  applyEffect(board) {
    this.effect(board)
  }
}
