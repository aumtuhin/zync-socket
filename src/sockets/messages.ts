import type { Server, Socket } from 'socket.io'
import { Events } from '../constants/enum'
import { createMessage, updateMessageStatus } from '../services/message.service'
import { getUndeliveredMessages } from '../services/message.service'

export const sendMessage = async (io: Server, socket: Socket) => {
  socket.on(Events.SEND_MESSAGE, async ({ senderId, recipientId, content }) => {
    const message = await createMessage(senderId, recipientId, content)
    if (!message) {
      socket.emit('error', 'Message creation failed')
      return
    }
    io.to(senderId).to(recipientId).emit(Events.RECEIVE_MESSAGE, message)
  })
}

export const sendMessageStatus = async (io: Server, socket: Socket) => {
  socket.on(Events.SEND_MESSAGE_STATUS, async ({ messageId, status, senderId }) => {
    const updatedMessage = await updateMessageStatus(messageId, status)
    if (!updatedMessage) {
      socket.emit('error', 'Failed to update message status')
      return
    }
    io.to(senderId).emit(Events.MESSAGE_STATUS_UPDATE, updatedMessage)
  })
}

export const updateUnDeliveredMessagesStatus = async (io: Server, socket: Socket) => {
  const userId = socket.data.userId
  if (!userId) return
  const undeliveredMessages = await getUndeliveredMessages(userId)

  if (undeliveredMessages.length > 0) {
    for (const message of undeliveredMessages) {
      const updatedMessage = await updateMessageStatus(message._id as string, 'delivered')
      if (!updatedMessage) continue
      io.to(updatedMessage.sender._id.toString()).emit(Events.MESSAGE_STATUS_UPDATE, updatedMessage)
    }
  }
}
