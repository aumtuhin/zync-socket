import { body } from 'express-validator'

// Common validation messages
const messages = {
  id: 'Contact ID is required.',
  idInvalid: 'Contact ID must be a valid UUID.'
}

export const conversationIdValidator = body('contactId')
  .notEmpty()
  .withMessage(messages.id)
  .isMongoId()
  .withMessage(messages.idInvalid)
  .trim()
  .escape()

export const createConversationValidator = [conversationIdValidator]
