// did not get cookie option in params to make it consistent everywhere

export const cookieOptionsForRefreshToken = {
  httpOnly: true,
  secure: false, // Use `false` in development
  maxAge: 30 * 24 * 60 * 60 * 1000, // Set cookie expiration date (7 days)
}
