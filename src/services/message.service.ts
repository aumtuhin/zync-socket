import Message from '../models/message.model'

export const createMessage = async (senderId: string, conversationId: string, content: string) => {
  return await Message.create({
    sender: senderId,
    conversation: conversationId,
    content
  })
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
