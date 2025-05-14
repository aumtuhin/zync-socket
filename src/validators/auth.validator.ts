import { body, oneOf } from 'express-validator'

// Common validation messages
const messages = {
  username: 'Username must be between 3 and 30 characters.',
  usernameRequired: 'Username is required.',
  passwordRequired: 'Password is required.',
  password: 'Password must be at least 6 characters long.',
  email: 'Please provide a valid email address',
  emailRequired: 'Email is required',
  phone: 'Please provide a valid phone number with country code (e.g. +1234567890)',
  contactRequired: 'Either email or phone number is required',
}

const emailValidator = body('email')
  .isEmail()
  .withMessage(messages.email)
  .notEmpty()
  .withMessage(messages.emailRequired)

const passwordValidator = body('password')
  .isLength({ min: 6 })
  .withMessage(messages.password)
  .notEmpty()
  .withMessage(messages.passwordRequired)

const usernameValidator = body('username')
  .isLength({ min: 3, max: 30 })
  .withMessage(messages.username)
  .notEmpty()
  .withMessage(messages.usernameRequired)

const phoneValidator = body('phone')
  .isMobilePhone('any', { strictMode: true })
  .withMessage('Please provide a valid phone number.')
  .notEmpty()
  .withMessage('Phone number is required.')

export const registerValidator = [usernameValidator, emailValidator, passwordValidator]

export const loginValidator = [emailValidator, passwordValidator]

export const requestOTPValidator = [
  oneOf([emailValidator, phoneValidator], { message: messages.contactRequired }),
]
