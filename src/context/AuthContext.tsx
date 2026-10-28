import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../services/auth'
import { ensureCustomerNumber } from '../services/userProfile'


type AuthContextType = {
  user: User | null
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          if (currentUser.email) {
            await ensureCustomerNumber(
              currentUser.uid,
              currentUser.email,
            )
          }
        } catch (error) {
          console.error('Failed to assign customer number:', error)
        }
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}