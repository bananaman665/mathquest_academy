'use client'

import { useState, useCallback } from 'react'
import { logger } from '@/lib/errors'

interface ErrorState {
  message: string
  code?: string
  details?: Record<string, unknown>
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleError = useCallback((err: unknown) => {
    logger.error('Error caught by useErrorHandler', err)

    if (err && typeof err === 'object') {
      if ('message' in err && typeof err.message === 'string') {
        setError({
          message: err.message,
          code: 'code' in err ? String(err.code) : undefined,
          details: err as Record<string, unknown>,
        })
        return
      }
    }

    setError({
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    })
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const executeAsync = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void
        onError?: (error: ErrorState) => void
        loadingState?: boolean
      }
    ): Promise<T | null> => {
      if (options?.loadingState !== false) {
        setIsLoading(true)
      }
      clearError()

      try {
        const result = await fn()
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        handleError(err)
        const errorState: ErrorState = {
          message:
            err && typeof err === 'object' && 'message' in err
              ? String(err.message)
              : 'An error occurred',
        }
        options?.onError?.(errorState)
        return null
      } finally {
        if (options?.loadingState !== false) {
          setIsLoading(false)
        }
      }
    },
    [handleError, clearError]
  )

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeAsync,
  }
}

// Hook for API calls with automatic error handling
export function useApiCall<T = Record<string, unknown>>() {
  const { error, isLoading, executeAsync, clearError } = useErrorHandler()

  const call = useCallback(
    async (
      url: string,
      options?: RequestInit
    ): Promise<{ data: T | null; error: ErrorState | null }> => {
      const result = await executeAsync(async () => {
        const response = await fetch(url, options)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
          )
        }

        const data = await response.json()
        return data.data || data
      })

      return {
        data: result,
        error: error,
      }
    },
    [executeAsync, error]
  )

  return {
    call,
    isLoading,
    error,
    clearError,
  }
}
