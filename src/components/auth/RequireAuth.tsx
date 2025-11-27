import { useEffect, ReactNode } from 'react'
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
```

To use it in your protected route, update `protected/index.tsx` like this:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/RequireAuth'

export const Route = createFileRoute('/protected/')({
  component: Protected,
})

function Protected() {
  return (
    <RequireAuth>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Protected Page</h1>
        <p>Welcome! This page is only accessible to logged-in users.</p>
      </div>
    </RequireAuth>
  )
}
```

This keeps the logic centralized, makes it reusable, and follows React best practices for component composition. You can customize the `redirectTo` prop if needed.
