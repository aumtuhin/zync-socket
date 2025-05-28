import type { Server } from 'socket.io'
import userNotificationService from '../services/user-notification.service'

export const notifyContactsStatusChange = async (
  io: Server,
  userId: string,
  status: 'online' | 'offline'
) => {
  try {
    io.to(userId).emit('user_status_update', {
      userId: userId,
      status
    })
    userNotificationService.cacheUserStatus(userId, status)
    const notifyUserIds = await userNotificationService.getNotifyUserIds(userId)
    if (!notifyUserIds || notifyUserIds.length === 0) return
    for (const recipient of notifyUserIds) {
      io.to(recipient).emit('user_status_update', { userId, status })
    }
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return
  }
}
