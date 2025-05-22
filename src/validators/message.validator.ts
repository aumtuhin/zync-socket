import { body } from 'express-validator'
import { contentValidator } from './chat.validator'

// Common validation messages
const messages = {
  id: 'Conversation ID is required.',
  idInvalid: 'Contact ID must be a valid UUID.',
  content: 'Content is required.'
}

export const conversationIdValidator = body('recipientId')
  .notEmpty()
  .withMessage(messages.id)
  .isMongoId()
  .withMessage(messages.idInvalid)
  .trim()
  .escape()

export const sendMessageValidator = [conversationIdValidator, contentValidator]
