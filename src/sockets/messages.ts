import type { Server, Socket } from 'socket.io'
import { createMessage, updateMessageStatus } from '../services/message.service'

export const sendMessage = async (io: Server, socket: Socket) => {
  socket.on('send_message', async ({ senderId, recipientId, content }) => {
    const message = await createMessage(senderId, recipientId, content)
    if (!message) {
      socket.emit('error', 'Message creation failed')
      return
    }
    io.to(senderId).to(recipientId).emit('receive_message', message)
  })
}

export const sendMessageStatus = async (io: Server, socket: Socket) => {
  socket.on('send_message_status', async ({ messageId, status, senderId }) => {
    const updatedMessage = await updateMessageStatus(messageId, status)
    if (!updatedMessage) {
      socket.emit('error', 'Failed to update message status')
      return
    }
    io.to(senderId).emit('message_status_updated', updatedMessage)
  })
}
