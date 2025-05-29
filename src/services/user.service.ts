import type { JwtPayload } from 'jsonwebtoken'
import User, { type IUser } from '../models/user.model'
import Contact from '../models/contact.model'
import Conversation from '../models/conversation.model'
import { getCache, CacheKeys } from '../utils/redis-helpers.utils'

export const getUserProfile = async (userId: string | JwtPayload) => {
  if (!userId) throw new Error('User ID is required')

  const user = await User.findById(userId)
    .select('-password')
    .populate({
      path: 'lastActiveConversation',
      populate: {
        path: 'participants',
        select: 'username fullName avatar'
      }
    })
    .lean()

  if (!user) throw new Error('User not found')

  const userStatusCachedKey = CacheKeys.userStatus(userId.toString())
  const userStatus = (await getCache(userStatusCachedKey)) as {
    userId: string
    status: 'online' | 'offline'
  } | null

  const contacts = await Contact.find({ user: userId })
    .populate({ path: 'recipient', select: 'nickname username avatar email status' })
    .select({ user: 0 })
    .sort({ nickname: 1 })
    .lean()

  const enrichedContacts = await Promise.all(
    contacts.map(async (contact) => {
      const recipientId = contact.recipient._id.toString()
      const statusKey = CacheKeys.userStatus(recipientId)

      const userStatus = (await getCache(statusKey)) as {
        userId: string
        status: 'online' | 'offline'
      } | null

      return {
        ...contact,
        recipient: {
          ...contact.recipient,
          status: userStatus?.status || 'offline'
        }
      }
    })
  )

  const conversations = await Conversation.find({ participants: userId })
    .populate({ path: 'participants', select: 'fullName username avatar email phone status' })
    .select({ messages: 0 })
    .sort({ updatedAt: -1 })
    .lean()

  return {
    user: {
      ...user,
      status: userStatus ? userStatus.status : 'offline'
    },
    contacts: enrichedContacts,
    conversations
  }
}
const completeProfile = async (
  userId: string | JwtPayload,
  fullName: string,
  username: string
): Promise<IUser> => {
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

  return updatedUser
}

export default {
  getUserProfile,
  completeProfile
}
