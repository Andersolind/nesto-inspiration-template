import { Link, usePageTitle } from '../router'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  usePageTitle('Page Not Found')

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <span className={styles.code} aria-hidden="true">404</span>
        <h1 className={styles.heading}>Page not found</h1>
        <p className={styles.sub}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/products" className={styles.cta}>
          Back to Products
        </Link>
      </div>
    </main>
  )
}
