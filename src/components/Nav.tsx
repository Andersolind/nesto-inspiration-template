import { NESTO_LOGO } from '../assets'
import { Link, usePathname } from '../router'
import type { Lang } from '../types'
import type { Translations } from '../i18n/translations'
import styles from './Nav.module.css'

interface Props {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

export function Nav({ lang, setLang, t }: Props) {
  const pathname = usePathname()

  const productsActive = pathname.startsWith('/products') || pathname.startsWith('/contact')
  const appsActive = pathname.startsWith('/applications')

  return (
    <nav className={styles.nav}>
      <Link to="/products" className={styles.logoBtn} aria-label="Go to home">
        <img src={NESTO_LOGO} alt="nesto" className={styles.logoImg} />
      </Link>

      <div className={styles.right}>
        <Link
          to="/products"
          className={`${styles.navLink} ${productsActive ? styles.active : ''}`}
          aria-current={productsActive ? 'page' : undefined}
        >
          {t.nav.products}
        </Link>
        <Link
          to="/applications"
          className={`${styles.navLink} ${appsActive ? styles.active : ''}`}
          aria-current={appsActive ? 'page' : undefined}
        >
          {t.nav.applications}
        </Link>
        <button
          className={styles.langBtn}
          onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
          aria-label="Toggle language"
          type="button"
        >
          {t.langToggle}
        </button>
      </div>
    </nav>
  )
}
