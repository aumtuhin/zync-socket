import { Request, Response, NextFunction } from 'express'

export const setCommonHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*') // CORS settings
  res.header('Access-Control-Allow-Headers', 'x-api-key, Content-Type, Authorization')
  next()
}

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const API_KEY = req.headers['x-api-key'] as string // Read API Key from headers
  const VALID_API_KEY = process.env.API_KEY as string // Get API Key from environment variables

  console.log('API Key:', API_KEY)
  console.log('Valid API Key:', VALID_API_KEY)

  if (!API_KEY) {
    res.status(401).json({ message: 'API Key is missing' })
    return
  }

  if (API_KEY !== VALID_API_KEY) {
    res.status(403).json({ message: 'Invalid API Key' })
    return
  }

  next() // Proceed to the next middleware or controller
}
