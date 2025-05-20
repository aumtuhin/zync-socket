import { oneOf } from 'express-validator'
import { fullNameValidator } from './user.validator'
import { phoneValidator, emailValidator } from './auth.validator'

export const addContactValidator = [
  oneOf([phoneValidator, emailValidator], {
    message: 'Either email or phone is required'
  }),
  fullNameValidator
]
