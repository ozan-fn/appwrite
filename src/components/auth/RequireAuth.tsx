import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'

interface RequireAuthProps {
  children: ReactNode
  redirectTo?: string
}

export function RequireAuth({ children, redirectTo = '/' }: RequireAuthProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: redirectTo })
    }
  }, [loading, user, navigate, redirectTo])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
