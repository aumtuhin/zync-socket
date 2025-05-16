import type { Request, Response } from 'express'
import userService from '../services/user.service'
import { respond } from '../utils/api-response.utils'

export const userProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      respond.error(res, 'User ID is required', 401)
      return
    }
    const user = await userService.getUserProfile(req.userId)
    respond.success(res, { message: 'User profile retrieved successfully', user })
    return
  } catch (error) {
    respond.error(res, 'Failed to retrieve user profile', 500)
    return
  }
}

export const completeProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId
    const { fullName, username } = req.body
    if (!userId) {
      respond.error(res, 'User ID is required', 401)
      return
    }
    const updatedUser = await userService.completeProfile(userId, fullName, username)
    if (!updatedUser) {
      respond.error(res, 'Failed to update profile', 404)
      return
    }

    respond.success(res, {
      message: 'Profile updated successfully',
      updatedUser,
    })
  } catch (error) {
    respond.error(res, 'Filed to update profile')
    return
  }
}
