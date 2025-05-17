import type { JwtPayload } from 'jsonwebtoken'
import OTPUser, { type IOTPUser } from '../models/otp-user.model'
import cache from './cache.service'

const getUserProfile = async (userId: string | JwtPayload): Promise<IOTPUser> => {
  if (!userId) throw new Error('User ID is required')

  const cacheKey = `user:${userId}`

  const cachedUser = await cache.get(cacheKey)
  if (cachedUser) return cachedUser

  const user = await OTPUser.findById(userId) // Exclude password field
  if (!user) throw new Error('User not found')
  await cache.set(cacheKey, user, 300)
  return user
}

const completeProfile = async (
  userId: string | JwtPayload,
  fullName: string,
  username: string,
): Promise<IOTPUser> => {
  const cacheKey = `user:${userId}`
  const updatedUser = await OTPUser.findByIdAndUpdate(
    userId,
    {
      fullName,
      username,
      isProfileCompleted: true,
    },
    { new: true },
  )

  if (!updatedUser) {
    throw new Error('User not found')
  }

  await cache.del(cacheKey)
  return updatedUser
}

export default {
  getUserProfile,
  completeProfile,
}
