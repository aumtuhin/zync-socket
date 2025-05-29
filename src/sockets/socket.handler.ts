import type { Server, Socket } from 'socket.io'
import { authenticate, disconnect } from './join-room'
import { sendMessage, sendMessageStatus } from './messages'

export const socketHandler = (io: Server, socket: Socket) => {
  authenticate(io, socket)

  sendMessage(io, socket)

  sendMessageStatus(io, socket)

  disconnect(io, socket)
}
