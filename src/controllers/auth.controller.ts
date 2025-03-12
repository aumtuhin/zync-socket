import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { refreshTokenService } from '../services/auth.service'

export const register = async (req: Request, res: Response): Promise<void> => {
  const JWT_SECRET = process.env.JWT_SECRET as string
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
      accessToken: token,
      refreshToken: refreshToken,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const JWT_SECRET = process.env.JWT_SECRET as string
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

    res.json({ accessToken: token, refreshToken: refreshToken })
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
    res.json({ accessToken: token })
    return
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token', error })
    return
  }
}
