"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface Story {
  id: string
  title: string
  fullName: string
  content: string
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED"
  createdAt: string
  author: {
    id: string
    name: string
  }
}

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"pending" | "published" | "rejected">("pending")

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard")
      } else {
        fetchStories()
      }
    }
  }, [user, isLoading, router, activeTab])

  const fetchStories = async () => {
    setIsLoadingStories(true)
    try {
      let status = "PENDING_REVIEW"
      if (activeTab === "published") status = "PUBLISHED"
      if (activeTab === "rejected") status = "REJECTED"

      const response = await fetch(`/api/admin/stories?status=${status}`)
      if (!response.ok) {
        throw new Error("Failed to fetch stories")
      }
      const data = await response.json()
      setStories(data.stories)
    } catch (err) {
      console.error("Error fetching stories:", err)
      setError("Не удалось загрузить истории")
    } finally {
      setIsLoadingStories(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              На модерации
            </button>
            <button
              onClick={() => setActiveTab("published")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "published"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Опубликованные
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "rejected"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Отклоненные
            </button>
          </nav>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoadingStories ? (
          <div className="text-center py-8">
            <p>Загрузка историй...</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Название
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Автор
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Дата создания
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stories.map((story) => (
                  <tr key={story.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{story.title}</div>
                      <div className="text-sm text-gray-500">{story.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{story.author.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(story.createdAt).toLocaleDateString("ru-RU")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/admin/review/${story.id}`} className="text-red-700 hover:text-red-800 mr-4">
                        {activeTab === "pending" ? "Модерировать" : "Просмотреть"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === "pending"
                ? "Нет историй на модерации"
                : activeTab === "published"
                  ? "Нет опубликованных историй"
                  : "Нет отклоненных историй"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
