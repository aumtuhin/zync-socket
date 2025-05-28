import UserPreferences from '../models/user-preferences.model'

export const getUserPreferences = async (userId: string) => {
  const prefs = await UserPreferences.findOne({ user: userId })
  return prefs
}

export const updateUserPreferences = async (
  userId: string,
  updates: Partial<{
    hideOnlineStatus: boolean
    hideLastSeen: boolean
    allowMessagesFrom: 'everyone' | 'contacts'
    allowCallsFrom: 'everyone' | 'contacts'
    notificationsEnabled: boolean
  }>
) => {
  let prefs = await UserPreferences.findOne({ user: userId })

  if (!prefs) {
    prefs = new UserPreferences({ user: userId, ...updates })
  } else {
    Object.assign(prefs, updates)
  }

  await prefs.save()
  return prefs
}
