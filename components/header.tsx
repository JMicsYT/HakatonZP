"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path ? "text-red-700 font-medium" : "text-gray-700 hover:text-red-700"
  }

  const isNearVictoryDay = () => {
    const today = new Date()
    const victoryDay = new Date(today.getFullYear(), 4, 9) // 9 мая
    const diffTime = victoryDay.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  }

  return (
    <header className="bg-white shadow-md">
      {isNearVictoryDay() && (
        <div className="bg-victory-red text-white text-center py-2 px-4">
          <span className="font-medium">С наступающим Днём Победы! Помним и гордимся!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-victory-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold">КП</span>
            </div>
            <span className="text-xl font-bold text-victory-black">Книга Памяти</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={isActive("/")}>Главная</Link>
            <Link href="/stories" className={isActive("/stories")}>Истории</Link>
            <Link href="/search" className={isActive("/search")}>Поиск</Link>
            <Link href="/about" className={isActive("/about")}>О проекте</Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-red-700">
                  <User size={20} />
                  <span>Личный кабинет</span>
                </Link>
                <button onClick={logout} className="text-gray-700 hover:text-red-700">Выйти</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-red-700">Войти</Link>
                <Link href="/register" className="btn-primary">Регистрация</Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className={isActive("/")} onClick={closeMenu}>Главная</Link>
            <Link href="/stories" className={isActive("/stories")} onClick={closeMenu}>Истории</Link>
            <Link href="/search" className={isActive("/search")} onClick={closeMenu}>Поиск</Link>
            <Link href="/about" className={isActive("/about")} onClick={closeMenu}>О проекте</Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-700"
                  onClick={closeMenu}
                >
                  <User size={20} />
                  <span>Личный кабинет</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                  className="text-gray-700 hover:text-red-700 text-left"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-red-700" onClick={closeMenu}>Войти</Link>
                <Link href="/register" className="btn-primary inline-block" onClick={closeMenu}>Регистрация</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
