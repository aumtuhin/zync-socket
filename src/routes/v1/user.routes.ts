import express from 'express'
import { verifyAccessToken } from '../../middleware/auth.middleware'
import { userProfile } from '../../controllers/user.controller'

const router = express.Router()

router.get('/profile', verifyAccessToken, userProfile)

export default router
