import { useEffect, useState } from 'react'
import { NavLink, Outlet, useOutletContext, useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import styles from './GlobalGallery.module.css'
import { usePosts } from '../../store/postStore.js'
import { useAuth } from '../../store/authStore.js'
import { apiFetch } from '../../api/fetch.js'

export default function GlobalGallery() {
  const nav = useNavigate()
  const { posts, setPosts, clearPosts } = usePosts()
  const { access, refresh, logout, setTokens } = useAuth()
  const setData = useAuth((state) => state.setData)
  useEffect(() => {
    ;(async () => {
      // запрашиваем посты
      let res = await apiFetch('/main/globalGallery', {
        headers: { Authorization: `${access}` },
      })
      if (res.status === 401 && refresh) {
        // пробуем обновить токен
        const ref = await apiFetch('/auth/refresh', {
          method: 'POST',
          headers: { 'refresh-token': refresh },
        })
        if (ref.status === 200) {
          setTokens(ref.tokens)
          res = await apiFetch('/main/globalGallery', {
            headers: { Authorization: `${ref.tokens.access}` },
          })
        } else {
          logout()
          clearPosts()
          nav('/login')
          return
        }
      }
      if (res.status === 200) {
        const someRes = res.data.filter((el) => el.publicity)
        res.data = someRes.reverse()
        setPosts(res.data)
      } else {
        logout()
        clearPosts()
        nav('/login')
      }
    })()
  }, [access, refresh, logout, setTokens, setPosts, clearPosts, nav])

  return (
    <div className={styles['bottomContainer']}>
      <h1 className={styles['title']}></h1>
      <ul className={styles['GalleryList']}>
        {posts.map((el, i, arr) =>
          (i + 1) % 2 != 0 ? (
            <li key={el._id}>
              <div
                onClick={(e, url = el.url) => {
                  setData(null, null, null, url)
                  nav('/main/cPic')
                }}
              >
                <div
                  className={styles['imgBlock']}
                  style={{ backgroundImage: `url(${el.url})` }}
                ></div>
                <span className={styles['nameSpan']}>{el.name}</span>
                <span className={styles['usernameSpan']}>
                  {el.username ? el.username : null}
                </span>
                <span className={styles['dateSpan']}>{el.date}</span>
              </div>
              {arr[i + 1] ? (
                <div
                  onClick={(e, url = arr[i + 1].url) => {
                    setData(null, null, null, url)
                    nav('/main/cPic')
                  }}
                >
                  <div
                    className={styles['imgBlock']}
                    style={{ backgroundImage: `url(${arr[i + 1].url})` }}
                  ></div>
                  <span className={styles['nameSpan']}>{arr[i + 1].name}</span>
                  <span className={styles['usernameSpan']}>
                    {arr[i + 1].username ? arr[i + 1].username : null}
                  </span>
                  <span className={styles['dateSpan']}>{arr[i + 1].date}</span>
                </div>
              ) : null}
            </li>
          ) : null,
        )}
      </ul>
    </div>
  )
}
