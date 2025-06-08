import express from 'express'
import { createConversation, getConversations } from '../../controllers/conversation.controller'
import { createConversationValidator } from '../../validators/chat.validator'
import { verifyAccessToken } from '../../middlewares/auth.middleware'
import { formatValidationErrors } from '../../middlewares/error-formatter.middleware'

const router = express.Router()

// Middleware to verify access token
router.use(verifyAccessToken)

router.post('/create', createConversationValidator, formatValidationErrors, createConversation)
router.get('/conversations', verifyAccessToken, getConversations)

export default router
