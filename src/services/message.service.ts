import Message from '../models/message.model'
import Conversation from '../models/conversation.model'
import User from '../models/user.model'
import mongoose from 'mongoose'

type MessageResponse = {
  _id: string
  sender: {
    _id: string
  }
  conversation: string
  content: string
  status: 'sent' | 'delivered' | 'read'
  createdAt: Date
  updatedAt: Date
  deletedFor?: string[]
}

export const createMessage = async (senderId: string, recipientId: string, content: string) => {
  if (!senderId || !recipientId || !content) {
    throw new Error('Missing parameters for creating message')
  }

  // Check or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recipientId] },
    $expr: { $eq: [{ $size: '$participants' }, 2] }
  })

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, recipientId]
    })
  }

  // Create message
  const message = await Message.create({
    sender: senderId,
    conversation: conversation._id,
    content
  })

  // Update sender's last active conversation
  await User.findByIdAndUpdate(senderId, {
    lastActiveConversation: conversation._id
  })

  // Update conversation's last message
  conversation.lastMessage = content
  await conversation.save()

  // Populate message and conversation participants
  await message.populate('sender', 'username fullName avatar email phone status')

  await conversation.populate({
    path: 'participants',
    select: 'username fullName avatar email phone status'
  })

  return { message, conversation }
}

export const getMessages = async (conversationId: string, userId: string) => {
  return await Message.find({
    conversation: conversationId,
    deletedFor: { $ne: userId } // Exclude messages deleted for this user
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'username, fullName avatar email phone status')
    .lean()
}

export const getUndeliveredMessages = async (userId: string) => {
  const messages = await Message.find({
    status: 'sent',
    sender: { $ne: new mongoose.Types.ObjectId(userId) },
    deletedFor: { $ne: new mongoose.Types.ObjectId(userId) }
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'username, fullName avatar email phone status')
    .lean()

  return messages
}

export const updateMessageStatus = async (
  messageId: string,
  status: string
): Promise<MessageResponse> => {
  const updatedMessage = (await Message.findByIdAndUpdate(
    messageId,
    { status: status },
    { new: true }
  )
    .populate('sender', 'username fullName avatar email phone status')
    .lean()) as unknown as MessageResponse

  if (!updatedMessage) {
    throw new Error('Message not found')
  }

  return updatedMessage
}

export const markAsRead = async (messageId: string) => {
  return await Message.findByIdAndUpdate(messageId, { status: 'read' }, { new: true })
}

export const deleteMessageForUser = async (messageId: string, userId: string) => {
  return await Message.findByIdAndUpdate(
    messageId,
    { $addToSet: { deletedFor: userId } },
    { new: true }
  )
}
