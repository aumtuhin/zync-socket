import rateLimit from 'express-rate-limit'

export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 3, // limit each IP to 3 OTP requests per windowMs
  message: 'Too many OTP requests, please try 60 minutes later',
})
