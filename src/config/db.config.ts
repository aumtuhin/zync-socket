import mongoose from 'mongoose'
import { MONGO_URI } from './env.config'

export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MongoDB URI is not defined in the environment variables.')
    }

    // Connect to MongoDB without the deprecated options
    await mongoose.connect(MONGO_URI)

    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1) // Exit the process with a failure code
  }
}
