import mongoose, { Schema, type Document } from 'mongoose'

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]
  messages?: mongoose.Types.ObjectId[]
  lastMessage?: string | null
  unreadCount?: number
  isArchived?: boolean
  isMuted?: boolean
  createdAt: Date
  updatedAt: Date
}

const ConversationSchema: Schema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    // lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    lastMessage: { type: String || null, default: null },
    unreadCount: { type: Number || null, default: null },
    isArchived: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// Add compound index for faster participant lookup
ConversationSchema.index({ participants: 1 })

export default mongoose.model<IConversation>('Conversation', ConversationSchema)
