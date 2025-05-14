import crypto from 'node:crypto'

/**
 * Generates a 6-digit OTP (One Time Password).
 * @returns {string} A 6-digit OTP.
 */
export const generateOTP = (): string => {
  try {
    // Prefer webcrypto if available (Node 15+)
    if (crypto.webcrypto) {
      const array = new Uint32Array(1)
      crypto.webcrypto.getRandomValues(array)
      const otp = ((array[0] % 900000) + 100000).toString()
      return otp.padStart(6, '0') // Ensure 6 digits
    }

    // Standard crypto approach
    return crypto.randomInt(100000, 999999).toString()
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error('Failed to generate secure OTP')
  }
}
