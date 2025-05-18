import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateJwtToken } from '../utils/jwt-token.utils'
import User from '../models/user.model'
import config from '../config'

interface JwtPayload {
  id: string
}

export const registerUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, email, password: hashedPassword })
  await user.save()

  const token = generateJwtToken(user._id as string, config.jwt.secret, config.jwt.expiresIn)
  const refreshToken = generateJwtToken(
    user._id as string,
    config.jwt.refreshSecret,
    config.jwt.refreshExpiresIn
  )
  return { token, refreshToken }
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found')

  if (!user.password) throw new Error('Password not set')
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid credentials')

  const token = generateJwtToken(user._id as string, config.jwt.secret, config.jwt.expiresIn)
  const refreshToken = generateJwtToken(
    user._id as string,
    config.jwt.refreshSecret,
    config.jwt.refreshExpiresIn
  )

  return { token, refreshToken }
}

export const refreshTokenService = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload
    const newAccessToken = generateJwtToken(
      decoded.id,
      config.jwt.secret,
      config.jwt.expiresIn as jwt.SignOptions['expiresIn']
    )
    return newAccessToken
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired')
    }
    throw new Error('Invalid refresh token')
  }
}
