'use client'

import React, { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Bir şeyler yanlış gitti</h2>
              <p className="text-muted-foreground">
                Beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-gray-100 rounded text-left text-sm">
                  <summary className="cursor-pointer font-medium">
                    Hata Detayları (Geliştirme Modu)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </Button>
              <Button onClick={() => window.location.reload()}>
                Sayfayı Yenile
              </Button>
            </div>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
}

export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = () => setError(null)

  const captureError = (error: Error) => {
    setError(error)
  }

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}