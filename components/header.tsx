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

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-red-700">
            Помним
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={isActive("/")}>
              Главная
            </Link>
            <Link href="/stories" className={isActive("/stories")}>
              Истории
            </Link>
            <Link href="/search" className={isActive("/search")}>
              Поиск
            </Link>
            <Link href="/about" className={isActive("/about")}>
              О проекте
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-red-700">
                  <User size={20} />
                  <span>Личный кабинет</span>
                </Link>
                <button onClick={logout} className="text-gray-700 hover:text-red-700">
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-red-700">
                  Войти
                </Link>
                <Link href="/register" className="btn-primary">
                  Регистрация
                </Link>
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
            <Link href="/" className={isActive("/")} onClick={closeMenu}>
              Главная
            </Link>
            <Link href="/stories" className={isActive("/stories")} onClick={closeMenu}>
              Истории
            </Link>
            <Link href="/search" className={isActive("/search")} onClick={closeMenu}>
              Поиск
            </Link>
            <Link href="/about" className={isActive("/about")} onClick={closeMenu}>
              О проекте
            </Link>

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
                <Link href="/login" className="text-gray-700 hover:text-red-700" onClick={closeMenu}>
                  Войти
                </Link>
                <Link href="/register" className="btn-primary inline-block" onClick={closeMenu}>
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
