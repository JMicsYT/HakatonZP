import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface Story {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  author: string
  date: string
  published?: boolean
  status?: string
}

interface StoryCardProps {
  story: Story
  showStatus?: boolean
}

export function StoryCard({ story, showStatus = false }: StoryCardProps) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="relative h-48 mb-4">
        <Image
          src={story.imageUrl || "/placeholder.svg?height=300&width=400"}
          alt={story.title}
          fill
          className="object-cover rounded-md"
        />
        {showStatus && story.status && (
          <div
            className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${
              story.status === "DRAFT"
                ? "bg-gray-500"
                : story.status === "PENDING_REVIEW"
                  ? "bg-yellow-500"
                  : story.status === "PUBLISHED"
                    ? "bg-green-500"
                    : story.status === "REJECTED"
                      ? "bg-red-500"
                      : ""
            }`}
          >
            {story.status === "DRAFT"
              ? "Черновик"
              : story.status === "PENDING_REVIEW"
                ? "На модерации"
                : story.status === "PUBLISHED"
                  ? "Опубликовано"
                  : story.status === "REJECTED"
                    ? "Отклонено"
                    : ""}
          </div>
        )}
        {!showStatus && story.published === false && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">Черновик</div>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{story.excerpt}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Автор: {story.author}</span>
        <span>{formatDate(story.date)}</span>
      </div>
      <Link href={`/stories/${story.id}`} className="mt-4 inline-block text-red-700 hover:text-red-800 font-medium">
        Читать полностью
      </Link>
    </div>
  )
}
