import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET as string

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body

    // Check if username already exists
    if (await User.findOne({ username })) {
      res.status(400).json({ message: 'Username already in use' })
      return // Ensure to return after response
    }

    // Check if email already exists
    if (await User.findOne({ email })) {
      res.status(400).json({ message: 'Email already in use' })
      return
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedPassword })

    await user.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' })
      return // Ensure to return after response
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
