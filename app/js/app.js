import io from 'socket.io-client'

const socket = io()

socket.on('connectToRoom', function(data) {
  console.log(data)
})

socket.on('playerDisconnect', function() {
  // window.location.replace('/')
})
