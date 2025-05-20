import type { JwtPayload } from 'jsonwebtoken'
import User from '../models/user.model'

const addContact = async (
  userId: string | JwtPayload,
  fullName: string,
  email: string,
  phone: string
) => {
  const contact = await User.findOne({ $or: [{ email }, { phone }] })
  if (!contact) throw new Error('User is not Zync a user')

  if (String(contact._id) === String(userId)) {
    throw new Error('You cannot add yourself as a contact')
  }

  const existingContact = await User.findOne({
    _id: userId,
    'contacts._id': contact._id
  })

  if (existingContact) {
    throw new Error('Contact already exists')
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      contacts: {
        _id: contact._id,
        fullName: fullName
      }
    }
  })
}

const getContacts = async (userId: string | JwtPayload) => {
  const ids = []
  const user = await User.findById(userId).populate('contacts')
  if (!user) throw new Error('User not found')
  if (user.contacts.length === 0) {
    throw new Error('No contacts found')
  }
  for (const contact of user.contacts) {
    ids.push(contact._id)
  }
  const contacts = await User.find({ _id: { $in: ids } }, { contacts: 0 }).lean()
  if (!contacts) throw new Error('No contacts found')
  return contacts
}

export default {
  addContact,
  getContacts
}
