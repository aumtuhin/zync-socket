import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { createServer } from 'node:http'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// Routes
import authRoutes from './routes/v1/auth.routes'
import userRouter from './routes/v1/user.routes'
import preferencesRoutes from './routes/v1/preferences.routes'
import otpRoutes from './routes/v1/otp.routes'
import contactRoutes from './routes/v1/contact.routes'
import chatRoutes from './routes/v1/chat.routes'
import messageRoute from './routes/v1/message.routes'

// Middlewares & Configs && libs
import { connectDB } from './db'
import config from './config'
import { corsOptions } from './config/cors.config'
import { initSocket } from './sockets'
import { socketHandler } from './sockets/socket.handler'
import { connectRedis } from './lib/redis.lib'

const app = express()
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

// Connect to MongoDB and Redis
connectDB()
connectRedis()

// initialize socket.io
const server = createServer(app)
const io = initSocket(server)
io.on('connection', (socket) => socketHandler(io, socket))

// API Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API')
})
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRouter)
app.use('/api/vi/preferences', preferencesRoutes)
app.use('/api/v1/otp', otpRoutes)
app.use('/api/v1/user/contacts', contactRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/messages', messageRoute)

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})
