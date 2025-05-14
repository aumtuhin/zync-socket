import mongoose from 'mongoose'

export interface IOTP extends mongoose.Document {
  email?: string
  phone?: string
  otp: string
  attempts: number
  expiresAt: Date
}

const OTPSchema = new mongoose.Schema<IOTP>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    otp: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '10m' }, // Auto-delete after 10 minutes
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster lookups
OTPSchema.index({ email: 1, phone: 1 })

export default mongoose.model<IOTP>('OTP', OTPSchema)
