import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import MainLayout from './layouts/MainLayout/MainLayout.jsx'
import LoadLayout from './layouts/LoadLayout/LoadLayout.jsx'
import GlobalGallery from './pages/GlobalGallery/GlobalGallery.jsx'
import PersonalGallery from './pages/PersonalGallery/PersonalGallery.jsx'
import Paint from './pages/Paint/Paint.jsx'
import Login from './layouts/Login/Login.jsx'
import Register from './layouts/Login/Register.jsx'
import About from './pages/About/About.jsx'
import './style.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoadLayout />,
  },
  {
    path: '/main',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/main/globalGallery',
        element: <GlobalGallery />,
      },
      {
        path: '/main/personalGallery',
        element: <PersonalGallery />,
      },
      {
        path: '/main/cPic',
        element: <Paint />,
      },
      {
        path: '/main/about',
        element: <About />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
