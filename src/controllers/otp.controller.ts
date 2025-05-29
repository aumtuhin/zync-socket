import type { Request, Response } from 'express'

import config from '../config'
import otpService from '../services/otp.service'

import { generateJwtToken } from '../utils/jwt-token.utils'
import { cookieOptionsForRefreshToken } from '../utils/cookie-options.utils'
import { respond } from '../utils/api-response.utils'

// Send OTP via Phone
export const sendSmsOTP = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body
  try {
    const isSent = await otpService.sendSmsOTP(phone)
    if (!isSent) {
      respond.error(res, 'Failed to send OTP')
      return
    }
    respond.success(res, { message: 'OTP sent successfully' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP'
    respond.error(res, message)
  }
}

// Verify Phone OTP
export const verifyPhoneOTP = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body
  const { otp } = req.body

  try {
    const user = await otpService.verifySmsOTP(phone, otp)
    if (!user) {
      respond.error(res, 'Failed to verify OTP')
      return
    }
    const token = generateJwtToken(phone, config.jwt.secret, '1h')
    const refreshToken = generateJwtToken(phone, config.jwt.refreshSecret, '30d')
    res.cookie('refresh_token', refreshToken, cookieOptionsForRefreshToken)
    respond.success(res, {
      message: 'OTP verified successfully',
      user,
      token,
      refreshToken
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify OTP'
    respond.error(res, message)
  }
}

// Send OTP via Email
export const sendEmailOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  try {
    await otpService.sendEmailOTP(email)
    respond.success(res, { message: 'OTP sent successfully' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP'
    respond.error(res, message)
  }
}

// Verify Email OTP
export const verifyEmailOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body
  try {
    const user = await otpService.verifyEmailOTP(email, otp)
    const token = generateJwtToken(user._id as string, config.jwt.secret, '1h')
    const refreshToken = generateJwtToken(user._id as string, config.jwt.refreshSecret, '30d')
    res.cookie('refresh_token', refreshToken, cookieOptionsForRefreshToken)
    respond.success(res, {
      message: 'OTP verified successfully',
      user,
      token,
      refreshToken
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify OTP'
    respond.error(res, message)
  }
}
