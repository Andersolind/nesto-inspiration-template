import { useApplication, useProducts, useUpdateApplication } from '../api/queries'
import { formatRate, TERM_LABELS } from '../api/helpers'
import { ContactForm } from '../components/ContactForm'
import { LoadingState, ErrorState } from '../components/States'
import { Toast } from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { useParams, useNavigate, usePageTitle } from '../router'
import type { ContactFormValues } from '../types'
import type { ScreenOneTranslations, ScreenTwoTranslations } from '../i18n/translations'
import styles from './ContactPage.module.css'


interface StepIndicatorProps {
  t: ScreenTwoTranslations
}

function StepIndicator({ t }: StepIndicatorProps) {
  return (
    <div className={styles.steps} aria-label="Progress steps">
      <div className={styles.step}>
        <div className={`${styles.circle} ${styles.done}`}>✓</div>
        <span className={`${styles.stepLabel} ${styles.doneLabel}`}>{t.stepSelect}</span>
      </div>
      <div className={`${styles.line} ${styles.doneLine}`} />
      <div className={styles.step}>
        <div className={`${styles.circle} ${styles.current}`}>2</div>
        <span className={`${styles.stepLabel} ${styles.currentLabel}`}>{t.stepContact}</span>
      </div>
      <div className={styles.line} />
      <div className={styles.step}>
        <div className={styles.circle}>3</div>
        <span className={styles.stepLabel}>{t.stepReview}</span>
      </div>
    </div>
  )
}


interface Props {
  t: ScreenTwoTranslations
  s1t: ScreenOneTranslations
}

export function ContactPage({ t, s1t }: Props) {
  const { applicationId, productId } = useParams<{ applicationId: string; productId: string }>()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()
  usePageTitle(t.heading)

  const { data: application, isLoading: loadingApp, isError: errorApp } = useApplication(applicationId)
  const { data: products = [], isLoading: loadingProducts, isError: errorProducts } = useProducts()

  const updateApplication = useUpdateApplication()

  const product = products.find((p) => String(p.id) === productId)

  async function handleSubmit(values: ContactFormValues) {
    try {
      await updateApplication.mutateAsync({ id: applicationId, values })
      showToast(t.savedMsg, 'success')
      setTimeout(() => navigate('/applications'), 1500)
    } catch {
      showToast(t.errorMsg, 'error')
      throw new Error('save failed')
    }
  }

  const isLoading = loadingApp || loadingProducts
  const isError = errorApp || errorProducts

  if (isLoading) {
    return (
      <main className={styles.page}>
        <LoadingState />
      </main>
    )
  }

  if (isError || !application || !product) {
    return (
      <main className={styles.page}>
        <ErrorState
          message={t.errorMsg}
          onRetry={() => navigate('/products')}
          retryLabel={s1t.retry}
        />
      </main>
    )
  }

  const initialApplicant = application.applicants[0]

  return (
    <>
      <header className={styles.hero}>
        <StepIndicator t={t} />
        <h1 className={styles.heading}>{t.heading}</h1>
        <p className={styles.sub}>{t.subheading}</p>
      </header>

      <main className={styles.page}>
        <div className={styles.layout}>
          <div className={styles.formCard}>
            <ContactForm
              initialValues={initialApplicant}
              onSubmit={handleSubmit}
              submitLabel={t.saveBtn}
              submittingLabel={t.saving}
              t={t}
            />
          </div>

          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>{t.product}</h3>
            <div className={styles.sidebarRate}>{formatRate(product.bestRate)}</div>
            <div className={styles.sidebarRateLabel}>{t.rate}</div>

            <ul className={styles.sidebarDetails}>
              {[
                { k: 'Type',         v: product.type },
                { k: s1t.term,       v: TERM_LABELS[product.term] ?? product.term },
                { k: s1t.lender,     v: product.lenderName },
                { k: s1t.insurance,  v: product.insurance },
                { k: 'App ID',       v: `${applicationId.slice(0, 8)}…` },
              ].map(({ k, v }) => (
                <li key={k} className={styles.sidebarRow}>
                  <span className={styles.k}>{k}</span>
                  <span className={styles.v}>{v}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  )
}
