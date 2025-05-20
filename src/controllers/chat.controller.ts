// controllers/contact.controller.ts
import type { Request, Response } from 'express'
import chatService from '../services/chat.service'
import { respond } from '../utils/api-response.utils'

export const createConversation = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId
  const { contactId } = req.body

  if (!userId) {
    respond.error(res, 'Unauthorized ', 400)
    return
  }

  try {
    const conversation = await chatService.createConversation(userId, contactId)
    respond.success(res, { message: 'Conversation created successfully', conversation }, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    respond.error(res, message)
  }
}

export const getConversations = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId

  if (!userId) {
    respond.error(res, 'Unauthorized ', 400)
    return
  }

  try {
    const conversations = await chatService.getConversations(userId)
    respond.success(res, { conversations })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    respond.error(res, message)
  }
}
