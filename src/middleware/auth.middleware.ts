/* eslint-disable no-undef */
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

declare module 'express' {
  // eslint-disable-next-line no-unused-vars
  interface Request {
    userId?: string | JwtPayload
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ message: 'Access token is missing', authorized: false })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.userId = decoded.id // Attach decoded user data to the request
    next() // Proceed to the next handler
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired access token', authorized: false, error })
  }
}
