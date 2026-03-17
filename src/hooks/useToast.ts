import { useCallback, useState } from 'react'
import type { ToastState, ToastType } from '../types'

interface UseToastReturn {
  toast: ToastState | null
  showToast: (msg: string, type?: ToastType) => void
  clearToast: () => void
}

export function useToast(duration = 3200): UseToastReturn {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback(
    (msg: string, type: ToastType = 'success') => {
      setToast({ msg, type })
      setTimeout(() => setToast(null), duration)
    },
    [duration],
  )

  const clearToast = useCallback(() => setToast(null), [])

  return { toast, showToast, clearToast }
}
