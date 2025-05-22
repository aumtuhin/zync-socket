import { body } from 'express-validator'

// Common validation messages
const messages = {
  id: 'Recipient ID is required.',
  idInvalid: 'Recipient ID must be a valid UUID.',
  content: 'Recipient is required.'
}

export const conversationIdValidator = body('recipientId')
  .notEmpty()
  .withMessage(messages.id)
  .isMongoId()
  .withMessage(messages.idInvalid)
  .trim()
  .escape()

export const contentValidator = body('content')
  .notEmpty()
  .withMessage(messages.content)
  .isString()
  .withMessage(messages.content)

export const createConversationValidator = [conversationIdValidator]
