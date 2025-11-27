import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { account, ID } from '@/lib/appwrite'

interface AuthContextType {
  user: any | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get()
        setUser(user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password)
    const user = await account.get()
    setUser(user)
  }

  const signup = async (email: string, password: string) => {
    await account.create(ID.unique(), email, password)
  }

  const logout = async () => {
    await account.deleteSession('current')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
