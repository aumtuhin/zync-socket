import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ message: 'Validation Error', errors: errors.array() })
    return // Ensure function exits after sending response
  }
  next()
}
