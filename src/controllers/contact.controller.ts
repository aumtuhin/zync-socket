import type { Request, Response } from 'express'
import contactService from '../services/contact.service'
import { respond } from '../utils/api-response.utils'

export const addContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId
    const { fullName, email, phone } = req.body

    if (!userId) {
      respond.error(res, 'Unauthorized ', 400)
      return
    }
    const contact = await contactService.addContact(userId, fullName, email, phone)
    respond.success(res, { message: 'Contact added successfully', contact }, 201)
    return
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    let status: number
    switch (true) {
      case message === 'User is not a Zync user':
        status = 404
        break
      case message === 'You cannot add yourself as a contact':
      case message === 'Contact already exists':
        status = 400
        break
      default:
        status = 500
        break
    }

    respond.error(res, message, status)
  }
}

export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      respond.error(res, 'Unauthorized ', 400)
      return
    }

    const contacts = await contactService.getContacts(userId)
    respond.success(res, { contacts })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    respond.error(res, message, 500)
  }
}
