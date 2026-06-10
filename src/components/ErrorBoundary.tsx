import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="font-display font-bold text-xl mb-2">Something went wrong.</p>
          <p className="font-body text-sm text-[#888] mb-6">Please refresh the page to continue.</p>
          <button
            onClick={() => window.location.reload()}
            className="font-body text-sm font-medium underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
