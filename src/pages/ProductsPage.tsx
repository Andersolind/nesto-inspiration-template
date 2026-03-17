import { useCreateApplication, useProducts } from '../api/queries'
import { getBestProducts, formatRate, TERM_LABELS } from '../api/helpers'
import { LoadingState, ErrorState } from '../components/States'
import { Toast } from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { useNavigate, usePageTitle } from '../router'
import type { Product } from '../types'
import type { ScreenOneTranslations } from '../i18n/translations'
import styles from './ProductsPage.module.css'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  disabled: boolean
  t: ScreenOneTranslations
}

function ProductCard({ product, onSelect, disabled, t }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.lender}>{product.lenderName}</span>
        <span
          className={`${styles.insuranceBadge} ${
            product.insurance === 'INSURED' ? styles.insured : styles.conventional
          }`}
        >
          {product.insurance === 'INSURED' ? t.insured : t.conventional}
        </span>
      </div>

      <div className={styles.rate}>{formatRate(product.bestRate)}</div>
      <div className={styles.rateLabel}>{t.bestRate}</div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t.term}</span>
          <span className={styles.metaValue}>{TERM_LABELS[product.term] ?? product.term}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t.lender}</span>
          <span className={styles.metaValue}>{product.lenderType}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t.family}</span>
          <span className={styles.metaValue}>
            {product.family === 'VALUE_FLEX' ? t.valueFlexFamily : t.standardFamily}
          </span>
        </div>
      </div>

      <button
        className={styles.selectBtn}
        onClick={() => onSelect(product)}
        disabled={disabled}
        type="button"
      >
        {t.selectBtn}
        <span className={styles.arrow} aria-hidden="true">→</span>
      </button>
    </article>
  )
}

interface ProductColumnProps {
  title: string
  products: Product[]
  isVariable: boolean
  onSelect: (p: Product) => void
  disabled: boolean
  t: ScreenOneTranslations
}

function ProductColumn({ title, products, isVariable, onSelect, disabled, t }: ProductColumnProps) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <h2 className={styles.columnTitle}>{title}</h2>
        <span className={`${styles.typeBadge} ${isVariable ? styles.variable : styles.fixed}`}>
          {isVariable ? 'Variable' : 'Fixed'}
        </span>
      </div>

      {products.length === 0 ? (
        <p className={styles.noProducts}>No products available.</p>
      ) : (
        products.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={onSelect} disabled={disabled} t={t} />
        ))
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

interface Props {
  t: ScreenOneTranslations
}

export function ProductsPage({ t }: Props) {
  const { toast, showToast } = useToast()
  const navigate = useNavigate()
  usePageTitle(t.heading)

  const { data: products = [], isLoading, isError, refetch } = useProducts()
  const createApplication = useCreateApplication()

  async function handleSelect(product: Product) {
    try {
      const application = await createApplication.mutateAsync({ productId: product.id })
      navigate(`/contact/${application.id}/${product.id}`)
    } catch {
      showToast(t.error, 'error')
    }
  }

  const variable = getBestProducts(products, 'VARIABLE')
  const fixed = getBestProducts(products, 'FIXED')
  const selecting = createApplication.isPending

  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <span className={styles.heroTag}>{t.heroTag}</span>
        <h1 className={styles.heroHeading}>{t.heading}</h1>
        <p className={styles.heroSub}>{t.subheading}</p>
      </header>

      <main className={styles.page}>
        {isLoading && <LoadingState message={t.loading} />}

        {isError && (
          <ErrorState message={t.error} onRetry={() => void refetch()} retryLabel={t.retry} />
        )}

        {!isLoading && !isError && (
          <div className={styles.grid}>
            <ProductColumn
              title={t.variable}
              products={variable}
              isVariable={true}
              onSelect={handleSelect}
              disabled={selecting}
              t={t}
            />
            <ProductColumn
              title={t.fixed}
              products={fixed}
              isVariable={false}
              onSelect={handleSelect}
              disabled={selecting}
              t={t}
            />
          </div>
        )}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  )
}
