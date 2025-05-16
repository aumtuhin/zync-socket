import mongoose from 'mongoose'

export interface IOTPUser extends mongoose.Document {
  fullName?: string
  username?: string
  profileComplete?: boolean
  email?: string
  phone?: string
  isVerified: boolean
  createdAt: Date
}

const OTPUserSchema = new mongoose.Schema<IOTPUser>(
  {
    fullName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: '30d' }, // Auto-delete unverified after 30 days
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IOTPUser>('OTPUser', OTPUserSchema)
