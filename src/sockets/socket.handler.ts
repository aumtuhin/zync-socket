import type { Server, Socket } from 'socket.io'
import { createMessage } from '../services/message.service'

export const socketHandler = (io: Server, socket: Socket) => {
  socket.on('authenticate', (userId) => {
    socket.join(userId)
    socket.emit('authenticated', { message: 'Authenticated successfully' })
    console.log(`User ${userId} authenticated for private messages`)
  })

  socket.on('send_message', async ({ senderId, recipientId, content }) => {
    const message = await createMessage(senderId, recipientId, content)
    if (!message) {
      socket.emit('error', 'Message creation failed')
      return
    }
    io.to(senderId).to(recipientId).emit('receive_message', message)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
}
