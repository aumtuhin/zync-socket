import { Server } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import { authenticateSocket } from '../middlewares/auth.middleware'

export const initSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: [
        'https://zync-ashy.vercel.app',
        'http://localhost:5173',
        'http://192.168.0.116:5173'
      ],
      credentials: true
    }
  })
  io.use(authenticateSocket)
  return io
}
