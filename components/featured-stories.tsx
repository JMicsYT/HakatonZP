"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { StoryCard } from "./story-card"

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

export default function FeaturedStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchFeaturedStories()
  }, [])

  const fetchFeaturedStories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stories?limit=3")
      if (!response.ok) {
        throw new Error("Failed to fetch featured stories")
      }
      const data = await response.json()
      setStories(data.stories)
    } catch (err) {
      console.error("Error fetching featured stories:", err)
      setError("Не удалось загрузить избранные истории")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Загрузка историй...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-auto max-w-lg" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg mx-auto max-w-lg">
        <h3 className="text-xl font-medium mb-2">Историй пока нет</h3>
        <p className="text-gray-600 mb-4">
          Будьте первым, кто опубликует историю о своем родственнике – участнике войны.
        </p>
        <Link href="/dashboard/create-story" className="btn-primary">
          Добавить историю
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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

      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center mt-6">
        <Link href="/stories" className="btn-secondary">
          Смотреть все истории
        </Link>
      </div>
    </div>
  )
}