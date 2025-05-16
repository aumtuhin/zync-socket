import type { Request, Response } from 'express'

import User from '../models/User'
import OTPUser from '../models/OTP-User'

export const userProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId // Get user ID from decoded JWT payload
    const user = await User.findById(userId).select('-password') // Exclude password field
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json({ user })
    return
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const completeProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId // Get user ID from decoded JWT payload
    const { fullName, username } = req.body

    // Validate input
    if (!fullName || !username) {
      res.status(400).json({ message: 'Full name and username are required' })
      return
    }

    // Update user profile
    const updatedUser = await OTPUser.findByIdAndUpdate(
      userId,
      { fullName, username, profileComplete: true }, // Mark profile as completed
    ).select('-password') // Exclude password field

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
