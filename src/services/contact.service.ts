import type { JwtPayload } from 'jsonwebtoken'
import User from '../models/user.model'
import Contact from '../models/contact.model'
import type { ObjectId } from 'mongoose'
import { setCache, getCache, delCache, CacheKeys } from '../utils/redis-helpers.utils'

const addContact = async (
  userId: string | JwtPayload,
  fullName: string,
  email: string,
  phone: string
) => {
  const zyncUser = await User.findOne({ $or: [{ email }, { phone }] })
  if (!zyncUser) throw new Error('User is not a Zync user')

  if (String(zyncUser._id) === String(userId)) {
    throw new Error('You cannot add yourself as a contact')
  }

  const existingContact = await Contact.findOne({ user: userId, recipient: zyncUser._id })

  if (existingContact) throw new Error('Contact already exists')

  const cacheKey = CacheKeys.userContacts(userId as string)

  const contact = await Contact.create({
    user: userId as ObjectId,
    recipient: zyncUser._id,
    nickname: fullName
  })

  await contact.populate('recipient', 'fullName username email avatar')
  delCache(cacheKey)

  return contact
}

const getContacts = async (userId: string | JwtPayload) => {
  const cacheKey = CacheKeys.userContacts(userId as string)

  const cachedContacts = await getCache(cacheKey)
  console.log('cachedContacts', cachedContacts)

  if (cachedContacts) return cachedContacts

  const contacts = await Contact.find({ user: userId })
    .populate({
      path: 'user recipient',
      select: 'username avatar email'
    })
    .select({
      user: 0
    })
    .sort({ nickname: 1 })
    .lean(true)
  if (!contacts) throw new Error('No contacts found')

  setCache(cacheKey, contacts, 21600)

  return contacts
}

export default {
  addContact,
  getContacts
}
