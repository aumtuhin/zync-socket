import express from 'express'
import {
  register,
  login,
  refreshToken,
  sendPhoneOTP,
  sendEmailOTP,
  verifyPhoneOTP,
  verifyEmailOTP,
} from '../../controllers/auth.controller'
import {
  loginValidator,
  registerValidator,
  requestPhoneOTPValidator,
  requestEmailOTPValidator,
  verifyOTPValidator,
} from '../../validators/auth.validator'
import { formatValidationErrors } from '../../middleware/errorFormatter.middleware'
import { otpLimiter } from '../../middleware/rateLimiter.middleware'

const router = express.Router()

router.post('/register', registerValidator, formatValidationErrors, register)
router.post('/login', loginValidator, formatValidationErrors, login)
router.post('/refresh-token', refreshToken)
router.post(
  '/request-phone-otp',
  otpLimiter,
  requestPhoneOTPValidator,
  formatValidationErrors,
  sendPhoneOTP,
)
router.post(
  '/request-email-otp',
  otpLimiter,
  requestEmailOTPValidator,
  formatValidationErrors,
  sendEmailOTP,
)
router.post(
  '/verify-phone-otp',
  requestPhoneOTPValidator,
  verifyOTPValidator,
  formatValidationErrors,
  verifyPhoneOTP,
)
router.post(
  '/verify-email-otp',
  requestEmailOTPValidator,
  verifyOTPValidator,
  formatValidationErrors,
  verifyEmailOTP,
)

export default router
