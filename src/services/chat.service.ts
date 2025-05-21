import type { JwtPayload } from 'jsonwebtoken'
import Conversation from '../models/conversation.model'

const createConversation = async (userId: string | JwtPayload, contactId: string) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, contactId] }
  })

  if (conversation) {
    throw new Error('Conversation already exists')
  }

  const newConversation = await Conversation.create({
    participants: [userId, contactId]
  })

  return newConversation
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
