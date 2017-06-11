function GameManager() {
  this.gameList = []
}

GameManager.prototype.setNsp = function(nsp) {
  this.nsp = nsp
}

GameManager.prototype.connect = function(playerSocket) {
  playerSocket.join(this.nsp);

  this.startListeners();
}

GameManager.prototype.startListeners = function() {
  this.nsp.on('connection', function(socket) {
    console.log('socket '+socket.id)
  })
}

GameManager.prototype.createGame = function() {

}

GameManager.prototype.addGame = function() {

}

GameManager.prototype.emit = function(event) {
  this.nsp.emit(event)
}

// GameManager.prototype.

module.exports = GameManager;

// function makeGame(username) {
//     console.log('-------------------------')
//     console.log('making game')
//     var gameId = (Math.random()+1).toString(32).slice(2,18);

//     var game = {
//         gameId: gameId,
//         playerOne: {
//           id: socket.id,
//         }
//     }

//     gameList.push(game)

//     console.log('-----------GAMELIST--------------')
//     console.log(JSON.stringify(gameList))
//     console.log('-----------GAMELIST--------------')


//     socket.join(gameId)

//     io.to(gameId).emit('waiting for opponent')
//     }


//     socket.on('join game', function(playerId) {
//       if(gameList.length) {
//         console.log('-------------------------')
//         console.log('checking for games')
//         console.log('-------------------------')
//         console.log('-----------GAMELIST--------------')
//         console.log(JSON.stringify(gameList))
//         console.log('-----------GAMELIST--------------')

//         for(var i=0; i<gameList.length;i++) {
//           if(!gameList[i].playerTwo) {
//             console.log('-------------------------')
//             console.log('joining game '+ JSON.stringify(gameList[i]))
//             console.log('-------------------------')

//             gameList[i].playerTwo = {
//               id: socket.id,
//             }

//             socket.join(gameList[i].gameId)

//             io.to(gameList[i].gameId).emit('start game', gameList[i])

//             console.log('-----------GAMELIST--------------')
//             console.log(JSON.stringify(gameList))
//             console.log('-----------GAMELIST--------------')

//             break
//           } else if(i == gameList.length-1 && gameList[gameList.length-1].playerOne != socket.id){
//             console.log('-------------------------')
//             makeGame()
//             break
//           }
//         }
//       } else {
//         console.log('-------------------------')
//         console.log('make game')
//         console.log('-------------------------')
//         makeGame()
//       }
//     })
