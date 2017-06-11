import io from 'socket.io-client'

const socket = io()

let profileRegex = new RegExp('/profile')

if(profileRegex.test(window.location)) {
  let username = document.getElementById('username').innerHTML
  socket.emit('set username', username)
}
