"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Неверный email или пароль")
      }
    } catch (err) {
      setError("Произошла ошибка при входе")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-md shadow-md p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Вход в аккаунт</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
              required
            />
          </div>

          <div className="flex items-center justify-end mb-1">
            <Link href="/forgot-password" className="text-sm text-red-700 hover:text-red-800">
              Забыли пароль?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? "Войти..." : "Войти"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-red-700 hover:text-red-800">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}