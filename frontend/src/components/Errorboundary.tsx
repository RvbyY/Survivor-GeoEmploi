// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react'
import ServerError from '../pages/Servererror'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Uncaught error:', error)
  }

  render() {
    if (this.state.hasError) {
      return <ServerError />
    }
    return this.props.children
  }
}