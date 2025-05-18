import express from 'express'
import { register, login, refreshToken } from '../../controllers/auth.controller'
import { loginValidator, registerValidator } from '../../validators/auth.validator'
import { formatValidationErrors } from '../../middlewares/error-formatter.middleware'

const router = express.Router()

router.post('/register', registerValidator, formatValidationErrors, register)
router.post('/login', loginValidator, formatValidationErrors, login)
router.post('/refresh-token', refreshToken)

export default router
