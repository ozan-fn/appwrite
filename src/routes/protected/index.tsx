import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/protected/')({
  component: Protected,
})

function Protected() {
  const { user, loading } = useAuth()
  const navigate = Route.useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/' })
    }
  }, [loading, user, navigate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Protected Page</h1>
      <p>Welcome, {user.email}!</p>
      <p>This page is only accessible to logged-in users.</p>
    </div>
  )
}
