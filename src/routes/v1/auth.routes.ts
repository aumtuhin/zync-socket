import express from 'express'
import {
  register,
  login,
  refreshToken,
} from '../../controllers/auth.controller'
import {
  loginValidator,
  registerValidator,
} from '../../validators/auth.validator'
import { handleValidation } from '../../middleware/validation.middleware'

const router = express.Router()

router.post('/register', registerValidator, handleValidation, register)
router.post('/login', loginValidator, handleValidation, login)
router.post('/refresh-token', refreshToken)

export default router
