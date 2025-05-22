import type { Request, Response } from 'express'
import * as messageService from '../services/message.service'

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { conversationId, content } = req.body
  if (!conversationId || !content) {
    res.status(400).json({ success: false, message: 'Conversation ID and content are required' })
    return
  }
  const senderId = req.userId as string

  if (!senderId) {
    res.status(400).json({ success: false, message: 'Unauthorized' })
    return
  }

  const message = await messageService.createMessage(senderId, conversationId, content)
  res.status(201).json({ success: true, data: message })
}

export const getConversationMessages = async (req: Request, res: Response): Promise<void> => {
  const { conversationId } = req.params
  const userId = req.userId as string

  if (!conversationId) {
    res.status(400).json({ success: false, message: 'Conversation ID is required' })
    return
  }

  if (!userId) {
    res.status(400).json({ success: false, message: 'Unauthorized' })
    return
  }

  const messages = await messageService.getMessages(conversationId, userId)
  res.json({ success: true, data: messages })
  return
}

export const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
  const { messageId } = req.params
  const updated = await messageService.markAsRead(messageId)
  res.json({ success: true, data: updated })
  return
}

export const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params
  const userId = req.userId as string
  if (!userId) {
    res.status(400).json({ success: false, message: 'Unauthorized' })
    return
  }

  const updated = await messageService.deleteMessageForUser(messageId, userId)
  res.json({ success: true, data: updated })
}
