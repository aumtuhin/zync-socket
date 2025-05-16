import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
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
    respond.error(res, 'Invalid or expired access token', 403)
  }
}
