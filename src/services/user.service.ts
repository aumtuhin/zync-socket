import User from '../models/User'

export const getUserProfile = async (userId: string) => {
  try {
    const user = await User.findById(userId).select('-password') // Exclude password field
    if (!user) {
      throw new Error('User not found')
    }
    return user
  } catch (error) {
    throw new Error('Server error')
  }
}
