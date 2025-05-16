import { body } from 'express-validator'

// Common validation messages
const messages = {
  fullName: 'Full name must be between 3 and 30 characters.',
  fullNameRequired: 'Full name is required.',
  fullNameInvalid: 'Full name can only contain letters and spaces',
  username: 'Username must be between 3 and 30 characters.',
  usernameRequired: 'Username is required.',
}

export const fullNameValidator = body('fullName')
  .isLength({ min: 3, max: 30 })
  .withMessage(messages.fullName)
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage(messages.fullNameInvalid)
  .notEmpty()
  .withMessage(messages.fullNameRequired)
  .trim()
  .escape()
  .notEmpty()
  .withMessage(messages.fullNameRequired)

export const usernameValidator = body('username')
  .isLength({ min: 3, max: 30 })
  .withMessage(messages.username)
  .matches(/^[a-zA-Z0-9._-]+$/)
  .withMessage('Username can only contain letters, numbers, dots, underscores, and hyphens')
  .notEmpty()
  .withMessage(messages.usernameRequired)

export const completeProfileValidator = [fullNameValidator, usernameValidator]
