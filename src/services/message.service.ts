import Message from '../models/message.model'
import Conversation from '../models/conversation.model'
import User from '../models/user.model'

export const createMessage = async (senderId: string, recipientId: string, content: string) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recipientId] },
    $expr: { $eq: [{ $size: '$participants' }, 2] }
  })

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, recipientId]
    })
  }

  const message = await Message.create({
    sender: senderId,
    conversation: conversation._id,
    content
  })

  await User.findByIdAndUpdate(senderId, {
    lastActiveConversation: conversation._id
  })

  await message.populate('sender', 'username fullName avatar')

  if (!message) {
    throw new Error('Message creation failed')
  }

  // Update lastMessage reference
  conversation.lastMessage = content
  await conversation.save()

  return message
}

export const getMessages = async (conversationId: string, userId: string) => {
  return await Message.find({
    conversation: conversationId,
    deletedFor: { $ne: userId } // Exclude messages deleted for this user
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'username, fullName avatar')
    .lean()
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
