/* eslint-disable no-undef */
import fs from 'node:fs'
import { resolve } from 'node:path'
import nodemailer from 'nodemailer'
import handlebars from 'handlebars'
import twilio from 'twilio'

import config from '../config'
import { generateOTP } from '../utils/otp-generator.utils'
import OTP from '../models/OTP'
import OTPUser, { type IOTPUser } from '../models/OTP-User'

interface SendEmailOTPResponse {
  email: string
  otp: string
  expiresAt: Date
}

export const sendEmailOTPService = async (email: string): Promise<SendEmailOTPResponse> => {
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

  await OTP.deleteMany({ email })
  await OTP.create({ email, otp, expiresAt })

  const templatePath = resolve(process.cwd(), 'src/templates/otp-email.hbs')
  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = handlebars.compile(templateSource)

  const html = template({
    otp: otp,
    expiry: 10,
  })

  const transporter = nodemailer.createTransport({
    service: config.nodeMailer.service,
    auth: {
      user: config.nodeMailer.user,
      pass: config.nodeMailer.pass,
    },
  })

  const mailOptions = {
    from: `"OTP Service" <${config.nodeMailer.user}>`,
    to: email,
    subject: 'Your One-Time Password (OTP)',
    html: html,
  }
  await transporter.sendMail(mailOptions)
  return { email, otp, expiresAt }
}

export const verifyEmailOTPService = async (email: string, otp: string): Promise<IOTPUser> => {
  const otpRecord = await OTP.findOne({
    email,
    otp,
  })
  if (!otpRecord) throw new Error('Invalid OTP')

  if (otpRecord.attempts >= 3)
    throw new Error('Maximum attempts reached. Please request a new OTP.')

  const now = new Date()
  const expiryWithBuffer = new Date(otpRecord.expiresAt.getTime() - 30000)

  if (expiryWithBuffer < now) throw new Error('OTP expired. Please request a new OTP.')

  await OTP.updateOne({ email, otp }, { $inc: { attempts: 1 } })

  const otpUser = await OTPUser.findOneAndUpdate(
    { email },
    { isVerified: true },
    { upsert: true, new: true },
  )
  // Delete OTP record after successful verification
  await OTP.deleteOne({ email, otp })

  return otpUser
}

export const sendSmsOTPService = async (phone: string): Promise<boolean> => {
  const client = twilio(config.twilio.accountSid, config.twilio.authToken)
  const otpRes = await client.verify.v2
    .services(config.twilio.serviceSid)
    .verifications.create({ to: phone, channel: 'sms' })

  return otpRes.status === 'pending'
}
