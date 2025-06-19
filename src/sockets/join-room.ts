import type { Server, Socket } from 'socket.io'
import { Events } from '../constants/enum'
import { notifyContactsStatusChange } from './notify-status'
import { updateUnDeliveredMessagesStatus } from './messages'

export const joinRoom = (io: Server, socket: Socket) => {
  socket.on(Events.AUTHENTICATE, async (userId) => {
    socket.data.userId = userId
    socket.join(userId)
    socket.emit(Events.AUTHENTICATED, { message: 'Authenticated successfully' })
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
