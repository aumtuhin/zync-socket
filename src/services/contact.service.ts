import type { JwtPayload } from 'jsonwebtoken'
import User from '../models/user.model'
import Contact from '../models/contact.model'
import type { ObjectId } from 'mongoose'

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

  const contact = await Contact.create({
    user: userId as ObjectId,
    recipient: zyncUser._id,
    nickname: fullName
  })

  await contact.populate('recipient', 'fullName username email avatar')
  return contact
}

const getContacts = async (userId: string | JwtPayload) => {
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
  return contacts
}

export default {
  addContact,
  getContacts
}
