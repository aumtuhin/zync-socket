import type { Server, Socket } from 'socket.io'
import { createMessage } from '../services/message.service'
import { notifyContactsStatusChange } from './notify-status'

export const socketHandler = (io: Server, socket: Socket) => {
  socket.on('authenticate', (userId) => {
    socket.data.userId = userId
    socket.join(userId)
    socket.emit('authenticated', { message: 'Authenticated successfully' })
    notifyContactsStatusChange(io, userId, 'online')
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
    const userId = socket.data.userId
    if (!userId) return
    notifyContactsStatusChange(io, userId, 'offline')
  })
}
