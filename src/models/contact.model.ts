import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['accepted', 'blocked'],
      default: 'accepted'
    },
    nickname: String,
    isFavorite: {
      type: Boolean,
      default: false
    },
    labels: [String],
    lastInteraction: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  },
  { timestamps: true }
)

// Compound index for unique contact pairs
ContactSchema.index({ user: 1, recipient: 1 }, { unique: true })

// Index for faster status queries
ContactSchema.index({ status: 1 })

export default mongoose.model('Contact', ContactSchema)
