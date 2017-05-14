import Brick from './Brick'
import { SIZES } from '../constants'
import axios from 'axios'

const { BRICKSIZE } = SIZES

export default class Board {
  constructor(game, brickScale, x, y) {
    this.game = game
    this.boardRows = []
    this.brickSize = BRICKSIZE
    this.brickScale = brickScale || 0.75

    this.brickOffset = this.brickSize * this.brickScale

    this.boardWidth = 8*this.brickOffset
    this.boardHeight = 12*this.brickOffset

    this.boardOffsetW = (this.boardWidth)/2
    this.boardOffsetH = (this.boardHeight)/2


    this.posX = x - this.boardOffsetW || 200
    this.posY = y - this.boardOffsetH || 200

    this.clicks = 0

    this.numOfColors = 5

    this.playerScore = 0;

    this.scoreBoard = this.game.add.text(this.posX+this.boardWidth+50, this.boardOffsetH-this.posY, `Score: ${this.playerScore}`, { fill: '#fff' })

    this.createBoard()
  }

  brickClickHandler(brick) {
    if(brick.frame !== 7) {
      let row = ((brick.position.x - this.posX)/this.brickOffset) - 1
      let col = ((brick.position.y - this.posY)/this.brickOffset) - 1

      // Find all nearby colors
      let colorGroup = this.findColorGroup(col, row, brick.frame)

      // Add to score
      this.addScore(colorGroup.length)

      // Delete group bricks
      for(let i=0; i<colorGroup.length; i++) {
        let colorGroupBrickPosX = ((colorGroup[i].x - this.posX)/this.brickOffset) - 1
        let colorGroupBrickPosY = ((colorGroup[i].y - this.posY)/this.brickOffset) - 1

        this.deleteBrick(colorGroupBrickPosY, colorGroupBrickPosX)
      }

      // Add another color row and check for endgame
      for(let i=0; i<this.boardRows[0].length; i++) {
        if(!this.boardRows[0][i].isEmpty()) {
          console.log('game over')
          // Disable Clicking
          this.boardRows.map(col => {
            col.map(brick => {
              brick.disableClickEvents()
            })
          })

          // Run endgame
          this.gameOver()
          break;
        }
      }

      // Increment clicks
      this.clicks++

      if(this.clicks === 2) {
        this.boardRows[0] = this.createColorRow(0,0)
        this.clicks = 0
      }

      // Move colors down
      this.dropColumns()
    }
  }

  addScore(score) {
    this.playerScore += Math.floor((score)+(score/1.5))

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

      if(i<4) {
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
      brickColor = color || Math.floor(Math.random() * this.numOfColors)
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

  gameOver() {
    // Use game board because Im lazy yo
    this.scoreBoard.text = `Game Over\nFinal Score: ${this.playerScore}`

    // Save User score
    axios.post('/user/score/new', { score: this.playerScore })
         .then(res => {
           alert("Thanks for playing!")
           window.location.replace('/profile')
         })
         .catch(err => { console.log(err) })

  }
}
