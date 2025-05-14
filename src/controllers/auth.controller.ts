import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import twilio from 'twilio'

import fs from 'node:fs'
import handlebars from 'handlebars'
import { resolve } from 'node:path'

import User from '../models/User'
import { refreshTokenService } from '../services/auth.service'
import { generateOTP } from '../utils/otp-generator.utils'
import { generateJwtToken } from '../utils/jwt-token-generator.utils'

// todo move to utils or config
const cookieOptions = {
  httpOnly: true,
  secure: false, // Use `false` in development
  maxAge: 30 * 24 * 60 * 60 * 1000, // Set cookie expiration date (30 days)
}

export const register = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line no-undef
  const JWT_SECRET = process.env.JWT_SECRET as string
  // eslint-disable-next-line no-undef
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

  try {
    const { username, email, password } = req.body

    // Check if username already exists
    if (await User.findOne({ username })) {
      res.status(400).json({ message: 'Username already in use' })
      return // Ensure to return after response
    }

    // Check if email already exists
    if (await User.findOne({ email })) {
      res.status(400).json({ message: 'Email already in use' })
      return
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedPassword })

    await user.save()

    const token = generateJwtToken(user._id as string, JWT_SECRET, '1h')
    const refreshToken = generateJwtToken(user._id as string, JWT_REFRESH_SECRET, '30d')

    res.cookie('refresh_token', refreshToken, cookieOptions)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line no-undef
  const JWT_SECRET = process.env.JWT_SECRET as string
  // eslint-disable-next-line no-undef
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' })
      return // Ensure to return after response
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    // Generate token
    const token = generateJwtToken(user._id as string, JWT_SECRET, '1h')
    const refreshToken = generateJwtToken(user._id as string, JWT_REFRESH_SECRET, '30d')

    res.cookie('refresh_token', refreshToken, cookieOptions)

    res.json({ token, refreshToken })
    return
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// Send OTP via Phone
export const sendPhoneOTP = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body
  // eslint-disable-next-line no-undef
  const accountSid = process.env.TWILIO_ACCOUNT_SID as string
  // eslint-disable-next-line no-undef
  const authToken = process.env.TWILIO_AUTH_TOKEN as string
  // eslint-disable-next-line no-undef
  const serviceSid = process.env.TWILIO_SERVICE_SID as string
  const client = twilio(accountSid, authToken)

  try {
    const otpRes = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone, channel: 'sms' })
    if (otpRes.status === 'pending') {
      res.status(200).json({ message: 'OTP sent successfully', to: phone })
    }
    return
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error })
    return
  }
}

// Send OTP via Phone
export const verifyPhoneOTP = async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body
  const { otp } = req.body

  // eslint-disable-next-line no-undef
  const accountSid = process.env.TWILIO_ACCOUNT_SID as string
  // eslint-disable-next-line no-undef
  const authToken = process.env.TWILIO_AUTH_TOKEN as string
  // eslint-disable-next-line no-undef
  const serviceSid = process.env.TWILIO_SERVICE_SID as string
  const client = twilio(accountSid, authToken)

  try {
    const otpRes = await client.verify.v2
      .services(serviceSid)
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
  // eslint-disable-next-line no-undef
  const EMAIL_USER = process.env.EMAIL_USER as string
  // eslint-disable-next-line no-undef
  const EMAIL_PASS = process.env.EMAIL_PASS as string
  // eslint-disable-next-line no-undef
  const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail'

  const { email } = req.body
  const otp = generateOTP()

  // eslint-disable-next-line no-undef
  const templatePath = resolve(process.cwd(), 'src/templates/otpEmail.hbs')
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = handlebars.compile(templateSource)

  const html = template({
    otp: otp,
    expiry: 10,
  })

  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })

  // todo move to utils and handle as html file
  const mailOptions = {
    from: `"OTP Service" <${EMAIL_USER}>`,
    to: email,
    subject: 'Your One-Time Password (OTP)',
    html: html,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'OTP sent successfully', to: email, otp })
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) {
      res.status(400).json({ message: 'No refresh token provided' })
      return
    }
    const token = await refreshTokenService(req.cookies.refresh_token)
    res.json({ token })
    return
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token', error })
    return
  }
}
