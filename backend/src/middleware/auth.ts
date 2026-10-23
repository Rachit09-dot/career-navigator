import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const secret = process.env.JWT_SECRET || 'careernavigator_secret_key_2024'
    const decoded = jwt.verify(token, secret) as any
    const rawUserId = decoded?.userId ?? decoded?.id ?? decoded?.sub

    if (rawUserId === undefined || rawUserId === null || String(rawUserId).trim() === '') {
      return res.status(401).json({ message: 'Invalid token: user ID missing' })
    }

    req.userId = String(rawUserId)
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
