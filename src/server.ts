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
import otpRoutes from './routes/v1/otp.routes'
import contactRoutes from './routes/v1/contact.routes'
import chatRoutes from './routes/v1/chat.routes'

// Middlewares & Configs
import { connectDB } from './config/db.config'
import config from './config'
import { corsOptions } from './config/cors.config'
import { initSocket } from './sockets'
import { socketHandler } from './sockets/socket.handler'

const app = express()
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

// MongoDB Connection
connectDB()

const server = createServer(app)
const io = initSocket(server)
io.on('connection', (socket) => socketHandler(io, socket))

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/otp', otpRoutes)
app.use('/api/v1/user/contacts', contactRoutes)
app.use('/api/v1/chat', chatRoutes)

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})
