import type {
  Application,
  CreateApplicationPayload,
  Product,
  UpdateApplicationPayload,
} from '../types'

const BASE_URL = 'https://nesto-fe-exam.vercel.app/api'

const DEFAULT_HEADERS: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-nesto-candidat': 'Anders Lind',
}

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, `API ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export const api = {
  getProducts(): Promise<Product[]> {
    return request<Product[]>('/products')
  },

  createApplication(payload: CreateApplicationPayload): Promise<Application> {
    return request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getApplications(): Promise<Application[]> {
    return request<Application[]>('/applications')
  },

  getApplication(id: string): Promise<Application> {
    return request<Application>(`/applications/${id}`)
  },

  updateApplication(id: string, data: UpdateApplicationPayload): Promise<Application> {
    return request<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}
