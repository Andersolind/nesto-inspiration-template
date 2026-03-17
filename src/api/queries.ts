import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import { queryKeys } from './queryKeys'
import type { Application, Applicant, ContactFormValues, Product } from '../types'

// ─── Products ─────────────────────────────────────────────────────────────────

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: queryKeys.products.all,
    queryFn: () => api.getProducts(),
    staleTime: 5 * 60 * 1000,
  })
}

// ─── Applications ─────────────────────────────────────────────────────────────

export function useApplications() {
  return useQuery<Application[], Error>({
    queryKey: queryKeys.applications.all,
    queryFn: () => api.getApplications(),
  })
}

export function useApplication(id: string) {
  return useQuery<Application, Error>({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => api.getApplication(id),
    enabled: Boolean(id),
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

interface CreateApplicationArgs {
  productId: number
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation<Application, Error, CreateApplicationArgs>({
    mutationFn: ({ productId }) => api.createApplication({ productId }),
    onSuccess: () => {
      // Invalidate the list so Screen 3 stays fresh
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.all })
    },
  })
}

interface UpdateApplicationArgs {
  id: string
  values: ContactFormValues
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation<Application, Error, UpdateApplicationArgs>({
    mutationFn: ({ id, values }) => {
      const applicant: Applicant = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      }
      return api.updateApplication(id, { applicants: [applicant] })
    },
    onSuccess: (updated) => {
      // Update the detail cache immediately — no extra network request needed
      queryClient.setQueryData(queryKeys.applications.detail(updated.id), updated)
      // Invalidate the list so Screen 3 reflects the change
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.all })
    },
  })
}
