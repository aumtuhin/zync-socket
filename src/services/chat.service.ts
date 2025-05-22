import type { JwtPayload } from 'jsonwebtoken'
import Conversation from '../models/conversation.model'

// currently only string is supported for content
const createConversation = async (userId: string | JwtPayload, recipientId: string) => {
  const existingConversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] }
  })
    .populate({ path: 'participants', select: 'username avatar email' })
    .select({ messages: 0 })
    .sort({ updatedAt: -1 })
    .lean(true)

  if (existingConversation) {
    return existingConversation
  }

  await Conversation.create({
    participants: [userId, recipientId]
  })

  const conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] }
  })
    .populate({ path: 'participants', select: 'username avatar email' })
    .select({ messages: 0 })
    .sort({ updatedAt: -1 })
    .lean(true)

  return conversation
}

const getConversations = async (userId: string | JwtPayload) => {
  const conversations = await Conversation.find({ participants: userId })
    .populate({ path: 'participants', select: 'username avatar email' })
    .select({ messages: 0 })
    .sort({ updatedAt: -1 })
    .lean(true)

  if (!conversations) throw new Error('Conversations not found')
  return conversations
}

export default {
  createConversation,
  getConversations
}
