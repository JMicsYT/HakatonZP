"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import StoryAudioPlayer from "@/components/story-audio-player"

interface Story {
  id: string
  title: string
  fullName: string
  birthDate: string | null
  deathDate: string | null
  rank: string | null
  militaryUnit: string | null
  awards: string | null
  content: string
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED"
  videoUrl: string | null
  audioUrl: string | null
  createdAt: string
  images: { id: string; url: string }[]
  author: {
    id: string
    name: string
    image: string | null
  }
  moderationComment: string | null
}

export default function ReviewStoryPage() {
  const { id } = useParams<{ id: string }>()
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [story, setStory] = useState<Story | null>(null)
  const [isLoadingStory, setIsLoadingStory] = useState(true)
  const [error, setError] = useState("")
  const [moderationComment, setModerationComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard")
      } else {
        fetchStory()
      }
    }
  }, [user, isLoading, router, id])

  const fetchStory = async () => {
    setIsLoadingStory(true)
    try {
      const response = await fetch(`/api/admin/stories/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch story")
      }
      const data = await response.json()
      setStory(data)
      setModerationComment(data.moderationComment || "")
    } catch (err) {
      console.error("Error fetching story:", err)
      setError("Не удалось загрузить историю")
    } finally {
      setIsLoadingStory(false)
    }
  }

  const handleModeration = async (approve: boolean) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/stories/${id}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approved: approve,
          moderationComment: moderationComment.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to moderate story")
      }

      router.push("/admin")
    } catch (err) {
      console.error("Error moderating story:", err)
      setError("Произошла ошибка при модерации истории")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || isLoadingStory) {
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <Link href="/admin" className="text-red-700 hover:text-red-800">
          ← Назад к панели администратора
        </Link>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>История не найдена</p>
        </div>
        <Link href="/admin" className="text-red-700 hover:text-red-800">
          ← Назад к панели администратора
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-red-700 hover:text-red-800 mb-6 inline-block">
          ← Назад к панели администратора
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Модерация истории</h1>
            <div className="text-sm text-gray-500">
              Статус:{" "}
              <span
                className={`font-medium ${
                  story.status === "PENDING_REVIEW"
                    ? "text-yellow-600"
                    : story.status === "PUBLISHED"
                      ? "text-green-600"
                      : story.status === "REJECTED"
                        ? "text-red-600"
                        : "text-gray-600"
                }`}
              >
                {story.status === "PENDING_REVIEW"
                  ? "На модерации"
                  : story.status === "PUBLISHED"
                    ? "Опубликована"
                    : story.status === "REJECTED"
                      ? "Отклонена"
                      : "Черновик"}
              </span>
            </div>
          </div>

          <article>
            <header className="mb-8">
              <h2 className="text-3xl font-bold mb-4">{story.title}</h2>
              <div className="flex flex-wrap justify-between items-center text-gray-600 text-sm">
                <div>
                  Автор: <span className="font-medium">{story.author.name}</span>
                </div>
                <div>
                  Создано: <time dateTime={story.createdAt}>{formatDate(story.createdAt)}</time>
                </div>
              </div>
            </header>

            {/* Аудиоплеер */}
            <StoryAudioPlayer storyId={story.id} storyContent={story.content} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                {story.images.length > 0 && (
                  <>
                    <div className="relative h-[300px] md:h-[400px] w-full mb-4">
                      <Image
                        src={story.images[0].url || "/placeholder.svg"}
                        alt={story.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {story.images.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {story.images.slice(1).map((image, index) => (
                          <div key={index} className="relative h-24 md:h-32">
                            <Image
                              src={image.url || "/placeholder.svg"}
                              alt={`${story.title} - фото ${index + 2}`}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-xl font-semibold mb-4">Информация</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-gray-600 text-sm">ФИО:</dt>
                    <dd className="font-medium">{story.fullName}</dd>
                  </div>

                  {(story.birthDate || story.deathDate) && (
                    <div>
                      <dt className="text-gray-600 text-sm">Годы жизни:</dt>
                      <dd className="font-medium">
                        {story.birthDate ? new Date(story.birthDate).getFullYear() : "?"} -
                        {story.deathDate ? new Date(story.deathDate).getFullYear() : "?"}
                      </dd>
                    </div>
                  )}

                  {story.rank && (
                    <div>
                      <dt className="text-gray-600 text-sm">Звание:</dt>
                      <dd className="font-medium">{story.rank}</dd>
                    </div>
                  )}

                  {story.militaryUnit && (
                    <div>
                      <dt className="text-gray-600 text-sm">Воинская часть:</dt>
                      <dd className="font-medium">{story.militaryUnit}</dd>
                    </div>
                  )}

                  {story.awards && (
                    <div>
                      <dt className="text-gray-600 text-sm">Награды:</dt>
                      <dd className="font-medium">{story.awards}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              {story.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {story.videoUrl && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Видео</h3>
                <div className="relative pt-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-md"
                    src={`https://www.youtube.com/embed/${story.videoUrl.split("v=")[1]}`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </article>
        </div>

        {story.status === "PENDING_REVIEW" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Решение модератора</h2>

            <div className="mb-4">
              <label htmlFor="moderationComment" className="block text-sm font-medium text-gray-700 mb-1">
                Комментарий модератора (необязательно)
              </label>
              <textarea
                id="moderationComment"
                value={moderationComment}
                onChange={(e) => setModerationComment(e.target.value)}
                className="form-input min-h-[100px]"
                placeholder="Укажите причину отклонения или комментарий к публикации"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleModeration(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отклонение..." : "Отклонить"}
              </button>
              <button onClick={() => handleModeration(true)} className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Публикация..." : "Опубликовать"}
              </button>
            </div>
          </div>
        )}

        {story.status !== "PENDING_REVIEW" && story.moderationComment && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Комментарий модератора</h2>
            <p className="text-gray-700">{story.moderationComment}</p>
          </div>
        )}
      </div>
    </div>
  )
}
