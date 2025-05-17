import type { Response } from 'express'

export const respond = {
  success: (res: Response, data: unknown, status = 200) =>
    res.status(status).json({ success: true, data }),

  error: (res: Response, message: string, status = 400) =>
    res.status(status).json({
      success: false,
      message,
    }),

  validationError: (res: Response, errors: { array(): unknown[] }) =>
    res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array(),
    }),
}
