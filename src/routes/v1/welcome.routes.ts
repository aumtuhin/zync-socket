import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the API',
    api: {
      name: 'Node API Sample',
      version: '1.0.0',
      description: 'This is a sample API for demonstration purposes.'
    }
  })
})

export default router
