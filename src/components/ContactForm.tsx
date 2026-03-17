import { useState } from 'react'
import { FormField, TextInput } from './FormField'
import { validateContactForm } from '../api/helpers'
import type { ContactFormErrors, ContactFormValues } from '../types'
import styles from './ContactForm.module.css'

interface ContactFormTranslations {
  firstName: string
  lastName: string
  email: string
  phone: string
  required: string
  invalidEmail: string
  invalidPhone: string
  invalidName?: string
}

interface Props {
  initialValues?: Partial<ContactFormValues>
  onSubmit: (values: ContactFormValues) => Promise<void>
  submitLabel: string
  submittingLabel: string
  t: ContactFormTranslations
}

const EMPTY_FORM: ContactFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

export function ContactForm({
  initialValues = {},
  onSubmit,
  submitLabel,
  submittingLabel,
  t,
}: Props) {
  const [form, setForm] = useState<ContactFormValues>({
    ...EMPTY_FORM,
    ...initialValues,
  })
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)

  const messages = {
    required: t.required,
    invalidEmail: t.invalidEmail,
    invalidPhone: t.invalidPhone,
    invalidName: t.invalidName,
  }

  /** Validate a single field in isolation. */
  function validateField(field: keyof ContactFormValues, value: string): string | undefined {
    const snapshot = { ...form, [field]: value }
    const allErrors = validateContactForm(snapshot, messages)
    return allErrors[field]
  }

  function handleChange(field: keyof ContactFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
      // Re-validate on change only after the field has been touched
      if (touched[field]) {
        const err = validateField(field, value)
        setErrors((prev) => ({ ...prev, [field]: err }))
      }
    }
  }

  function handleBlur(field: keyof ContactFormValues) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      const err = validateField(field, form[field])
      setErrors((prev) => ({ ...prev, [field]: err }))
    }
  }

  async function handleSubmit() {
    // Mark all fields as touched so errors show everywhere
    setTouched({ firstName: true, lastName: true, email: true, phone: true })

    const validation = validateContactForm(form, messages)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <FormField label={t.firstName} error={errors.firstName}>
          <TextInput
            value={form.firstName}
            onChange={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            placeholder="Jean"
            error={errors.firstName}
            autoComplete="given-name"
          />
        </FormField>

        <FormField label={t.lastName} error={errors.lastName}>
          <TextInput
            value={form.lastName}
            onChange={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            placeholder="Tremblay"
            error={errors.lastName}
            autoComplete="family-name"
          />
        </FormField>
      </div>

      <FormField label={t.email} error={errors.email}>
        <TextInput
          value={form.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          placeholder="jean@example.com"
          type="email"
          error={errors.email}
          autoComplete="email"
        />
      </FormField>

      <FormField label={t.phone} error={errors.phone}>
        <TextInput
          value={form.phone}
          onChange={handleChange('phone')}
          onBlur={handleBlur('phone')}
          placeholder="+1 (514) 000-0000"
          type="tel"
          error={errors.phone}
          autoComplete="tel"
        />
      </FormField>

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={submitting}
        type="button"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </div>
  )
}
