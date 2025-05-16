import type { JwtPayload } from 'jsonwebtoken'
import OTPUser, { type IOTPUser } from '../models/OTP-User'

const getUserProfile = async (userId: string | JwtPayload): Promise<IOTPUser> => {
  if (!userId) throw new Error('User ID is required')
  const user = await OTPUser.findById(userId) // Exclude password field
  if (!user) throw new Error('User not found')
  return user
}

const completeProfile = async (
  userId: string | JwtPayload,
  fullName: string,
  username: string,
): Promise<IOTPUser> => {
  const updatedUser = await OTPUser.findByIdAndUpdate(
    userId,
    {
      fullName,
      username,
      isProfileCompleted: true,
    },
    { new: true },
  )

  if (!updatedUser) {
    throw new Error('User not found')
  }

  return updatedUser
}

export default {
  getUserProfile,
  completeProfile,
}
