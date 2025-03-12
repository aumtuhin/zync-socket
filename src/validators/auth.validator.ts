import { body } from 'express-validator'

export const registerValidator = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters.')
    .notEmpty()
    .withMessage('Username is required.'),
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email.')
    .notEmpty()
    .withMessage('Email is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .notEmpty()
    .withMessage('Password is required.'),
]

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .notEmpty()
    .withMessage('Email is required.'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .notEmpty()
    .withMessage('Password is required.'),
]
