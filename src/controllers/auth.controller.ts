import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import config from '@/config'

import User from '../models/user.model'

import { refreshTokenService } from '../services/auth.service'

import { generateJwtToken } from '../utils/jwt-token.utils'
import { cookieOptionsForRefreshToken } from '../utils/cookie-options.utils'

export const register = async (req: Request, res: Response): Promise<void> => {
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

    const token = generateJwtToken(user._id as string, config.jwt.secret, '1h')
    const refreshToken = generateJwtToken(user._id as string, config.jwt.refreshSecret, '30d')

    res.cookie('refresh_token', refreshToken, cookieOptionsForRefreshToken)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' })
      return // Ensure to return after response
    }

    if (!user.password) {
      res.status(400).json({ message: 'Password not set' })
      return
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    // Generate token
    const token = generateJwtToken(user._id as string, config.jwt.secret, '1h')
    const refreshToken = generateJwtToken(user._id as string, config.jwt.refreshSecret, '30d')

    res.cookie('refresh_token', refreshToken, cookieOptionsForRefreshToken)
    res.json({ token, refreshToken })
    return
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
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
