import type jwt from 'jsonwebtoken'

export default {
  port: process.env.PORT || 8000,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    expiresIn: '1h' as jwt.SignOptions['expiresIn'],
    refreshExpiresIn: '30d' as jwt.SignOptions['expiresIn']
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID as string,
    authToken: process.env.TWILIO_AUTH_TOKEN as string,
    serviceSid: process.env.TWILIO_SERVICE_SID as string
  },
  nodeMailer: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
    service: process.env.EMAIL_SERVICE as string
  },
  mongo: {
    uri: process.env.MONGO_URI as string
  },
  redis: {
    uri: process.env.REDIS_URL as string,
    host: process.env.REDIS_HOST as string,
    username: process.env.REDIS_USERNAME as string,
    password: process.env.REDIS_PASSWORD as string,
    port: process.env.REDIS_PORT as string
  },
  socket: {
    clientUrl: process.env.SOCKET_CLIENT_URL as string
  }
}
