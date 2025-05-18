import express from 'express'
import { verifyAccessToken } from '../../middlewares/auth.middleware'
import { userProfile, completeProfile } from '../../controllers/user.controller'
import { completeProfileValidator } from '../../validators/user.validator'
import { formatValidationErrors } from '../../middlewares/error-formatter.middleware'

const router = express.Router()

router.post(
  '/complete-profile',
  verifyAccessToken,
  completeProfileValidator,
  formatValidationErrors,
  completeProfile,
)
router.get('/profile', verifyAccessToken, userProfile)

export default router
