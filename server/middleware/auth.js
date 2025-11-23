import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

export default function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ msg: 'No token' })
  try {
    const user = jwt.verify(token, process.env.ACCESS_SECRET)
    req.user = user
    next()
  } catch {
    return res.status(401).json({ msg: 'Invalid token' })
  }
}
