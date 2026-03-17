import { useApplication, useApplications, useUpdateApplication } from '../api/queries'
import { isCompleteApplication, formatDate } from '../api/helpers'
import { ContactForm } from '../components/ContactForm'
import { LoadingState, ErrorState } from '../components/States'
import { Toast } from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { Link, useParams, usePageTitle } from '../router'
import type { Application, ContactFormValues } from '../types'
import type { ScreenThreeTranslations, ScreenTwoTranslations } from '../i18n/translations'
import styles from './ApplicationsPage.module.css'


interface AppListItemProps {
  app: Application
  t: ScreenThreeTranslations
}

function AppListItem({ app, t }: AppListItemProps) {
  const applicant = app.applicants[0]
  return (
    <Link to={`/applications/${app.id}`} className={styles.appItem}>
      <div className={styles.appItemInfo}>
        <span className={styles.appName}>
          {applicant.firstName} {applicant.lastName}
        </span>
        <span className={styles.appMeta}>
          <span>{applicant.email}</span>
          <span className={styles.dot}>·</span>
          <span>{applicant.phone}</span>
          <span className={styles.dot}>·</span>
          <span>{t.createdAt}: {formatDate(app.createdAt)}</span>
        </span>
      </div>
      <span className={styles.appArrow} aria-hidden="true">→</span>
    </Link>
  )
}

interface DetailPanelProps {
  appId: string
  t: ScreenThreeTranslations
  s2t: ScreenTwoTranslations
}

function DetailPanel({ appId, t, s2t }: DetailPanelProps) {
  const { toast, showToast } = useToast()
  const { data: app, isLoading } = useApplication(appId)
  const updateApplication = useUpdateApplication()

  async function handleUpdate(values: ContactFormValues) {
    try {
      await updateApplication.mutateAsync({ id: appId, values })
      showToast(t.updatedMsg, 'success')
    } catch {
      showToast(t.errorMsg, 'error')
      throw new Error('update failed')
    }
  }

  if (isLoading || !app) return <LoadingState />

  const applicant = app.applicants[0] ?? {}
  const complete = isCompleteApplication(app)

  return (
    <div className={styles.detail}>
      <Link to="/applications" className={styles.backBtn}>
        {t.backBtn}
      </Link>

      <div className={styles.detailGrid}>
        <div className={styles.formCard}>
          <h2 className={styles.detailName}>
            {applicant.firstName} {applicant.lastName}
          </h2>
          <p className={styles.detailId}>
            {s2t.applicationId}: {app.id}
          </p>

          <ContactForm
            key={appId}
            initialValues={applicant}
            onSubmit={handleUpdate}
            submitLabel={t.updateBtn}
            submittingLabel={t.updating}
            t={s2t}
          />
        </div>

        <aside className={styles.detailSidebar}>
          <h3 className={styles.sidebarTitle}>{t.applicationType}</h3>
          <div className={styles.appType}>{app.type}</div>

          <ul className={styles.sidebarRows}>
            <li className={styles.sidebarRow}>
              <span className={styles.k}>{t.createdAt}</span>
              <span className={styles.v}>{formatDate(app.createdAt)}</span>
            </li>
            {app.productId !== undefined && (
              <li className={styles.sidebarRow}>
                <span className={styles.k}>{t.productId}</span>
                <span className={styles.v}>{app.productId}</span>
              </li>
            )}
            <li className={styles.sidebarRow}>
              <span className={styles.k}>{t.status}</span>
              <span
                className={`${styles.v} ${
                  complete ? styles.statusComplete : styles.statusIncomplete
                }`}
              >
                {complete ? t.complete : t.incomplete}
              </span>
            </li>
          </ul>
        </aside>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

interface Props {
  t: ScreenThreeTranslations
  s2t: ScreenTwoTranslations
}

export function ApplicationsPage({ t, s2t }: Props) {
  const { applicationId } = useParams<{ applicationId?: string }>()
  usePageTitle(t.heading)

  const { data: allApps = [], isLoading, isError, refetch } = useApplications()
  const completeApps = allApps.filter(isCompleteApplication)

  if (applicationId) {
    return (
      <main className={styles.page}>
        <DetailPanel appId={applicationId} t={t} s2t={s2t} />
      </main>
    )
  }

  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <h1 className={styles.heroHeading}>{t.heading}</h1>
        <p className={styles.heroSub}>{t.subheading}</p>
      </header>

      <main className={styles.page}>
        <div className={styles.listHeader}>
          <span className={styles.count}>
            {!isLoading && !isError && completeApps.length > 0
              ? `${completeApps.length} application${completeApps.length > 1 ? 's' : ''}`
              : ''}
          </span>
          <Link to="/products" className={styles.secondaryBtn}>
            {t.backBtn}
          </Link>
        </div>

        {isLoading && <LoadingState />}
        {isError && <ErrorState message="Could not load applications." onRetry={() => void refetch()} />}

        {!isLoading && !isError && completeApps.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">📋</span>
            <p>{t.empty}</p>
            <Link to="/products" className={styles.ctaBtn}>
              {t.browseRates}
            </Link>
          </div>
        )}

        {!isLoading && !isError && completeApps.length > 0 && (
          <ul className={styles.list}>
            {completeApps.map((app) => (
              <li key={app.id}>
                <AppListItem app={app} t={t} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
