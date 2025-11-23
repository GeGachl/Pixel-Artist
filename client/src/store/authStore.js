import { create } from 'zustand'

export const useAuth = create((set) => ({
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  username: localStorage.getItem('username'),
  userid: localStorage.getItem('userid'),
  useremail: localStorage.getItem('useremail'),
  canvasUrl: localStorage.getItem('canvasUrl'),
  setTokens: ({ access, refresh }) => {
    if (access) localStorage.setItem('access', access)
    if (refresh) localStorage.setItem('refresh', refresh)
    set({ access, refresh })
  },
  setData: (username, userid, useremail, canvasUrl) => {
    if (username) localStorage.setItem('username', username)
    if (userid) localStorage.setItem('userid', userid)
    if (useremail) localStorage.setItem('useremail', useremail)
    if (canvasUrl) localStorage.setItem('canvasUrl', canvasUrl)
    set({ username, userid, useremail })
  },
  logout: () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('username')
    localStorage.removeItem('userid')
    localStorage.removeItem('useremail')
    localStorage.removeItem('canvasUrl')
    set({
      access: null,
      refresh: null,
      username: null,
      userid: null,
      useremail: null,
    })
  },
}))
