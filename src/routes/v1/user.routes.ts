import express from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { verifyAccessToken } from '../../middleware/auth.middleware'
import { userProfile } from '../../controllers/user.controller'

declare module 'express' {
  interface Request {
    user?: string | JwtPayload
  }
}

const router = express.Router()

router.get('/profile', verifyAccessToken, userProfile)

export default router
