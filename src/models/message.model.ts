import mongoose, { Schema, type Document } from 'mongoose'

interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  content: string
  contentType: 'text' | 'image' | 'video' | 'file' | 'audio'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  readBy: mongoose.Types.ObjectId[]
  reactions: {
    userId: mongoose.Types.ObjectId
    emoji: string
  }[]
  metadata: {
    originalName?: string // For files
    size?: number // For files
    duration?: number // For audio/video
    thumbnail?: string // For images/video
  }
  deleted: {
    isDeleted: boolean
    deletedBy?: mongoose.Types.ObjectId
    deletedAt?: Date
  }
  edited: boolean
  replyTo?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const MessageSchema: Schema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'video', 'file', 'audio'],
      default: 'text'
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent'
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    reactions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        emoji: {
          type: String,
          required: true,
          maxlength: 5 // For emoji handling
        },
        _id: false // Prevents automatic ID generation for sub documents
      }
    ],
    metadata: {
      originalName: String,
      size: Number,
      duration: Number,
      thumbnail: String
    },
    deleted: {
      isDeleted: {
        type: Boolean,
        default: false
      },
      deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      deletedAt: Date
    },
    edited: {
      type: Boolean,
      default: false
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Indexes for faster queries
MessageSchema.index({ conversation: 1, createdAt: -1 }) // For fetching conversation messages
MessageSchema.index({ sender: 1 }) // For finding all messages by a user
MessageSchema.index({ 'reactions.userId': 1 }) // For reaction queries

const Message = mongoose.model<IMessage>('Message', MessageSchema)
export default Message
