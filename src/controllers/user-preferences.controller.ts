import type { Request, Response } from 'express'
import * as preferencesService from '../services/user-preferences.service'
import { respond } from '../utils/api-response.utils'

// GET /api/preferences
export const getPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string
    const prefs = await preferencesService.getUserPreferences(userId)
    respond.success(res, { preferences: prefs || {} })
    return
  } catch (err) {
    respond.error(res, 'Failed to fetch preferences', 500)
    return
  }
}

// PUT /api/preferences
export const updatePreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId as string
    const prefs = await preferencesService.updateUserPreferences(userId, req.body)
    respond.success(res, { preferences: prefs })
    return
  } catch (err) {
    respond.error(res, 'Failed to update preferences', 500)
    return
  }
}
