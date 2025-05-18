import { Server } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import { authenticateSocket } from '../middlewares/auth.middleware'

export const initSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST']
    }
  })
  // io.use(authenticateSocket)
  return io
}
