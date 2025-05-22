import express from 'express'
import {
  sendMessage,
  getConversationMessages,
  markMessageAsRead,
  deleteMessage
} from '../../controllers/message.controller'
import { verifyAccessToken } from '../../middlewares/auth.middleware'
import { sendMessageValidator } from '../../validators/message.validator'

const router = express.Router()

router.use(verifyAccessToken)
router.post('/', sendMessageValidator, sendMessage)
router.get('/:conversationId', getConversationMessages)
router.patch('/read/:messageId', markMessageAsRead)
router.patch('/delete/:messageId', deleteMessage)

export default router
