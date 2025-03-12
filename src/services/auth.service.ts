import jwt from 'jsonwebtoken'

export const refreshTokenService = async (refreshToken: string) => {
  const JWT_SECRET = process.env.JWT_SECRET as string
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
    const newAccessToken = jwt.sign({ id: (decoded as any).id }, JWT_SECRET, {
      expiresIn: '1h',
    })
    return newAccessToken
  } catch (error) {
    throw new Error('Invalid refresh token')
  }
}
