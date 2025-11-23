import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { apiFetch } from '../../api/fetch'
import { useAuth } from '../../store/authStore.js'

export default function ProtectedRoute({ children }) {
  const { access, refresh, logout, setTokens } = useAuth()
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  useEffect(() => {
    ;(async () => {
      if (!access) return setLoading(false)
      setLoading(true)
      const res = await apiFetch('/check-auth', {
        headers: { Authorization: `${access}` },
      })
      if (res.data.authenticated) {
        setAuthed(true)
      } else if (refresh) {
        const ref = await apiFetch('/refresh', {
          method: 'POST',
          headers: { 'refresh-token': refresh },
        })
        if (ref.status === 200) {
          setTokens(ref.tokens)
          setAuthed(true)
        }
      }
      setLoading(false)
    })()
  }, [access, refresh, setTokens])

  if (loading) return <div>Loading...</div>
  return authed ? children : <Navigate to="/register" replace />
}
