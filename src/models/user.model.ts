import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  fullName?: string
  username?: string
  isProfileCompleted?: boolean
  email?: string
  phone?: string
  password?: string
  isVerified: boolean
  avatar?: string
  createdAt: Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true
    },
    isProfileCompleted: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      select: false
    },
    avatar: {
      type: String,
      default: `https://api.dicebear.com/7.x/bottts/svg?seed=random-${Math.random()}`
    },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: '30d' } // Auto-delete unverified after 30 days
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IUser>('User', UserSchema)
