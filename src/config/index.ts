/* eslint-disable no-undef */
export default {
  jwt: {
    secret: process.env.JWT_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    expiresIn: '1h',
    refreshExpiresIn: '30d',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID as string,
    authToken: process.env.TWILIO_AUTH_TOKEN as string,
    serviceSid: process.env.TWILIO_SERVICE_SID as string,
  },
  nodeMailer: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
    service: process.env.EMAIL_SERVICE as string,
  },
}
