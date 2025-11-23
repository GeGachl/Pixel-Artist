import { useEffect, useState } from 'react'
import { useNavigate, NavLink, Outlet, useOutletContext } from 'react-router'
import LoginInput from '../../components/LoginInput/LoginInput.jsx'
import { FaEye } from 'react-icons/fa6'
import { FaEyeSlash } from 'react-icons/fa'
import styles from './Login.module.css'
import UserRequests from '../../assets/functions/userRequests.js'
import { apiFetch } from '../../api/fetch.js'
import { useAuth } from '../../store/authStore.js'

import { handleLogin } from './SendRequestFuncs.js'
import {
  togglePasswordVisibility,
  handleChange3,
  checkNumberAndLang3,
} from './CheckCorrectFunc.js'

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState([
    false,
    false,
    false,
  ])
  const [loginName, setLoginName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const setTokens = useAuth((state) => state.setTokens)

  const setData = useAuth((state) => state.setData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await apiFetch('/login', {
      method: 'POST',
      body: { username: loginName, password: loginPassword },
    })

    if (res.status === 200) {
      setTokens(res.tokens)
      setData(res.data.username, res.data.userId, res.data.useremail)
      nav('/main/cPic')
    } else {
      setError(res.data.message)
    }
    setLoading(false)
  }

  return (
    <div className={styles['container']}>
      <div className={styles['FormImage']}>
        <div></div>
      </div>
      {loading ? (<div className={styles['loading']}>Loading...</div>)
      :(
      <div className={styles['enter-container']}>
        <h1 style={{ marginBottom: '25px', fontSize: '40px' }}>Login</h1>
        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>{error}</h3>
        <div className={styles['input-container']}>
          <LoginInput
            type="text"
            placeholder="Nickname"
            value={loginName}
            onChange={(event) => handleChange3(event, setLoginName)}
          />
          <div className={styles['tooltip']} style={{ display: 'none' }}>
            Пожалуйста, используйте английские буквы!
          </div>
        </div>
        <div className={styles['input-container']}>
          <div className={`${styles['container-for-eye']} password-I`}>
            <LoginInput
              type={isPasswordVisible[0] ? 'text' : 'password'}
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => checkNumberAndLang3(event, setLoginPassword)}
            />
            {isPasswordVisible[0] ? (
              <FaEye
                className={styles['eye']}
                onClick={(event) =>
                  togglePasswordVisibility(
                    event,
                    isPasswordVisible,
                    setIsPasswordVisible,
                  )
                }
              />
            ) : (
              <FaEyeSlash
                className={styles['eye']}
                onClick={(event) =>
                  togglePasswordVisibility(
                    event,
                    isPasswordVisible,
                    setIsPasswordVisible,
                  )
                }
              />
            )}
            <div className={styles['tooltip']} style={{ display: 'none' }}>
              Слишком короткий пароль или неверный язык
            </div>
          </div>
        </div>
        <button className={styles['btnLogin']} onClick={(e) => submit(e)}>
          Sign In
        </button>
        <div className={styles['RedirectContainer']}>
          <span className={styles['Redirect']}>
            Don't have an account yet?{' '}
          </span>
          <NavLink to={'/register'}>Create an account</NavLink>
        </div>
      </div>
      )}
    </div>
  )
}

export default Login
