import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import User from '@/models/User'
import { refreshTokenService } from '@/services/auth.service'
import { generateOTP } from '@/utils/otp-generator'

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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // Use `false` in development
      maxAge: 30 * 24 * 60 * 60 * 1000, // Set cookie expiration date (30 days)
    })

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
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // Use `false` in development
      maxAge: 30 * 24 * 60 * 60 * 1000, // Set cookie expiration date (30 days)
    })

    res.json({ token, refreshToken })
    return
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// Send OTP via Email or Phone
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line no-undef
  const EMAIL_USER = process.env.EMAIL_USER as string
  // eslint-disable-next-line no-undef
  const EMAIL_PASS = process.env.EMAIL_PASS as string
  // eslint-disable-next-line no-undef
  const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail'

  const { email } = req.body
  const otp = generateOTP()

  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: `"OTP Service" <${EMAIL_USER}>`,
    to: email,
    subject: 'Your One-Time Password (OTP)',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Your Verification Code</h2>
        <p>Please use the following code to verify your account:</p>
        <div style="background: #f3f4f6; padding: 10px 15px; font-size: 24px; letter-spacing: 2px; display: inline-block; margin: 10px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
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
