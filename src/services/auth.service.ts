import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { config } from 'dotenv'

config()

interface JwtPayload {
  id: string
}

export const registerUser = async (username: string, email: string, password: string) => {
  const JWT_SECRET = process.env.JWT_SECRET as string
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, email, password: hashedPassword })
  await user.save()

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  })

  return { token, refreshToken }
}

export const loginUser = async (email: string, password: string) => {
  const JWT_SECRET = process.env.JWT_SECRET as string
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid credentials')

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' })

  return { token, refreshToken }
}

export const refreshTokenService = async (refreshToken: string) => {
  const JWT_SECRET = process.env.JWT_SECRET as string
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload
    const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
      expiresIn: '1h',
    })
    return newAccessToken
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired')
    }
    throw new Error('Invalid refresh token')
  }
}
