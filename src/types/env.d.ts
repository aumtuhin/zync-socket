declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string
      JWT_REFRESH_SECRET: string
      MONGO_URI: string
    }
  }
}

export {}
