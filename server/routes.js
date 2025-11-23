import express from 'express'
import {
  check,
  login,
  register,
  refresh,
  getUser,
} from './controllers/authContr.js'
import authenticate from './middleware/auth.js'
import { addPost, getAll, deletePost } from './controllers/postController.js'

const router = express.Router()
router.get('/check-auth', check)
router.get('/user', getUser)
router.post('/login', login)
router.post('/register', register)
router.post('/refresh', refresh)

router.post('/main/cPic', authenticate, addPost)
router.delete('/main/cPic/:id', deletePost)
router.get('/main/personalGallery', getAll)
router.get('/main/globalGallery', getAll)

router.get('/main', authenticate, (req, res) => {
  res.json({ userId: req.userId })
})

export default router
