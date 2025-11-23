import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import routes from './routes.js'

dotenv.config()
const app = express()

function sanitizeMongoUri(uri = '') {
  if (!uri) return ''
  try {
    const url = new URL(uri)
    url.searchParams.delete('directConnection')
    return url.toString()
  } catch (error) {
    console.warn('Failed to parse MONGO_URI, using original value', error.message)
    return uri
  }
}

const mongoUri = sanitizeMongoUri(process.env.MONGO_URI)
app.use(
  cors({
    origin: [
      'https://pixel-artist-ozx2oy81d-germans-projects-b3e68c9c.vercel.app',
      'https://pixel-artist-gm63.onrender.com', // ваш backend для самопроверки
      'http://localhost:5173',
      // ← добавьте сюда все frontend-домены, с которых вы тестируете
    ],
    credentials: true,
    exposedHeaders: ['Authorization', 'refresh-token', 'userid', 'username'],
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use(routes)

mongoose.connect(mongoUri).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on PORT: ${process.env.PORT}`)
  })
})
