import express from 'express'
import {
  sendSmsOTP,
  sendEmailOTP,
  verifyPhoneOTP,
  verifyEmailOTP,
} from '../../controllers/otp.controller'
import {
  requestSmsOTPValidator,
  requestEmailOTPValidator,
  verifyOTPValidator,
} from '../../validators/auth.validator'
import { formatValidationErrors } from '../../middleware/error-formatter.middleware'
import { otpLimiter } from '../../middleware/rate-limiter.middleware'

const router = express.Router()

router.post('/request-sms', otpLimiter, requestSmsOTPValidator, formatValidationErrors, sendSmsOTP)
router.post(
  '/request-email',
  otpLimiter,
  requestEmailOTPValidator,
  formatValidationErrors,
  sendEmailOTP,
)
router.post(
  '/verify-sms',
  requestSmsOTPValidator,
  verifyOTPValidator,
  formatValidationErrors,
  verifyPhoneOTP,
)
router.post(
  '/verify-email',
  requestEmailOTPValidator,
  verifyOTPValidator,
  formatValidationErrors,
  verifyEmailOTP,
)

export default router
