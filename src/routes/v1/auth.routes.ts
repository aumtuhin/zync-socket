import express from 'express'
import { register, login, refreshToken, sendOTP } from '@/controllers/auth.controller'
import { loginValidator, registerValidator, requestOTPValidator } from '@/validators/auth.validator'
import { formatValidationErrors } from '@/middleware/errorFormatter.middleware'

const router = express.Router()

router.post('/register', registerValidator, formatValidationErrors, register)
router.post('/login', loginValidator, formatValidationErrors, login)
router.post('/request-otp', requestOTPValidator, formatValidationErrors, sendOTP)
router.post('/refresh-token', refreshToken)

export default router
