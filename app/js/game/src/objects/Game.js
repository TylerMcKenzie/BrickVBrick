import Brick from './Brick'
import PowerUp from './PowerUp'
import { SIZES, mobile } from '../constants'
import axios from 'axios'
import io from 'socket.io-client'

const { BRICKSIZE } = SIZES
const socket = io()

export default class Game {
  constructor(game, brickScale, x, y) {
    this.game = game
    this.boardRows = []
    this.brickSize = BRICKSIZE
    this.brickScale = brickScale

    this.brickOffset = this.brickSize * this.brickScale

    this.boardWidth = 8*this.brickOffset
    this.boardHeight = 12*this.brickOffset

    this.boardOffsetW = (this.boardWidth)/2
    this.boardOffsetH = (this.boardHeight)/2


    this.posX = x - this.boardOffsetW
    this.posY = y - this.boardOffsetH

    this.moves = 0

    this.numOfColors = 5

    this.playerScore = 0;

    // Set the destroy sound
    this.destroyBrickSound = this.game.add.audio('brickDestroy')
    this.destroyBrickSound.volume = 1.5

    // Set background music
    this.gameMusic = this.game.add.audio('gameMusic')
    this.gameMusic.loop = true
    this.gameMusic.volume = 0.5

  }

  start() {
    this.scoreBoard = this.game.add.text(this.posX, this.posY-(100*this.brickScale), `Score: ${this.playerScore}`, { fill: '#fff', fontSize: 60*this.brickScale })

    this.settings = {}
    this.settings.music = "on"
    this.settings.sound = "on"

    this.settingsIcon = this.game.add.sprite(this.boardWidth+this.posX-(90*this.brickScale), this.posY-(90*this.brickScale), 'settingsIcon')
    this.settingsIcon.width = 75* this.brickScale
    this.settingsIcon.height = 75* this.brickScale
    this.settingsIcon.inputEnabled = true
    this.settingsIcon.events.onInputDown.add(this.openSettingsModal, this)

    if(!mobile) {
      this.background = this.makeBackground()
      this.background.start(false, 5000, 250, 0)
    }

    this.createBoard()

    // this.gameMusic.play()

    let gameStats = {
      id: socket.id,
      currentTime: Date.now(),
      score: this.playerScore
    }

    socket.emit('start-game', gameStats);
  }

  hideSettings() {
    this.settingsIcon.visible = false
  }

  createSettingsModal() {
    this.disableBoardInput()

    let modalGroup = this.game.add.group()
    modalGroup.destroyChildren = true

    let width = 600*this.brickScale
    let height = 800*this.brickScale
    let menu = this.game.add.graphics(0,0)

    let menuPosX = this.game.world.centerX-(width/2)
    let menuPosY = this.game.world.centerY-(height/2)

    menu.beginFill(0x39bb8f)
    menu.drawRect(menuPosX, menuPosY, width, height)
    menu.endFill()
    menu.beginFill(0xffffff)
    menu.drawRect(menuPosX+(15*this.brickScale), menuPosY+(15*this.brickScale), width-(30*this.brickScale), height-(30*this.brickScale))
    menu.endFill()

    modalGroup.add(menu)

    let closeMenuButton = this.game.add.text(menuPosX+width-(75*this.brickScale), menuPosY+(25*this.brickScale), 'X', { fill: '#427a8b', fontSize: 70*this.brickScale})
    modalGroup.add(closeMenuButton)

    let musicMenuText = this.game.add.text(menuPosX+menu.centerX-(175*this.brickScale), menuPosY+menu.centerY-(155*this.brickScale), `Music`, { fill: '#427a8b', fontSize: 60*this.brickScale })
    modalGroup.add(musicMenuText)

    let soundMenuText = this.game.add.text(menuPosX+menu.centerX-(175*this.brickScale), menuPosY+menu.centerY+(75*this.brickScale), `Sound`, { fill: '#427a8b', fontSize: 60*this.brickScale })
    modalGroup.add(soundMenuText)

    let musicSettingText = this.game.add.text(menuPosX+menu.centerX+(75*this.brickScale), menuPosY+menu.centerY-(155*this.brickScale), `${this.settings.music}`, { fill: '#427a8b', fontSize: 60*this.brickScale })
    modalGroup.add(musicSettingText)

    let soundSettingText = this.game.add.text(menuPosX+menu.centerX+(75*this.brickScale), menuPosY+menu.centerY+(75*this.brickScale), `${this.settings.sound}`, { fill: '#427a8b', fontSize: 60*this.brickScale })
    modalGroup.add(soundSettingText)

    let quitSettingText = this.game.add.text(menuPosX+menu.centerX-(75*this.brickScale), menuPosY+menu.centerY+(215*this.brickScale), `Quit`, { fill: '#427a8b', fontSize: 60*this.brickScale })
    modalGroup.add(quitSettingText)

    musicSettingText.inputEnabled = true
    musicSettingText.events.onInputDown.add(this.toggleSetting.bind(this, 'music'))

    soundSettingText.inputEnabled = true
    soundSettingText.events.onInputDown.add(this.toggleSetting.bind(this, 'sound'))

    closeMenuButton.inputEnabled = true
    closeMenuButton.events.onInputDown.add(this.closeSettingsMenu.bind(this, modalGroup))

    quitSettingText.inputEnabled = true
    quitSettingText.events.onInputDown.add(this.openQuitModal.bind(this))

  }

  toggleSetting(setting, textNode) {
    if(this.settings[setting] === "on") {
      this.settings[setting] = "off"
      textNode.text = this.settings[setting]

      if(setting === "music") {
        this.gameMusic.stop()
      }
    } else if(this.settings[setting] === "off") {
      this.settings[setting] = "on"
      textNode.text = this.settings[setting]

      if(setting === "music") {
        this.gameMusic.play()
      }
    }
  }

  openSettingsModal() {
    this.createSettingsModal()
  }

  openQuitModal() {
    let modalGroup = this.game.add.group()
    modalGroup.destroyChildren = true

    let width = 700*this.brickScale
    let height = 400*this.brickScale
    let menu = this.game.add.graphics(0,0)

    let menuPosX = this.game.world.centerX-(width/2)
    let menuPosY = this.game.world.centerY-(height/2)

    menu.beginFill(0x39bb8f)
    menu.drawRect(menuPosX, menuPosY, width, height)
    menu.endFill()
    menu.beginFill(0xffffff)
    menu.drawRect(menuPosX+(15*this.brickScale), menuPosY+(15*this.brickScale), width-(30*this.brickScale), height-(30*this.brickScale))
    menu.endFill()

    modalGroup.add(menu)

    let quitText = this.game.add.text(menuPosX+(100*this.brickScale), menuPosY+(75*this.brickScale), 'Are you sure?', { fill: '#427a8b', fontSize: 75*this.brickScale})
    modalGroup.add(quitText)

    let yesText = this.game.add.text(menuPosX+menu.centerX-(150*this.brickScale), menuPosY+(225*this.brickScale), 'Yes', { fill: '#427a8b', fontSize: 65*this.brickScale})
    modalGroup.add(yesText)

    let noText = this.game.add.text(menuPosX+menu.centerX+(75*this.brickScale), menuPosY+(225*this.brickScale), 'No', { fill: '#427a8b', fontSize: 65*this.brickScale})
    modalGroup.add(noText)

    noText.inputEnabled = true
    noText.events.onInputDown.add(this.closeQuitMenu.bind(this, modalGroup))

    yesText.inputEnabled = true
    yesText.events.onInputDown.add(this.quit.bind(this))
  }

  closeSettingsMenu(modal) {
    modal.destroy()

    this.enableBoardInput()
  }

  closeQuitMenu(modal) {
    modal.destroy()
  }

  makeBackground() {
    let background = this.game.add.emitter(this.game.world.centerX, -100, 50)
    background.width = this.game.world.width
    background.minParticleScale = 0.25*this.brickScale
    background.maxParticleScale = 0.8*this.brickScale
    background.makeParticles('bricks', [0,1,2,3,4,5])
    background.setYSpeed((50*this.brickScale), (150*this.brickScale))
    background.setXSpeed(0, 0)
    background.minRotation = 0
    background.maxRotation = 0

    return background
  }

  brickClickHandler(brick) {
    if(brick.frame !== 7) {
      let { x, y } = this.getBrickLocation(brick)

      // Find all nearby colors
      let colorGroup = this.findColorGroup(y, x, brick.frame)
      let score = colorGroup.length

      // Delete Colors
      this.deleteGroup(colorGroup)


      // Add another color row and check for endgame

      // Increment clicks
      this.moves++

      if(this.moves === 2) {
        if(this.isGameOver()) {
          this.gameOver();
        } else {
          let startX = this.posX+this.brickOffset
          let startY = this.posY+this.brickOffset

          this.boardRows[0] = this.createColorRow(startX, startY)
          this.moves = 0
        }
      }

      // Move colors down
      this.dropColumns()

      // Add to score
      this.addScore(score)
    }
  }

  powerUpClickHandler(brick) {
    let { x, y } = this.getBrickLocation(brick)

    let powerUp = this.boardRows[y][x]

    powerUp.applyEffect(this)

    // Increment clicks
    this.moves++

    if(this.moves === 2) {
      if(this.isGameOver()) {
        this.gameOver();
      } else {
        let startX = this.posX+this.brickOffset
        let startY = this.posY+this.brickOffset

        this.boardRows[0] = this.createColorRow(startX, startY)
        this.moves = 0
      }
    }

    this.dropColumns();
  }

  runScoreAnim(score) {
    let text = this.game.add.text(this.game.input.x, this.game.input.y-(50*this.brickScale), `+${score}`, { fill: '#fff', fontSize: 60*this.brickScale })

    this.game.world.bringToTop(text)

    let tween = this.game.add.tween(text).to({ y: text.y-(50*this.brickScale) }, 300, "Quad.easeOut", true)

    let completed = () => {
      let tween = this.game.add.tween(text).to({ alpha: 0 }, 400, "Quad.easeOut", true)
      tween.onComplete.add(() => text.destroy())
    }

    tween.onComplete.add(completed)
  }

  addScore(score) {
    let bonusScore = Math.floor((score)+(score/1.5))

    this.runScoreAnim(bonusScore)

    this.playerScore += bonusScore

    socket.emit("update-score", { id: socket.id, score: this.playerScore, currentTime: Date.now() })

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
        let newX = this.posX+this.brickOffset+(this.brickOffset*j)
        let newY = this.posY+this.brickOffset+(this.brickOffset*i)

        this.boardRows[i][j].changePosition({ x: newX, y: newY })
      }
    }
  }

  createBoardBackground() {
    for(let i=0; i<12; i++) {
      for(let j=0; j<8; j++) {
        let stepX = this.brickOffset*j
        let stepY = this.brickOffset*i
        let color = 6
        if(j > 0 && j < 7 && i > 0 && i < 11) {
          color = 7
        }
        new Brick(this.game, this.brickScale, this.posX+stepX, this.posY+stepY, color)
      }
    }
  }

  createEmptyBrick(col, row) {
    let { x, y } = this.getBrickLocation(this.boardRows[col][row])

    let emptyBrick = new Brick(this.game, this.brickScale, x, y, 7)

    return emptyBrick
  }

  createColorRow(posX, posY, color) {
    let rowArr = []
    let brickColor
    for(let i=0; i<6; i++) {
      let brick

      if(Math.floor(Math.random()*100) < 96) {
        brickColor = color || Math.floor(Math.random() * this.numOfColors)
        brick = new Brick(this.game, this.brickScale, posX+(this.brickOffset*i), posY, brickColor)
        brick.addClickEvent(this.brickClickHandler, this)
      } else {
        brickColor = color || Math.floor(Math.random() * (11 - 8)) + 8
        brick = new PowerUp(this.game, this.brickScale, posX+(this.brickOffset*i), posY, brickColor)

        brick.addClickEvent(this.powerUpClickHandler, this)
      }

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

  getBrickLocation(brick) {
    let rowPos = ((brick.x - this.posX)/this.brickOffset) - 1
    let colPos = ((brick.y - this.posY)/this.brickOffset) - 1

    return { x: rowPos, y: colPos }
  }

  deleteBrick(col, row) {
    let emptyBrick = this.createEmptyBrick(col, row)

    this.boardRows[col][row].destroy()
    this.boardRows[col].splice(row, 1, emptyBrick)
  }

  deleteGroup(group) {
    // Delete group of bricks
    for(let i=0; i<group.length; i++) {
      let { x, y } = this.getBrickLocation(group[i])

      this.deleteBrick(y, x)
    }

    if(this.settings.sound === "on") {
      this.destroyBrickSound.play()
    }
  }

  isGameOver() {
    var bool = false;
    for(let i=0; i<this.boardRows[0].length; i++) {
      if(!this.boardRows[0][i].isEmpty()) {
        bool = true
        break;
      }
    }
    return bool
  }

  disableBoardInput() {
    this.boardRows.map(col => {
      col.map(brick => {
        brick.disableClickEvents()
      })
    })
  }

  enableBoardInput() {
    this.boardRows.map(col => {
      col.map(brick => {
        brick.enableClickEvents()
      })
    })
  }

  gameOver() {
    this.disableBoardInput()

    // Use game board because Im lazy yo
    this.scoreBoard.text = `Game Over\nFinal Score: ${this.playerScore}`

    // Save User score
    axios.post('/user/score/new', { score: this.playerScore }, { headers: {'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").getAttribute('content')} })
         .then(res => {
           alert("Thanks for playing!")
           window.location.replace('/profile')
         })
         .catch(err => { console.log(err) })

  }

  quit() {
    window.location.replace('/profile')
  }
}
