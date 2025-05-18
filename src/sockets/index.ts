import { Server } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import { authenticateSocket } from '../middlewares/auth.middleware'
import type { SocketWithUser } from '../interfaces/chat.interface'

export const initSocket = (server: HttpServer): void => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST'],
    },
  })

  // io.use(authenticateSocket)

  io.on('connection', (socket: SocketWithUser) => {
    console.log(`User ${socket.id} connected`)

    // Join user to their personal room
    socket.join(`user_${socket.id}`)

    // Listen for messages
    socket.on('send_message', (data) => {
      console.log(`Message from ${socket.id}: ${data}`)
      io.emit('receive_message', data)
    })

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`)
    })
  })
}
