import { body } from 'express-validator'

// Common validation messages
const messages = {
  id: 'Contact ID is required.',
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

const contentValidator = body('content')
  .notEmpty()
  .withMessage(messages.content)
  .isString()
  .withMessage(messages.content)

export const createConversationValidator = [conversationIdValidator, contentValidator]
