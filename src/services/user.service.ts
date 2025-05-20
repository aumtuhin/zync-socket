import type { JwtPayload } from 'jsonwebtoken'
import User, { type IUser } from '../models/user.model'
import cache from './cache.service'

const getUserProfile = async (userId: string | JwtPayload): Promise<IUser> => {
  if (!userId) throw new Error('User ID is required')

  const cacheKey = `user:${userId}`

  const cachedUser = await cache.get(cacheKey)
  if (cachedUser) return cachedUser

  const user = await User.findById(userId) // Exclude password field
  if (!user) throw new Error('User not found')
  await cache.set(cacheKey, user, 300)
  return user
}

const completeProfile = async (
  userId: string | JwtPayload,
  fullName: string,
  username: string
): Promise<IUser> => {
  const cacheKey = `user:${userId}`

  const usernameExists = await User.findOne({ username })
  if (usernameExists) {
    throw new Error('Username already exists')
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      fullName,
      username,
      isProfileCompleted: true
    },
    { new: true }
  )

  if (!updatedUser) {
    throw new Error('User not found')
  }

  await cache.del(cacheKey)
  return updatedUser
}

export default {
  getUserProfile,
  completeProfile
}
