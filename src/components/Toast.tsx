import type { ToastState } from '../types'
import styles from './Toast.module.css'

type Props = ToastState

export function Toast({ msg, type }: Props) {
  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">
        {type === 'success' ? '✓' : '✕'}
      </span>
      {msg}
    </div>
  )
}
