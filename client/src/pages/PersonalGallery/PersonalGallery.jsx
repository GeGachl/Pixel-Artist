import styles from './PersonalGallery.module.css'
import { usePosts } from '../../store/postStore.js'
import { useAuth } from '../../store/authStore.js'
import { apiFetch } from '../../api/fetch.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { FaRegTrashAlt } from 'react-icons/fa'
export default function PersonalGallery() {
  const nav = useNavigate()
  const { posts, setPosts, clearPosts } = usePosts()
  const { access, refresh, userid, logout, setTokens, setData } = useAuth()
  const [yourGalleryPosts, setGalleryPosts] = useState([])
  const deletePost = async (url, id) => {
    const deleteData = async (url, id) => {
      const res = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      })
    }
    try {
      return await deleteData(url, id)
    } catch (error) {
      console.error(`Произошла ошибка в deleteData, ${error.message}`)
    }
  }
  useEffect(() => {
    ;(async () => {
      // запрашиваем посты
      let res = await apiFetch('/main/personalGallery', {
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
          res = await apiFetch('/main/personalGallery', {
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
        const someRes = res.data.filter((el) => el.userId === userid)
        res.data = someRes.reverse()
        setPosts(res.data)
        setGalleryPosts(res.data)
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
        {yourGalleryPosts.map((el, i, arr) =>
          (i + 1) % 2 != 0 ? (
            <li key={el._id}>
              <div>
                <div
                  className={styles['imgBlock']}
                  style={{
                    backgroundImage: `url(${el.url})`,
                    cursor: 'pointer',
                  }}
                  onClick={(e, url = el.url) => {
                    setData(null, null, null, url)
                    nav('/main/cPic')
                  }}
                ></div>
                <span className={styles['nameSpan']}>{el.name}</span>
                <div className={styles['bottomBlockContainer']}>
                  <span className={styles['dateSpan']}>{el.date}</span>
                  <FaRegTrashAlt
                    className={styles['DeleteIcon']}
                    onClick={(e, id = el._id, index = i) => {
                      deletePost(`${process.env.VITE_API_URL}/main/cPic`, id)
                      yourGalleryPosts.splice(index, 1)
                      setGalleryPosts(yourGalleryPosts)
                      setPosts(yourGalleryPosts)
                    }}
                  />
                </div>
              </div>
              {arr[i + 1] ? (
                <div>
                  <div
                    className={styles['imgBlock']}
                    style={{
                      backgroundImage: `url(${arr[i + 1].url})`,
                      cursor: 'pointer',
                    }}
                    onClick={(e, url = el.url) => {
                      setData(null, null, null, url)
                      nav('/main/cPic')
                    }}
                  ></div>
                  <span className={styles['nameSpan']}>{arr[i + 1].name}</span>
                  <div className={styles['bottomBlockContainer']}>
                    <span className={styles['dateSpan']}>
                      {arr[i + 1].date}
                    </span>
                    <FaRegTrashAlt
                      className={styles['DeleteIcon']}
                      onClick={(e, id = arr[i + 1]._id, index = i + 1) => {
                        deletePost(`${process.env.VITE_API_URL}/main/cPic`, id)
                        yourGalleryPosts.splice(index, 1)
                        setGalleryPosts([...yourGalleryPosts])
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </li>
          ) : null,
        )}
      </ul>
    </div>
  )
}
