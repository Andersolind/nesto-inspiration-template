import { Component, type ErrorInfo, type ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: ReactNode
  /** Optional custom fallback — receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you'd forward this to an observability service (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    const { children, fallback } = this.props

    if (error) {
      if (fallback) return fallback(error, this.reset)

      return (
        <main className={styles.page}>
          <div className={styles.content}>
            <span className={styles.icon} aria-hidden="true">⚠</span>
            <h1 className={styles.heading}>Something went wrong</h1>
            <p className={styles.sub}>
              An unexpected error occurred. You can try recovering or reload the page.
            </p>
            <div className={styles.actions}>
              <button className={styles.primary} onClick={this.reset} type="button">
                Try again
              </button>
              <button
                className={styles.secondary}
                onClick={() => window.location.reload()}
                type="button"
              >
                Reload page
              </button>
            </div>
            {import.meta.env.DEV && (
              <details className={styles.details}>
                <summary>Error details</summary>
                <pre className={styles.stack}>{error.stack}</pre>
              </details>
            )}
          </div>
        </main>
      )
    }

    return children
  }
}
