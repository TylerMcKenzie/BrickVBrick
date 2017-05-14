import Brick from './Brick'
import { SIZES } from '../constants'

const { BRICKSIZE } = SIZES

export default class Board {
  constructor(game, brickScale, x, y) {
    this.posX = x || 200
    this.posY = y || 200
    this.game = game
    this.boardRows = []
    this.brickSize = BRICKSIZE
    this.brickScale = brickScale || 0.75
    this.brickOffset = this.brickSize * this.brickScale

    this.playerScore = 0;

    this.scoreBoard = this.game.add.text(600, 300, `Score: ${this.playerScore}`, { fill: '#fff' })

    this.createBoard()
  }

  brickClickHandler(brick) {
    if(brick.frame !== 7) {
      let row = ((brick.position.x - this.posX)/this.brickOffset) - 1
      let col = ((brick.position.y - this.posY)/this.brickOffset) - 1

      let colorGroup = this.findColorGroup(col, row, brick.frame)

      this.addScore(colorGroup.length)

      for(let i=0; i<colorGroup.length; i++) {
        let colorGroupBrickPosX = ((colorGroup[i].x - this.posX)/this.brickOffset) - 1
        let colorGroupBrickPosY = ((colorGroup[i].y - this.posY)/this.brickOffset) - 1

        this.deleteBrick(colorGroupBrickPosY, colorGroupBrickPosX)
      }

      this.dropColumns()
    }
  }

  addScore(score) {
    this.playerScore += Math.floor((score)+(score/2))

    this.updateScoreBoard()
  }

  updateScoreBoard() {
    this.scoreBoard.text = `Score: ${this.playerScore}`
  }

  findColorGroup(col, row, color, arr) {
    let colorArr = arr || []

    let isInColorArr = (item) => {
      return colorArr.includes(item)
    }

    if(!isInColorArr(this.boardRows[col][row])) {
      colorArr.push(this.boardRows[col][row])
    }

    // Check Left
    if(row != 0) {
      if(this.boardRows[col][row-1].color === color) {
        if(!isInColorArr(this.boardRows[col][row-1])) {
          colorArr.push(this.boardRows[col][row-1])
          this.findColorGroup(col, row-1, color, colorArr)
        }
      }
    }

    // Check Right
    if(row != this.boardRows[col].length-1) {
      if(this.boardRows[col][row+1].color === color) {
        if(!isInColorArr(this.boardRows[col][row+1])) {
          colorArr.push(this.boardRows[col][row+1])
          this.findColorGroup(col, row+1, color, colorArr)
        }
      }
    }

    // Check Up
    if(col != 0) {
      if(this.boardRows[col-1][row].color === color) {
        if(!isInColorArr(this.boardRows[col-1][row])) {
          colorArr.push(this.boardRows[col-1][row])
          this.findColorGroup(col-1, row, color, colorArr)
        }
      }
    }

    // Check Down
    if(col != this.boardRows.length-1) {
      if(this.boardRows[col+1][row].color === color) {
        if(!isInColorArr(this.boardRows[col+1][row])) {
          colorArr.push(this.boardRows[col+1][row])
          this.findColorGroup(col+1, row, color, colorArr)
        }
      }
    }

    return colorArr
  }

  createBoard() {
    // Board Background
    this.createBoardBackground()

    let startX = this.posX+this.brickOffset
    let startY = this.posY+this.brickOffset

    for(let i=0; i<10; i++) {
      let step = this.brickOffset*i

      if(i<1) {
        this.boardRows.push(this.createColorRow(startX, startY+step, 7))
      } else {
        this.boardRows.push(this.createColorRow(startX, startY+step))
      }
    }
  }

  renderBoard() {
    for(let i=0; i<this.boardRows.length; i++) {
      for(let j=0; j<this.boardRows[i].length; j++) {
        this.boardRows[i][j].changePosition({ x: this.posX+this.brickOffset+(this.brickOffset*j), y: this.posY+this.brickOffset+(this.brickOffset*i) })
      }
    }
  }

  createBoardBackground() {
    for(let i=0; i<12; i++) {
      for(let j=0; j<8; j++) {
        let stepX = this.brickOffset*j
        let stepY = this.brickOffset*i

        new Brick(this.game, this.brickScale, this.posX+stepX, this.posY+stepY, 6)
      }
    }
  }

  createEmptyBrick(col, row) {
    let posX = this.boardRows[col][row].x
    let posY = this.boardRows[col][row].y
    let emptyBrick = new Brick(this.game, this.brickScale, posX, posY, 7)
    return emptyBrick
  }

  createColorRow(posX, posY, color) {
    let rowArr = []
    let brickColor
    for(let i=0; i<6; i++) {
      brickColor = color || Math.floor(Math.random() * 6)
      let brick = new Brick(this.game, this.brickScale, posX+(this.brickOffset*i), posY, brickColor)

      brick.addClickEvent(this.brickClickHandler, this)

      rowArr.push(brick)
    }
    return rowArr
  }

  dropColumns() {
    let arr = [[],[],[],[],[],[]]

    for(let i=0; i<arr.length; i++) {
      for(let j=0; j<10; j++) {
        arr[i].push(this.boardRows[j][i])
      }

      this.moveEmptyTop(arr[i])
    }

    for(let i=0; i<arr.length; i++) {
      for(let j=0; j<arr[i].length; j++) {
        this.boardRows[j][i] = arr[i][j]
      }
    }

    this.renderBoard()
  }

  moveEmptyTop(arr) {
    for(let i=0; i<arr.length; i++) {
      if(arr[i].isEmpty()) {
        let empty = arr.splice(i, 1)[0]
        arr.unshift(empty)
      }
    }
  }

  deleteBrick(col, row) {
    let emptyBrick = this.createEmptyBrick(col, row)

    this.boardRows[col][row].destroy()
    this.boardRows[col].splice(row, 1, emptyBrick)
  }

}
