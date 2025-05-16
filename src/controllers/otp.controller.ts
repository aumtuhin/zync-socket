import type { Request, Response } from 'express'
import twilio from 'twilio'
import config from '../config'

import {
  sendEmailOTPService,
  sendSmsOTPService,
  verifyEmailOTPService,
} from '../services/otp.service'

import { generateJwtToken } from '../utils/jwt-token.utils'
import { cookieOptionsForRefreshToken } from '../utils/cookie-options.utils'
import { respond } from '../utils/api-response.utils'

// Send OTP via Phone
export const sendSmsOTP = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body
  try {
    const isSent = await sendSmsOTPService(phone)
    if (!isSent) {
      respond.error(res, 'Failed to send OTP')
      return
    }
    respond.success(res, { message: 'OTP sent successfully' })
  } catch (error) {
    respond.error(res, 'Failed to send OTP', error)
  }
}

// Verify Phone OTP
export const verifyPhoneOTP = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body
  const { otp } = req.body

  const client = twilio(config.twilio.accountSid, config.twilio.authToken)

  try {
    const otpRes = await client.verify.v2
      .services(config.twilio.serviceSid)
      .verificationChecks.create({ to: phone, code: otp })

    if (otpRes.status === 'approved') {
      res.status(200).json({ message: 'OTP verified successfully', status: otpRes.status })
    }
    return
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error })
    return
  }
}

// Send OTP via Email
export const sendEmailOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  try {
    await sendEmailOTPService(email)
    respond.success(res, { message: 'OTP sent successfully' })
  } catch (error) {
    respond.error(res, 'Failed to send OTP', error)
  }
}

// Verify Email OTP
export const verifyEmailOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body

  try {
    const otpUser = await verifyEmailOTPService(email, otp)
    const token = generateJwtToken(otpUser._id as string, config.jwt.secret, '1h')
    const refreshToken = generateJwtToken(otpUser._id as string, config.jwt.refreshSecret, '30d')
    res.cookie('refresh_token', refreshToken, cookieOptionsForRefreshToken)
    respond.success(res, {
      message: 'OTP verified successfully',
      otpUser,
      token,
      refreshToken,
    })
  } catch (error) {
    respond.error(res, 'Failed to verify OTP', error)
  }
}
