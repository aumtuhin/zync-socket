import Contact from '../models/contact.model'
import Conversation from '../models/conversation.model'
import { setCache, CacheKeys } from '../utils/redis-helpers.utils'

export const getNotifyUserIds = async (userId: string): Promise<string[]> => {
  if (!userId) throw new Error('User ID is required')

  // todo: for a short period, we can cache this result, 30 seconds
  // not hitting db frequently

  const [contacts, conversations] = await Promise.all([
    Contact.find({ recipient: userId, status: 'accepted' }).select('user'),
    Conversation.find({ participants: userId }).select('participants')
  ])

  const fromContacts = contacts.map((c) => c.user.toString())
  const fromConversations = conversations
    .flatMap((conversation) => conversation.participants)
    .filter((id) => id.toString() !== userId)
    .map((id) => id.toString())

  return Array.from(new Set([...fromContacts, ...fromConversations]))
}

const cacheUserStatus = async (userId: string, status: 'online' | 'offline') => {
  if (!userId) throw new Error('User ID is required')
  const userStatusCacheKey = CacheKeys.userStatus(userId)
  setCache(userStatusCacheKey, { userId, status }, 300) // Cache for 5 minutes
}

export default {
  getNotifyUserIds,
  cacheUserStatus
}
