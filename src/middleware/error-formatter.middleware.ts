import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { respond } from '../utils/api-response.utils'

export const formatValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    respond.validationError(res, errors)
    return
  }
  next()
}
