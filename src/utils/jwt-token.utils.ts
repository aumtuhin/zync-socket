import jwt from 'jsonwebtoken'

export const generateJwtToken = (
  userId: string,
  secret: string,
  expiresIn?: jwt.SignOptions['expiresIn'],
) => {
  return jwt.sign({ id: userId }, secret, { expiresIn })
}
