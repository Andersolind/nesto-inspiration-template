import styles from './States.module.css'

export function Spinner() {
  return <div className={styles.spinner} aria-label="Loading" role="status" />
}

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className={styles.center}>
      <Spinner />
      {message && <p className={styles.msg}>{message}</p>}
    </div>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({ message, onRetry, retryLabel = 'Retry' }: ErrorStateProps) {
  return (
    <div className={styles.center} role="alert">
      <span className={styles.errorIcon} aria-hidden="true">⚠</span>
      {message && <p className={styles.msg}>{message}</p>}
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry} type="button">
          {retryLabel}
        </button>
      )}
    </div>
  )
}
