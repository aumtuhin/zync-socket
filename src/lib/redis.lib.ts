import { createClient } from 'redis'
import config from '../config'

export const redisClient = createClient({
  username: config.redis.username,
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: Number(config.redis.port)
  }
})

export const redisPub = redisClient.duplicate()
export const redisSub = redisClient.duplicate()

redisClient.on('error', (err) => console.error('Redis error:', err))
redisClient.on('connect', () => console.log('Redis connected'))

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect()
    await redisPub.connect()
    await redisSub.connect()
  }
}
