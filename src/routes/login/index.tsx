import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

function LoginPage() {
  const { user, loading } = useAuth()
  const navigate = Route.useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/' })
    }
  }, [loading, user, navigate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white">
      <LoginForm />
      <Link to="/signup" className="mt-4 text-[#61dafb] hover:underline">
        Don't have an account? Signup
      </Link>
    </div>
  )
}
