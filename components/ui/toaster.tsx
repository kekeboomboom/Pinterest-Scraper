'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

interface ToasterProps {
  toasts?: Toast[]
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}

export function Toaster({ toasts = [] }: ToasterProps) {
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>([])

  useEffect(() => {
    setVisibleToasts(toasts)
  }, [toasts])

  const removeToast = (id: string) => {
    setVisibleToasts(prev => prev.filter(toast => toast.id !== id))
  }

  if (visibleToasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleToasts.map((toast) => {
        const Icon = toastIcons[toast.type]
        return (
          <div
            key={toast.id}
            className={`
              max-w-sm w-full border rounded-lg p-4 shadow-lg backdrop-blur-sm
              ${toastStyles[toast.type]}
              animate-slide-up
            `}
          >
            <div className="flex items-start">
              <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium">{toast.title}</h3>
                {toast.message && (
                  <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}