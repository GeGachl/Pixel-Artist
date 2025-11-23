import UserRequests from '../../assets/functions/userRequests.js'
import { Navigate } from 'react-router'

export const handleLogin = async (loginName, loginPassword, nav) => {
  
  const userData = {
    username: loginName,
    password: loginPassword,
  }

  try {
    const res = await UserRequests.addUser(
      `${import.meta.env.VITE_API_URL}/login`,
      userData,
    )
    if (res.userId) {
      console.log(`Пользователь вошел в систему: ${res.userId}`)
      nav('/main/cPic')
    }
  } catch (error) {
    console.error(`Произошла ошибка в handleLogin, ${error.message}`)
  }
}

export const handleRegister = async (username, email, password, nav) => {
  const userData = {
    username,
    email,
    password,
  }

  try {
    const res = await UserRequests.addUser(
      `${import.meta.env.VITE_API_URL}/register`,
      userData,
    )
    nav('/main/cPic')
  } catch (error) {
    console.log(`Произошла ошибка в handleRegister, ${error.message}`)
  }
}
