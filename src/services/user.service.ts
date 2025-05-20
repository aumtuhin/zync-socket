import type { JwtPayload } from 'jsonwebtoken'
import User, { type IUser } from '../models/user.model'
import Contact from '../models/contact.model'
import Conversation from '../models/conversation.model'
import cache from './cache.service'

const getUserProfile = async (userId: string | JwtPayload) => {
  if (!userId) throw new Error('User ID is required')

  // const cacheKey = `user:${userId}`

  // const cachedUser = await cache.get(cacheKey)

  // if (cachedUser) return cachedUser
  const user = await User.findById(userId).select('-password')

  if (!user) throw new Error('User not found')

  const contacts = await Contact.find({ user: userId })
    .populate({ path: 'recipient', select: 'username avatar email' })
    .select({ user: 0 })
    .sort({ nickname: 1 })
    .lean(true)

  const conversations = await Conversation.find({ participants: userId })
    .populate({ path: 'participants', select: 'username avatar email' })
    .select({ messages: 0 })
    .sort({ updatedAt: -1 })
    .lean(true)

  // await cache.set(cacheKey, user, 300)

  return {
    user,
    contacts: contacts ? contacts : [],
    conversations: conversations ? conversations : []
  }
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
