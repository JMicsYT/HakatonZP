"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { StoryCard } from "@/components/story-card"
import SearchBar from "@/components/search-bar"

interface Story {
  id: string
  title: string
  content: string
  fullName: string
  createdAt: string
  images: { id: string; url: string }[]
  author: {
    id: string
    name: string
  }
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [stories, setStories] = useState<Story[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (query) {
      performSearch(1)
    } else {
      setStories([])
      setPagination({
        total: 0,
        page: 1,
        limit: 9,
        totalPages: 0,
      })
    }
  }, [query])

  const performSearch = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/stories?q=${encodeURIComponent(query)}&page=${page}&limit=9`)
      if (!response.ok) {
        throw new Error("Failed to search stories")
      }
      const data = await response.json()
      setStories(data.stories)
      setPagination(data.pagination)
    } catch (err) {
      console.error("Search error:", err)
      setError("Не удалось выполнить поиск")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    performSearch(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Поиск историй</h1>

      <div className="mb-8">
        <SearchBar />
      </div>

      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {isLoading ? "Поиск..." : `Результаты поиска по запросу: "${query}"`}
          </h2>
          <p className="text-gray-600">{!isLoading && `Найдено ${pagination.total} историй`}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p>Загрузка результатов...</p>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={{
                id: story.id,
                title: story.title,
                excerpt: story.content.substring(0, 120) + "...",
                imageUrl: story.images[0]?.url || "/placeholder.svg?height=300&width=400",
                author: story.author.name,
                date: story.createdAt,
              }}
            />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Ничего не найдено</h3>
          <p className="text-gray-600 mb-4">
            По вашему запросу не найдено ни одной истории. Попробуйте изменить параметры поиска.
          </p>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Введите поисковый запрос</h3>
          <p className="text-gray-600 mb-4">
            Вы можете искать по имени участника войны, званию, наградам или содержанию истории.
          </p>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Предыдущая
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                  pagination.page === page ? "text-red-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Следующая
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
