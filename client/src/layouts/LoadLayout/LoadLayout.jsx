import { NavLink } from 'react-router'
import styles from './LoadLayout.module.css'
import { Analytics } from "@vercel/analytics/react";
export default function LoadLayout() {
  return (
    <div className={styles['container']}>
      <h1 className={styles['title']}>Pixel Artist</h1>
      <div className={styles['grid']}>
        <NavLink
          className={styles['sections']}
          id={styles['create']}
          to={'/main/cPic'}
        >
          Create <span>🎨</span>
        </NavLink>
        <NavLink
          className={styles['sections']}
          id={styles['yourGallery']}
          to={'/main/personalGallery'}
        >
          Your Gallery <span>🖼️</span>
        </NavLink>
        <NavLink
          className={styles['sections']}
          id={styles['globalGallery']}
          to={'/main/globalGallery'}
        >
          All Gallery <span>🌐</span>
        </NavLink>
      </div>
      <Analytics />
    </div>
  )
}
