import type { Server, Socket } from 'socket.io'
import { notifyContactsStatusChange } from './notify-status'
import { updateUnDeliveredMessagesStatus } from './messages'
export const joinRoom = (io: Server, socket: Socket) => {
  socket.on('authenticate', async (userId) => {
    socket.data.userId = userId
    socket.join(userId)
    socket.emit('authenticated', { message: 'Authenticated successfully' })
    notifyContactsStatusChange(io, userId, 'online')
    updateUnDeliveredMessagesStatus(io, socket)
  })
}

export const disconnect = (io: Server, socket: Socket) => {
  socket.on('disconnect', () => {
    const userId = socket.data.userId
    if (!userId) return
    notifyContactsStatusChange(io, userId, 'offline')
  })
}
