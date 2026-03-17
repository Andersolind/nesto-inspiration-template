
export const queryKeys = {
  products: {
    all: ['products'] as const,
  },
  applications: {
    all: ['applications'] as const,
    detail: (id: string) => ['applications', id] as const,
  },
} as const
