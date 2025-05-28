import express from 'express'
import { getPreferences, updatePreferences } from '../../controllers/user-preferences.controller'
import { verifyAccessToken } from '../../middlewares/auth.middleware'

const router = express.Router()

router.use(verifyAccessToken) // Ensure user is authenticated
router.get('/', getPreferences)
router.put('/', updatePreferences)

export default router
