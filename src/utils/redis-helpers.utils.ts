import { redisClient } from '../db'

export const setCache = async (key: string, value: unknown, ttlSeconds = 3600) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds })
}

export const getCache = async <T = unknown>(key: string): Promise<T | null> => {
  const val = await redisClient.get(key)
  return val ? JSON.parse(val) : null
}

export const delCache = async (key: string) => {
  await redisClient.del(key)
}

export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userProfile: (userId: string) => `user_profile:${userId}`,
  userContacts: (userId: string) => `user_contacts:${userId}`,
  userConversations: (userId: string) => `user_conversations:${userId}`,
  userStatus: (userId: string) => `user_status:${userId}`,
  conversationMessages: (conversationId: string) => `conversation_messages:${conversationId}`
}
