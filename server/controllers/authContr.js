import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../model/User/user.js'

dotenv.config()
const isCyrillic = (text) => /[а-яА-ЯЁё]/.test(text)
const isValidEmail = (email) =>
  /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i.test(email)
const { ACCESS_SECRET, REFRESH_SECRET, ACCESS_EXPIRES, REFRESH_EXPIRES } =
  process.env

function signTokens(userId) {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "1d",
  })
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "7d",
  })
  return { accessToken, refreshToken }
}

export async function register(req, res) {
  const { username, email, password } = req.body
  const anotherUser = await User.findOne({ username })
  const anotherEmail = await User.findOne({ email })
  if (!username) {
    return res.status(401).json({ message: 'Имя не может быть пустым' })
  } else if (username.length < 3) {
    return res
      .status(401)
      .json({ message: 'Имя должно содержать более трех символов' })
  } else if (isCyrillic(username)) {
    return res
      .status(401)
      .json({ message: 'Имя должно быть написано на английском языке' })
  } else if (anotherUser) {
    return res
      .status(401)
      .json({ message: 'Пользователь с таким именем уже существует' })
  }

  if (!password) {
    return res.status(401).json({ message: 'Пароль не может быть пустым' })
  } else if (password.length < 6) {
    return res
      .status(401)
      .json({ message: 'Пароль должен содержать не менее 6 символов' })
  }

  if (!isValidEmail(email)) {
    return res.status(401).json({ message: 'Почта введена некорректно' })
  } else if (anotherEmail) {
    return res
      .status(401)
      .json({ message: 'Пользователь с такой почтой уже существует' })
  }

  try {
    const user = await User.create({ username, email, password })
    const { _, refreshToken } = signTokens(user._id)
    user.refreshToken = refreshToken
    await user.save()
    res.status(201).json({ msg: 'Пользователь успешно зарегестрирован' })
  } catch (error) {
    res.status(404).json({
      message: 'Ошибка при сохранении пользователя',
      error: error.message,
    })
  }
}

export async function login(req, res) {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) {
    return res
      .status(401)
      .json({ message: 'Пользователь с таким именем не найден' })
  }
  if (!(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Введён неверный пароль' })
  }

  const { accessToken, refreshToken } = signTokens(user._id)
  user.refreshToken = refreshToken
  res.setHeader('refresh-token', refreshToken)
  res.setHeader('id', user._id)
  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .set('Authorization', `Bearer ${accessToken}`)
    .status(200)
    .json({
      message: 'Пользователь успешно авторизован',
      userId: user._id,
      username: user.username,
      useremail: user.email,
    })
}

export const check = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ authenticated: false })
  try {
    jwt.verify(token, process.env.ACCESS_SECRET)
    res.status(200).json({ authenticated: true })
  } catch {
    res.status(401).json({ authenticated: false })
  }
}

export const refresh = async (req, res) => {
  const token = req.headers['refresh-token']
  if (!token) return res.status(401).json({ msg: 'No refresh token' })
  try {
    const user = jwt.verify(token, process.env.REFRESH_SECRET)
    const { accessToken, refreshToken } = signTokens(user.userId)
    res.setHeader('access-token', accessToken)
    res.setHeader('refresh-token', refreshToken)
    res.json({ status: 200, msg: 'Tokens refreshed' })
  } catch {
    res.status(401).json({ msg: 'Invalid refresh token' })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await User.find()
    res.status(200).json(user)
  } catch (error) {
    res
      .status(404)
      .json({ message: 'Пользователь не найден', error: error.message })
  }
}
