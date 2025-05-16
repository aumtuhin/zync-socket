/* eslint-disable no-undef */
/* eslint-disable no-console */
import { createClient } from 'redis'
import config from '../config'

const redisClient = createClient({
  url: config.redis.uri,
})

redisClient.on('error', (err) => console.error('Redis Client Error', err))

const connectRedis = async () => {
  await redisClient.connect()
}
connectRedis()

export default {
  get: async (key: string) => {
    const data = await redisClient.get(key)
    return data ? JSON.parse(data) : null
  },
  set: async (key: string, value: unknown, ttl?: number) => {
    await redisClient.set(key, JSON.stringify(value))
    if (ttl) await redisClient.expire(key, ttl)
  },
  del: async (key: string) => {
    await redisClient.del(key)
  },
}
