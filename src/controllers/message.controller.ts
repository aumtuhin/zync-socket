import type { Request, Response } from 'express'
import * as messageService from '../services/message.service'
import { respond } from '@/utils/api-response.utils'

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { conversationId, content } = req.body
  if (!conversationId || !content) {
    respond.error(res, 'Conversation ID and content are required', 400)
    return
  }
  const senderId = req.userId as string

  if (!senderId) {
    respond.error(res, 'Unauthorized', 400)
    return
  }

  const message = await messageService.createMessage(senderId, conversationId, content)
  respond.success(res, { message }, 201)
}

export const getConversationMessages = async (req: Request, res: Response): Promise<void> => {
  const { conversationId } = req.params
  const userId = req.userId as string

  if (!conversationId) {
    respond.error(res, 'Conversation ID is required', 400)
    return
  }

  if (!userId) {
    respond.error(res, 'Unauthorized', 400)
    return
  }

  const messages = await messageService.getMessages(conversationId, userId)
  respond.success(res, { messages })
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
