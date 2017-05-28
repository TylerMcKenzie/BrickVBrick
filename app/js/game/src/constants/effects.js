let effects = {
  8: vertDrill,
  9: horizDrill,
  10: radialBomb
}

function vertDrill(board) {
  let { x, y } = board.getBrickLocation(this)

  function collectColumn(x, y, arr) {
    let group = arr || []

    if(y !=0 && !board.boardRows[y][x].isEmpty()) {
      group.push(board.boardRows[y][x])

      collectColumn(x, y-1, group)
    }

    return group
  }

  let column = collectColumn(x, board.boardRows.length-1)

  let score = column.length

  board.deleteGroup(column)

  board.addScore(score)
}

function horizDrill(board) {
  let { x, y } = board.getBrickLocation(this)

  let drilledGroup = []

  for(let i=0; i<board.boardRows[y].length; i++) {
    if(!board.boardRows[y][i].isEmpty()) {
      drilledGroup.push(board.boardRows[y][i])
    }
  }

  let score = drilledGroup.length

  board.deleteGroup(drilledGroup)

  board.addScore(score)
}

function radialBomb(board) {
  let { x, y } = board.getBrickLocation(this)

  let bombedGroup = []

  bombedGroup.push(board.boardRows[y][x])

  if(x !== board.boardRows[y].length-1) {
    bombedGroup.push(board.boardRows[y][x+1])
  }

  if(x !== board.boardRows[y].length-1 && y !== board.boardRows.length-1) {
    bombedGroup.push(board.boardRows[y+1][x+1])
  }

  if(x !== board.boardRows[y].length-1 && y !== 0) {
    bombedGroup.push(board.boardRows[y-1][x+1])
  }

  if(x !== 0) {
    bombedGroup.push(board.boardRows[y][x-1])
  }

  if(x !== 0 && y !== 0) {
    bombedGroup.push(board.boardRows[y-1][x-1])
  }

  if(x !== 0 && y !== board.boardRows.length-1) {
    bombedGroup.push(board.boardRows[y+1][x-1])
  }

  if(y !== 0) {
    bombedGroup.push(board.boardRows[y-1][x])
  }

  if(y !== board.boardRows.length-1) {
    bombedGroup.push(board.boardRows[y+1][x])
  }

  // Clean empty bricks
  for(let i=0;i<bombedGroup.length;i++) {
    if(bombedGroup[i].isEmpty()) {
      bombedGroup.splice(i, 1)
    }
  }

  let score = bombedGroup.length

  board.deleteGroup(bombedGroup)

  board.addScore(score)
}

export default function getEffect(effectId) {
  return effects[effectId];
}
