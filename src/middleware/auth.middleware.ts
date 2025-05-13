import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

declare module 'express' {
  interface Request {
    userId?: string | JwtPayload
  }
}

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET as string

  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ message: 'Access token is missing' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.userId = decoded.id // Attach decoded user data to the request
    next() // Proceed to the next handler
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired access token', error })
  }
}
