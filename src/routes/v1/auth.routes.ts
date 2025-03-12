import express from 'express'
import { register, login } from '../../controllers/auth.controller'
import {
  loginValidator,
  registerValidator,
} from '../../validators/auth.validator'
import { handleValidation } from '../../middleware/validation.middleware'

const router = express.Router()

router.post('/register', registerValidator, handleValidation, register)
router.post('/login', loginValidator, handleValidation, login)

export default router
