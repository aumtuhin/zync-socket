import mongoose from 'mongoose'
import config from '../config'

export const connectDB = async () => {
  try {
    if (!config.mongo.uri) {
      throw new Error('MongoDB URI is not defined in the environment variables.')
    }

    // Connect to MongoDB without the deprecated options
    await mongoose.connect(config.mongo.uri)
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1) // Exit the process with a failure code
  }
}
