import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { connectDB } from './config/db.config'

import authRoutes from './routes/v1/auth.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

// Routes
app.use('/api/v1/auth', authRoutes)

// MongoDB Connection
connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
