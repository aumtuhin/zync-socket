import { Request, Response } from 'express'
import User from '../models/User'

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
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
