'use client'

import React, { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useParams } from 'next/navigation'
import { Locale, getTranslations } from '@/app/i18n'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  locale?: Locale
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

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} locale={this.props.locale} />
    }

    return this.props.children
  }
}

function ErrorFallback({ error, onReset, locale }: { error?: Error; onReset: () => void; locale?: Locale }) {
  const params = useParams()
  const currentLocale = locale || (params?.locale as Locale) || 'en'
  const t = getTranslations(currentLocale)

  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{t.errors.somethingWentWrong}</h2>
          <p className="text-muted-foreground">
            {t.errors.unexpectedError}
          </p>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 p-3 bg-gray-100 rounded text-left text-sm">
              <summary className="cursor-pointer font-medium">
                {t.errors.errorDetails}
              </summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {error.message}
                {'\n'}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={onReset} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t.errors.tryAgain}
          </Button>
          <Button onClick={() => window.location.reload()}>
            {t.errors.refreshPage}
          </Button>
        </div>
      </div>
    </Card>
  )
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