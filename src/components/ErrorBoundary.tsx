'use client'

import React, { Component, ReactNode } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>

              {/* Error Message */}
              <h1 className="text-3xl font-black text-white mb-3">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-300 mb-8">
                Don&apos;t worry, your progress is safe. Let&apos;s get you back on track!
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-left">
                  <p className="text-xs font-mono text-red-300 mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs font-mono text-red-300">
                      <summary className="cursor-pointer hover:text-red-200">
                        View stack trace
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap break-all">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>

                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl border-2 border-white/20 transition-all duration-300 hover:border-white/40"
                >
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </Link>

                <button
                  onClick={() => window.location.reload()}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Convenience wrapper for pages
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
