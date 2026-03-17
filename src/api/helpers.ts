import type { Application, ContactFormErrors, ContactFormValues, Product, ProductTerm, ProductType } from '../types'

export const TERM_LABELS: Record<ProductTerm, string> = {
  '1_YEAR': '1 yr',
  '2_YEAR': '2 yr',
  '3_YEAR': '3 yr',
  '4_YEAR': '4 yr',
  '5_YEAR': '5 yr',
  '6_YEAR': '6 yr',
  '7_YEAR': '7 yr',
  '10_YEAR': '10 yr',
}

/** Returns all products of a given type that share the lowest bestRate. */
export function getBestProducts(products: Product[], type: ProductType): Product[] {
  const filtered = products.filter((p) => p.type === type)
  if (!filtered.length) return []
  const minRate = Math.min(...filtered.map((p) => p.bestRate))
  return filtered.filter((p) => p.bestRate === minRate)
}

/** Formats a decimal rate as a percentage string. e.g. 0.0489 → "4.89%" */
export function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`
}

/** Formats an ISO date string into a short, human-readable date. */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Returns true when an application has all four required contact fields. */
export function isCompleteApplication(app: Application): boolean {
  const a = app.applicants?.[0]
  return Boolean(a?.firstName && a?.lastName && a?.email && a?.phone)
}

interface ValidateOptions {
  required: string
  invalidEmail: string
  invalidPhone: string
  invalidName?: string
}

/** Validates the contact form. Returns a map of field → error message. */
export function validateContactForm(
  form: ContactFormValues,
  messages: ValidateOptions,
): ContactFormErrors {
  const errors: ContactFormErrors = {}

  // ── Name fields ────────────────────────────────────────────────────────────
  // Must be present, not purely whitespace, no digits, at least 2 characters
  const nameRe = /^[^\d]{2,}$/
  if (!form.firstName.trim()) {
    errors.firstName = messages.required
  } else if (!nameRe.test(form.firstName.trim())) {
    errors.firstName = messages.invalidName ?? 'Please enter a valid first name.'
  }

  if (!form.lastName.trim()) {
    errors.lastName = messages.required
  } else if (!nameRe.test(form.lastName.trim())) {
    errors.lastName = messages.invalidName ?? 'Please enter a valid last name.'
  }

  // ── Email ──────────────────────────────────────────────────────────────────
  // RFC-5321-lite: local@domain.tld, local part ≤ 64 chars, no consecutive dots
  const emailRe = /^(?!.*\.\.)[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/
  if (!form.email.trim()) {
    errors.email = messages.required
  } else if (!emailRe.test(form.email.trim())) {
    errors.email = messages.invalidEmail
  }

  // ── Phone ──────────────────────────────────────────────────────────────────
  // Strip all formatting; require 7–15 digits (ITU-T E.164 bounds)
  const digits = form.phone.replace(/[\s\-()+.]/g, '')
  if (!form.phone.trim()) {
    errors.phone = messages.required
  } else if (!/^\d+$/.test(digits) || digits.length < 7 || digits.length > 15) {
    errors.phone = messages.invalidPhone
  }

  return errors
}
