import express from 'express'
import { addContact, getContacts } from '../../controllers/contact.controller'
import { verifyAccessToken } from '../../middlewares/auth.middleware'
import { addContactValidator } from '../../validators/contact.validator'
import { formatValidationErrors } from '../../middlewares/error-formatter.middleware'

const router = express.Router()

router.get('/', verifyAccessToken, getContacts)
router.post(
  '/add-contact',
  verifyAccessToken,
  addContactValidator,
  formatValidationErrors,
  addContact,
)

export default router
