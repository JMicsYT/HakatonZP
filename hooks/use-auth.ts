"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        return false
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Registration failed")
      }

      // Login after successful registration
      return await login(email, password)
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return {
    user: session?.user || null,
    isLoading: status === "loading",
    login,
    register,
    logout,
  }
}
