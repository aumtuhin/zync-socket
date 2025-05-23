import type { JwtPayload } from 'jsonwebtoken'
import User, { type IUser } from '../models/user.model'
import Contact from '../models/contact.model'
import Conversation from '../models/conversation.model'
import { setCache, getCache, delCache, CacheKeys } from '../utils/redis-helpers.utils'

export const getUserProfile = async (userId: string | JwtPayload) => {
  if (!userId) throw new Error('User ID is required')

  const userIdStr = userId as string

  const userCacheKey = CacheKeys.user(userIdStr)
  const contactsCacheKey = CacheKeys.userContacts(userIdStr)
  const conversationsCacheKey = CacheKeys.userConversations(userIdStr)

  let user = await getCache(userCacheKey)

  if (!user) {
    const foundUser = await User.findById(userIdStr)
      .select('-password')
      .populate({
        path: 'lastActiveConversation',
        populate: {
          path: 'participants',
          select: 'username fullName avatar'
        }
      })
      .lean()
    if (!foundUser) throw new Error('User not found')
    user = foundUser
    await setCache(userCacheKey, user, 300)
  }

  let contacts = await getCache(contactsCacheKey)

  if (!contacts) {
    contacts = await Contact.find({ user: userIdStr })
      .populate({ path: 'recipient', select: 'nickname username avatar email' })
      .select({ user: 0 })
      .sort({ nickname: 1 })
      .lean()
    await setCache(contactsCacheKey, contacts, 300)
  }

  let conversations = await getCache(conversationsCacheKey)
  if (!conversations) {
    conversations = await Conversation.find({ participants: userIdStr })
      .populate({ path: 'participants', select: 'fullName username avatar email phone' })
      .select({ messages: 0 })
      .sort({ updatedAt: -1 })
      .lean()
    await setCache(conversationsCacheKey, conversations, 300)
  }

  return {
    user,
    contacts,
    conversations
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

  delCache(cacheKey)
  setCache(cacheKey, updatedUser, 300)
  return updatedUser
}

export default {
  getUserProfile,
  completeProfile
}
