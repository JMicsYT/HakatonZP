"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
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
  videoUrl: string | null
  audioUrl: string | null
  createdAt: string
  images: { id: string; url: string }[]
  author: {
    id: string
    name: string
    image: string | null
  }
}

export default function StoryPage() {
  const { id } = useParams<{ id: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (id) {
      fetchStory()
    }
  }, [id])

  const fetchStory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/stories/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch story")
      }
      const data = await response.json()
      setStory(data)
    } catch (err) {
      console.error("Error fetching story:", err)
      setError("Не удалось загрузить историю")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Загрузка истории...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <Link href="/stories" className="text-red-700 hover:text-red-800">
          ← Назад к историям
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
        <Link href="/stories" className="text-red-700 hover:text-red-800">
          ← Назад к историям
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/stories" className="text-red-700 hover:text-red-800 mb-6 inline-block">
          ← Назад к историям
        </Link>

        <article className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{story.title}</h1>
            <div className="flex flex-wrap justify-between items-center text-gray-600 text-sm">
              <div>
                Автор: <span className="font-medium">{story.author.name}</span>
              </div>
              <div>
                Опубликовано: <time dateTime={story.createdAt}>{formatDate(story.createdAt)}</time>
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
              <h2 className="text-xl font-semibold mb-4">Информация</h2>
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
              <h2 className="text-xl font-semibold mb-4">Видео</h2>
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

          <footer className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex justify-between items-center">
              <div className="text-gray-600 text-sm">
                Поделиться этой историей:
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="text-red-700 hover:text-red-800">
                    ВКонтакте
                  </a>
                  <a href="#" className="text-red-700 hover:text-red-800">
                    Одноклассники
                  </a>
                  <a href="#" className="text-red-700 hover:text-red-800">
                    Telegram
                  </a>
                </div>
              </div>

              <Link href="/stories" className="btn-secondary">
                Все истории
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}
