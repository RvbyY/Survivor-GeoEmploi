import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from './Authcontext'

export type ReportStatus = 'pending' | 'resolved' | 'dismissed'

export type Report = {
  id: number
  offerId: number
  reason: string
  comment: string
  status: ReportStatus
}

interface ReportsContextType {
  reports: Report[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  reportOffer: (offerId: number, reason: string, comment: string) => Promise<void>
  updateReportStatus: (id: number, status: ReportStatus) => Promise<void>
  removeReport: (id: number) => Promise<void>
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

const API_URL = 'http://localhost:8080'

export function ReportsProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()

  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
  setIsLoading(true)
  setError(null)

  try {
    const response = await fetch(`${API_URL}/offer/report/get`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    })

    if (!response.ok) {
      throw new Error('Failed to load reports')
    }

    const data = await response.json()

    setReports(
      data.map((r: any) => ({
        id: r.id,
        offerId: r.offer_id ?? r.offerId,
        reason: r.reason,
        comment: r.message ?? r.comment ?? '',
        status: r.status ?? 'pending',
      }))
    )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unknown error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      refresh()
    } else {
      setReports([])
    }
  }, [token])

 const reportOffer = async (
    offerId: number,
    reason: string,
    comment: string
  ) => {
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(
      `${API_URL}/offer/report/${offerId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          report_reason: reason,
          report_message: comment,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to submit report')
    }

    await refresh()
  }

  const updateReportStatus = async (
    id: number,
    status: ReportStatus
  ) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, status }
          : report
      )
    )
  }

  const removeReport = async (id: number) => {
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(
      `${API_URL}/reports/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete report')
    }

    setReports((prev) =>
      prev.filter((report) => report.id !== id)
    )
  }

  return (
    <ReportsContext.Provider
      value={{
        reports,
        isLoading,
        error,
        refresh,
        reportOffer,
        updateReportStatus,
        removeReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports() {
  const ctx = useContext(ReportsContext)

  if (!ctx) {
    throw new Error(
      'useReports must be used within ReportsProvider'
    )
  }

  return ctx
}
