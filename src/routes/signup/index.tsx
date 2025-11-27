import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SignupForm } from '@/components/auth/SignupForm'

export const Route = createFileRoute('/signup/')({
  component: SignupPage,
})

function SignupPage() {
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
      <SignupForm />
      <Link to="/login" className="mt-4 text-[#61dafb] hover:underline">
        Already have an account? Login
      </Link>
    </div>
  )
}
