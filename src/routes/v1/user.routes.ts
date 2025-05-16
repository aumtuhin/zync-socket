import express from 'express'
import { verifyAccessToken } from '../../middleware/auth.middleware'
import { userProfile, completeProfile } from '../../controllers/user.controller'
import { completeProfileValidator } from '../../validators/user.validator'
import { formatValidationErrors } from '../../middleware/errorFormatter.middleware'

const router = express.Router()

router.post(
  '/complete-profile',
  completeProfileValidator,
  verifyAccessToken,
  formatValidationErrors,
  completeProfile,
)
router.get('/profile', verifyAccessToken, userProfile)

export default router
