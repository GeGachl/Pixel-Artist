import { useEffect, useState } from 'react'
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import styles from './MainLayout.module.css'
import UserRequests from '../../assets/functions/userRequests'
import { apiFetch } from '../../api/fetch'
import { useAuth } from '../../store/authStore'

function MainLayout() {
  const { username, userid, useremail, logout } = useAuth()
  const [CMopen, SetOpen] = useState('none')
  const [name, setName] = useState(username)
  const [email, setEmail] = useState(useremail)
  const [showProfile, setShowProfile] = useState(false)
  const [id, setId] = useState(userid)
  const PixelArr =
    ', , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,'


  const ShowProfileClick = () => {
    setShowProfile(!showProfile)
  }

  const DuoFunctions = () => {
    logout
    ShowProfileClick()
  }

  return (
    <div className={styles['wrapper']}>
      <div className={styles['topMenu']}>
        <div className={styles['PixelFilter']}>
          <div className={styles['topPixels']}>
            {PixelArr.split('').map((el) => (
              <div></div>
            ))}
          </div>
          <div className={styles['bottomPixels']}>
            {PixelArr.split('').map((el) => (
              <div></div>
            ))}
          </div>
        </div>
        <div className={styles['LeftPart']}>
          <NavLink to="/main/cPic" id={styles['create']} className={styles['Link']}>
            Create
          </NavLink>
          <NavLink to="/main/personalGallery" id={styles['yourGallery']} className={styles['Link']}>
            Your Gallery
          </NavLink>
          <NavLink to="/main/about" id={styles['about']} className={styles['Link']}>
            About
          </NavLink>
          <NavLink to="/main/globalGallery" id={styles['globalGallery']} className={styles['Link']}>
            Global Gallery
          </NavLink>
        </div>
        <div className={styles['RightPart']}>
          {id ? (
            <>
              <span className={styles['Name']}>{name}</span>
              <div
                onClick={ShowProfileClick}
                className={styles['profile']}
              ></div>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <Outlet />
      {showProfile ? (
        <div className={styles['profileMenu']}>
          <div className={styles['profileMenu2']}>
            name: <span className={styles['profileName']}>{name}</span>
            email: <span className={styles['profileEmail']}>{email}</span>
            <NavLink to={'/'} onClick={logout} className={styles['logout']}>
              Logout
            </NavLink>
          </div>
          <div className={styles['profileMenu1']}>
            <div className={styles['profilelogo']}></div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
export default MainLayout
