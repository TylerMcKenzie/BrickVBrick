import Brick from './Brick'

export default class Board {
  constructor(game) {
    this.posX = 100
    this.posY = 100
    this.game = game
    this.boardRows = []

    this.createBoard()

    console.log(this.boardRows)
    this.deleteBrick(5, 4)
  }

  createBoard() {
    // Board Background
    this.createBoardBackground()

    let startX = this.posX+20
    let startY = this.posY+20

    for(let i=0; i<10; i++) {
      let step = 20*i

      if(i<5) {
        this.boardRows.push(this.createColorRow(startX, startY+step, 7))
      } else {
        this.boardRows.push(this.createColorRow(startX, startY+step))
      }
    }
  }

  createBoardBackground() {
    for(let i=0; i<12;i++) {
      for(let j=0; j<8; j++) {
        let stepX = 20*j
        let stepY = 20*i

        new Brick(this.game, this.posX+stepX, this.posY+stepY, 6)
      }
    }
  }

  createEmptyBrick(col, row) {
    let posX = this.boardRows[col][row].x
    let posY = this.boardRows[col][row].y
    let emptyBrick = new Brick(this.game, posX, posY, 7)
    return emptyBrick
  }

  createColorRow(posX, posY, color) {
    let rowArr = []
    let brickColor
    for(let i=0; i<6;i++) {
      brickColor = color || Math.floor(Math.random() * 5)
      let sprite = new Brick(this.game, posX+(20*i), posY, brickColor)
      rowArr.push(sprite)
    }
    return rowArr
  }

  dropColumns() {
    for(let i=0; i<this.boardRows.length; i++) {
      for(let j=0; j<this.boardRows[i].length; j++) {
        
      }
    }
  }

  deleteBrick(col, row) {
    let emptyBrick = this.createEmptyBrick(col, row)

    this.boardRows[col][row].destroy()
    this.boardRows[col].splice(row, 1, emptyBrick)
  }

}
