import User, { type IUser } from '../models/User'

export const getUserProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select('-password') // Exclude password field
  if (!user) throw new Error('User not found')
  return user
}
