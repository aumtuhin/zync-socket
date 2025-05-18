import { createClient } from 'redis'
import config from '../config'

const client = createClient({
  username: config.redis.username,
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: Number(config.redis.port)
  }
})

client.on('error', (err) => console.error('Redis Client Error', err))

const connectRedis = async () => {
  await client.connect()
}
connectRedis()

export default {
  get: async (key: string) => {
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  },
  set: async (key: string, value: unknown, ttl?: number) => {
    await client.set(key, JSON.stringify(value))
    if (ttl) await client.expire(key, ttl)
  },
  del: async (key: string) => {
    await client.del(key)
  }
}
