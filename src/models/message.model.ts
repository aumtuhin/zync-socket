import mongoose, { type Document } from 'mongoose'

export interface IMessage extends Document {
  room: string
  author: mongoose.Types.ObjectId
  content: string
  timestamp: Date
}

const MessageSchema = new mongoose.Schema<IMessage>({
  room: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model<IMessage>('Message', MessageSchema)
