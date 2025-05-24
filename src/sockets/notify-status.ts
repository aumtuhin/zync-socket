import type { Server } from 'socket.io'
import contactService from '../services/contact.service'

export const notifyContactsStatusChange = async (
  io: Server,
  userId: string,
  status: 'online' | 'offline'
) => {
  try {
    io.to(userId).emit('user_status_update', {
      userId: userId,
      recipientId: null,
      status
    })
    const contacts = await contactService.getContacts(userId)
    if (!contacts) return
    for (const contact of contacts) {
      const recipientId = contact.recipient._id.toString()
      io.to(userId).to(recipientId).emit('user_status_update', {
        userId: userId,
        recipientId: recipientId,
        status
      })
    }
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return
  }
}
