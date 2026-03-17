// ─── Domain Types ──────────────────────────────────────────────────────────────

export type ProductFamily = 'VALUE_FLEX' | 'STANDARD'
export type ProductType = 'VARIABLE' | 'FIXED'
export type ProductTerm =
  | '1_YEAR'
  | '2_YEAR'
  | '3_YEAR'
  | '4_YEAR'
  | '5_YEAR'
  | '6_YEAR'
  | '7_YEAR'
  | '10_YEAR'
export type InsuranceType = 'INSURED' | 'CONVENTIONAL'
export type PrepaymentOption = 'STANDARD' | 'ENHANCED'
export type RestrictionsOption =
  | 'NO_RESTRICTIONS'
  | 'SOME_RESTRICTIONS'
  | 'MORE_RESTRICTIONS'
export type HelocOption = 'HELOC_WITH' | 'HELOC_WITHOUT'
export type RateHold = '30_DAYS' | '45_DAYS' | '60_DAYS' | '90_DAYS' | '120_DAYS'

export interface Product {
  id: number
  name: string
  family: ProductFamily
  type: ProductType
  term: ProductTerm
  insurable: boolean
  insurance: InsuranceType
  prepaymentOption: PrepaymentOption
  restrictionsOption: RestrictionsOption
  restrictions: string
  fixedPenaltySpread: string
  helocOption: HelocOption
  helocDelta: number
  lenderName: string
  lenderType: string
  rateHold: RateHold
  rate: number
  ratePrimeVariance: number
  bestRate: number
  created: string
  updated: string
}

export interface Applicant {
  phone: string
  email: string
  firstName: string
  lastName: string
}

export type ApplicationType = 'NEW' | 'RENEWAL' | 'REFINANCE'

export interface Application {
  readonly id: string
  token: string
  type: ApplicationType
  applicants: Applicant[]
  productId?: number
  readonly createdAt: string
}

export interface CreateApplicationPayload {
  productId: number
}

export type UpdateApplicationPayload = Partial<Omit<Application, 'id' | 'createdAt' | 'token'>>

// ─── UI / App State Types ─────────────────────────────────────────────────────

export type Lang = 'en' | 'fr'
export type ToastType = 'success' | 'error'

export interface ToastState {
  msg: string
  type: ToastType
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

export interface ContactFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>
