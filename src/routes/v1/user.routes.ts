import express from 'express'
import { authMiddleware } from '../../middleware/auth.middleware'

const router = express.Router()

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessed', userId: req.user })
})

export default router
