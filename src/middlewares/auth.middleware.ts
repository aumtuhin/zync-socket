import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import type { Socket } from 'socket.io'

import type { SocketWithUser } from '../interfaces/chat.interface'
import config from '../config'
import { respond } from '../utils/api-response.utils'

declare module 'express' {
  export interface Request {
    userId?: string | JwtPayload
  }
}

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    respond.error(res, 'Access token is missing', 401)
    return
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload
    req.userId = decoded.id // Attach decoded user data to the request
    next() // Proceed to the next handler
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid or expired access token'
    respond.error(res, message, 403)
  }
}

export const authenticateSocket = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Authentication error'))

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string }
    ;(socket as SocketWithUser).user = { _id: decoded.userId }
    next()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication error'
    next(new Error(message))
  }
}
