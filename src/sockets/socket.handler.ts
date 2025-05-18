import type { Server, Socket } from 'socket.io'

export const socketHandler = (io: Server, socket: Socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('join_room', (room: string) => {
    socket.join(room)
    console.log(`User ${socket.id} joined room ${room}`)
  })

  socket.on('send_message', (data) => {
    console.log('Message received:', data)
    io.to(data.room).emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
}
