import express from 'express'
import { createConversation, getConversations } from '../../controllers/chat.controller'
import { createConversationValidator } from '../../validators/chat.validator'
import { verifyAccessToken } from '../../middlewares/auth.middleware'
import { formatValidationErrors } from '@/middlewares/error-formatter.middleware'

const router = express.Router()

router.post(
  '/create',
  verifyAccessToken,
  createConversationValidator,
  formatValidationErrors,
  createConversation
)
router.get('/conversations', verifyAccessToken, getConversations)

export default router
