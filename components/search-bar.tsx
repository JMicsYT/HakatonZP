"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Поиск по имени, месту службы, наградам..."
            className="form-input pl-10 pr-4 py-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button type="submit" className="btn-primary ml-2">
          Найти
        </button>
      </form>
    </div>
  )
}
