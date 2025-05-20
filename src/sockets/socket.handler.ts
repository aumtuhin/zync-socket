import type { Server, Socket } from 'socket.io'
import Message from '../models/message.model'
import User from '../models/user.model'

export const socketHandler = (io: Server, socket: Socket) => {
  console.log(`User connected: ${socket.id}`)

  // Add these new handlers
  socket.on('private_message', async (data) => {
    console.log('Received private message:', data)
    // try {
    // Check if users are contacts
    // const sender = await User.findById(data.senderId)
    // const receiver = await User.findById(data.receiverId)

    // if (!sender?.contacts.includes(data.receiverId)) {
    //   return socket.emit('error', 'You can only message your contacts')
    // }

    // Save private message
    // const message = new Message({
    //   room: `private_${[data.senderId, data.receiverId].sort().join('_')}`,
    //   author: data.senderId,
    //   content: data.message,
    //   isPrivate: true
    // })

    // await message.save()

    // Populate author info
    // const populatedMessage = await Message.populate(message, {
    //   path: 'author',
    //   select: 'username'
    // })

    // Emit to both users
    // io.to(data.senderId).emit('receive_private_message', populatedMessage)
    // io.to(data.receiverId).emit('receive_private_message', populatedMessage)
    // } catch (error) {
    //   console.error('Error sending private message:', error)
    //   socket.emit('error', 'Failed to send message')
    // }
  })

  // When user connects, join their personal room
  socket.on('authenticate', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} authenticated for private messages`)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
}
