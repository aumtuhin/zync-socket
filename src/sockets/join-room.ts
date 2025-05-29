import type { Server, Socket } from 'socket.io'
import { notifyContactsStatusChange } from './notify-status'

export const authenticate = (io: Server, socket: Socket) => {
  socket.on('authenticate', (userId) => {
    socket.data.userId = userId
    socket.join(userId)
    socket.emit('authenticated', { message: 'Authenticated successfully' })
    notifyContactsStatusChange(io, userId, 'online')
  })
}

export const disconnect = (io: Server, socket: Socket) => {
  socket.on('disconnect', () => {
    const userId = socket.data.userId
    if (!userId) return
    notifyContactsStatusChange(io, userId, 'offline')
  })
}
