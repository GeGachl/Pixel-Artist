import { useEffect, useState } from 'react'
import { useNavigate, NavLink, Outlet, useOutletContext } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import LoginInput from '../../components/LoginInput/LoginInput.jsx'
import { FaEye } from 'react-icons/fa6'
import { FaEyeSlash } from 'react-icons/fa'
import styles from './Login.module.css'
import UserRequests from '../../assets/functions/userRequests.js'
import { apiFetch } from '../../api/fetch.js'

import { handleRegister } from './SendRequestFuncs.js'
import {
  isCyrillic,
  isValidEmail,
  togglePasswordVisibility,
  ShowToolTip,
  handleChange,
  handleChange2,
  handleChange3,
  checkNumberAndLang,
  checkNumberAndLang2,
  checkNumberAndLang3,
} from './CheckCorrectFunc.js'

function Register() {
  const [isPasswordVisible, setIsPasswordVisible] = useState([
    false,
    false,
    false,
  ])
  const [username, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repPassword, setRepPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await apiFetch('/register', {
      method: 'POST',
      body: { username, email, password },
    })
    if (res.status === 201) nav('/login')
    else {
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
      <div className={styles['login-container']}>
        <h1 style={{ marginBottom: '25px', fontSize: '40px' }}>Register</h1>
        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>{error}</h3>
        <div className={styles['input-container']}>
          <LoginInput
            type="text"
            placeholder="Nickname"
            value={username}
            onChange={(event) => handleChange(event, setName)}
          />
          <div className={styles['tooltip']} style={{ display: 'none' }}>
            Пожалуйста, используйте английские буквы!
          </div>
        </div>
        <div className={styles['input-container']}>
          <LoginInput
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => handleChange2(event, setEmail)}
          />
          <div className={styles['tooltip']} style={{ display: 'none' }}>
            Пожалуйста, введите корректный email!
          </div>
        </div>
        <div className={styles['input-container']}>
          <div className={`${styles['container-for-eye']} password-I`}>
            <LoginInput
              type={isPasswordVisible[0] ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(event) => checkNumberAndLang(event, setPassword)}
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
        <div className={styles['input-container']}>
          <div className={`${styles['container-for-eye']} password-I`}>
            <LoginInput
              type={isPasswordVisible[1] ? 'text' : 'password'}
              placeholder="Repeat password"
              value={repPassword}
              onChange={(event) => checkNumberAndLang2(event, setRepPassword)}
            />
            {isPasswordVisible[1] ? (
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
        <button className={styles['btn']} onClick={(e) => submit(e)}>
          Sign Up
        </button>
        <div className={styles['RedirectContainer']}>
          <span className={styles['Redirect']}>Already have an account? </span>
          <NavLink to={'/login'}>Sign In</NavLink>
        </div>
      </div>
      )}
    </div>
  )
}

export default Register
