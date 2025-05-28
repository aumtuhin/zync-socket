import mongoose, { Schema, model } from 'mongoose'

const UserPreferencesSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },

    hideOnlineStatus: { type: Boolean, default: false },
    hideLastSeen: { type: Boolean, default: false },
    allowMessagesFrom: {
      type: String,
      enum: ['everyone', 'contacts'],
      default: 'everyone'
    },
    allowCallsFrom: {
      type: String,
      enum: ['everyone', 'contacts'],
      default: 'everyone'
    },
    notificationsEnabled: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export default model('UserPreferences', UserPreferencesSchema)
