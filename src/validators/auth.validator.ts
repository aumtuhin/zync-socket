import { body } from 'express-validator'
import { usernameValidator } from './user.validator'

// Common validation messages
const messages = {
  passwordRequired: 'Password is required.',
  password: 'Password must be at least 6 characters long.',
  email: 'Please provide a valid email address',
  emailRequired: 'Email is required',
  phone: 'Please provide a valid phone number with country code (e.g. +1234567890)',
  otp: 'Please provide a valid OTP',
  otpInvalid: 'Invalid OTP',
}

export const emailValidator = body('email')
  .isEmail()
  .withMessage(messages.email)
  .notEmpty()
  .withMessage(messages.emailRequired)

const passwordValidator = body('password')
  .isLength({ min: 6 })
  .withMessage(messages.password)
  .notEmpty()
  .withMessage(messages.passwordRequired)

export const phoneValidator = body('phone')
  .isMobilePhone('any', { strictMode: true })
  .withMessage('Please provide a valid phone number.')
  .notEmpty()
  .withMessage('Phone number is required.')

const OTPValidator = body('otp')
  .isLength({ min: 6, max: 6 })
  .withMessage(messages.otpInvalid)
  .notEmpty()
  .withMessage(messages.otp)

export const registerValidator = [usernameValidator, emailValidator, passwordValidator]

export const loginValidator = [emailValidator, passwordValidator]

export const requestSmsOTPValidator = [phoneValidator]

export const requestEmailOTPValidator = [emailValidator]

export const verifyOTPValidator = [OTPValidator]
