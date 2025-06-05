import type { Socket } from 'socket.io'

declare module 'socket.io' {
  interface Socket {
    user: {
      _id: string
    }
  }
}

export interface SocketWithUser extends Socket {
  user: {
    _id: string
  }
}
