import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './FormField.module.css'

interface FormFieldProps {
  label?: string
  error?: string
  children: ReactNode
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function TextInput({ error, className = '', ...props }: TextInputProps) {
  return (
    <input
      className={`${styles.input} ${error ? styles.hasError : ''} ${className}`}
      aria-invalid={Boolean(error)}
      {...props}
    />
  )
}
