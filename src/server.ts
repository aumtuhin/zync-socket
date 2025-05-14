import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// Routes
import authRoutes from './routes/v1/auth.routes'
import userRouter from './routes/v1/user.routes'

// Middleware
// eslint-disable-next-line no-unused-vars
import { apiKeyMiddleware } from './middleware/apiKey.middleware'

// Utils & Config
import { connectDB } from './config/db.config'
// eslint-disable-next-line no-unused-vars
import { getLocalIp } from './utils/get-ip.utils'
import { corsOptions } from './config/cors.config'

dotenv.config()

const app = express()

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8000

// Middleware
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))
app.use(helmet())
app.use(morgan('dev'))

// Routes
// app.use('/api/v1', apiKeyMiddleware) // Apply to ALL /api/v1 routes
app.get('/', (req, res) => {
  res.send('Welcome to the API')
})
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRouter)

// MongoDB Connection
connectDB()

app.listen(PORT, () => {
  // eslint-disable-next-line no-undef, no-console
  console.log(`Server running at PORT ${PORT}`)
})
