"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов")
      return
    }

    setIsLoading(true)

    try {
      const success = await register(name, email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Ошибка при регистрации. Возможно, пользователь с таким email уже существует.")
      }
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при регистрации")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-md shadow-md p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Регистрация</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
              required
            />
          </div>

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
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Подтверждение пароля
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-red-700 hover:text-red-800">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}