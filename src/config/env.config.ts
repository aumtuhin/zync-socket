import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Export the necessary environment variables
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
export const MONGO_URI = process.env.MONGO_URI
