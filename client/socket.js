import io from 'socket.io-client'

const socket = io(window.location.origin)

socket.on('connect', () =>{
   console.log('socket connected to server')
})

socket.on('new-message', (message) => {
   console.log('socket: client recives message from server', message)
})

export default socket;