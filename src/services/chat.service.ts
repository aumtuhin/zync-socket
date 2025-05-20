import type { JwtPayload } from 'jsonwebtoken'
import Conversation from '../models/conversation.model'
import User from '../models/user.model'

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

  const participantIds = [userId, contactId]

  await User.updateMany(
    { _id: { $in: participantIds } },
    { $addToSet: { conversations: newConversation._id } }
  )

  return newConversation
}

const getConversations = async (userId: string | JwtPayload) => {
  const page = 1
  const limit = 20

  const user = await User.findById(userId).populate({
    path: 'conversations',
    options: {
      sort: { updatedAt: -1 },
      skip: (page - 1) * limit,
      limit: limit
    },
    select: '-messages',
    populate: [
      {
        path: 'participants',
        match: { _id: { $ne: userId } },
        select: 'fullName email phone avatar'
      }
    ]
  })

  if (!user?.conversations) throw new Error('Conversations not found')
  return user.conversations
}

export default {
  createConversation,
  getConversations
}
