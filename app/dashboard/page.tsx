"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Plus, Edit, Trash2 } from "lucide-react"
import { StoryCard } from "@/components/story-card"

interface Story {
  id: string
  title: string
  content: string
  fullName: string
  published: boolean
  status: string
  createdAt: string
  images: { id: string; url: string }[]
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchUserStories()
    }
  }, [user])

  const fetchUserStories = async () => {
    setIsLoadingStories(true)
    try {
      const response = await fetch("/api/user/stories")
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

  const handleDeleteStory = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту историю?")) {
      return
    }

    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete story")
      }

      // Remove the deleted story from the state
      setStories((prevStories) => prevStories.filter((story) => story.id !== id))
    } catch (err) {
      console.error("Error deleting story:", err)
      setError("Не удалось удалить историю")
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

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Личный кабинет</h1>
          <p className="text-gray-600">Добро пожаловать, {user.name}</p>
        </div>
        <Link href="/dashboard/create-story" className="btn-primary flex items-center mt-4 md:mt-0">
          <Plus size={18} className="mr-2" />
          Добавить историю
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Мои истории</h2>

        {isLoadingStories ? (
          <div className="text-center py-8">
            <p>Загрузка историй...</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div key={story.id} className="relative">
                <StoryCard
                  story={{
                    id: story.id,
                    title: story.title,
                    excerpt: story.content.substring(0, 120) + "...",
                    imageUrl: story.images[0]?.url || "/placeholder.svg?height=300&width=400",
                    author: user.name || "",
                    date: story.createdAt,
                    published: story.published,
                    status: story.status,
                  }}
                  showStatus={true}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Link
                    href={`/dashboard/edit-story/${story.id}`}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    aria-label="Редактировать"
                  >
                    <Edit size={16} className="text-gray-700" />
                  </Link>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    aria-label="Удалить"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">У вас пока нет добавленных историй</p>
            <Link href="/dashboard/create-story" className="btn-primary">
              Добавить первую историю
            </Link>
          </div>
        )}
      </div>

      {user.role === "ADMIN" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Панель администратора</h2>
          <p className="text-gray-600 mb-4">
            У вас есть права администратора. Вы можете модерировать истории пользователей.
          </p>
          <Link href="/admin" className="btn-primary">
            Перейти в панель администратора
          </Link>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Настройки профиля</h2>
        <Link href="/dashboard/profile" className="text-red-700 hover:text-red-800">
          Редактировать профиль
        </Link>
      </div>
    </div>
  )
}
