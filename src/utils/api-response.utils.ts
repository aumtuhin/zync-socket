/* eslint-disable no-undef */
import type { Response } from 'express'

export const respond = {
  success: (res: Response, data: unknown, status = 200) =>
    res.status(status).json({ success: true, data }),

  error: (res: Response, message: string, error?: unknown, status = 400) =>
    res.status(status).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : error,
    }),
}
