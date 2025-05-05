"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Upload, X, Plus } from "lucide-react"

interface Image {
  id: string
  url: string
}

export default function EditStoryPage() {
  const { id } = useParams<{ id: string }>()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    birthDate: "",
    deathDate: "",
    rank: "",
    militaryUnit: "",
    awards: "",
    content: "",
  })

  const [existingImages, setExistingImages] = useState<Image[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (id && user) {
      fetchStory()
    }
  }, [id, user])

  const fetchStory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/stories/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch story")
      }
      const story = await response.json()

      // Check if user is the author
      if (story.authorId !== user?.id) {
        router.push("/dashboard")
        return
      }

      setFormData({
        title: story.title,
        fullName: story.fullName,
        birthDate: story.birthDate ? new Date(story.birthDate).toISOString().split("T")[0] : "",
        deathDate: story.deathDate ? new Date(story.deathDate).toISOString().split("T")[0] : "",
        rank: story.rank || "",
        militaryUnit: story.militaryUnit || "",
        awards: story.awards || "",
        content: story.content,
      })
      setExistingImages(story.images)
      setVideoUrl(story.videoUrl || "")
      setIsPublished(story.published)
    } catch (err) {
      console.error("Error fetching story:", err)
      setError("Не удалось загрузить историю")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files)
      setPhotos((prev) => [...prev, ...newPhotos])

      // Create preview URLs
      const newPreviewUrls = newPhotos.map((photo) => URL.createObjectURL(photo))
      setPhotoPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removePhoto = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(photoPreviewUrls[index])

    setPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadPhotos = async () => {
    if (photos.length === 0) return []

    const uploadedUrls = []
    setUploadProgress(0)

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      const formData = new FormData()
      formData.append("file", photo)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload image ${i + 1}`)
        }

        const data = await response.json()
        uploadedUrls.push(data.url)

        // Update progress
        setUploadProgress(Math.round(((i + 1) / photos.length) * 100))
      } catch (err) {
        console.error(`Error uploading image ${i + 1}:`, err)
        throw err
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Upload new photos if any
      let newImageUrls: string[] = []
      if (photos.length > 0) {
        newImageUrls = await uploadPhotos()
      }

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages.map((img) => img.url), ...newImageUrls]

      // Update story
      const response = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          videoUrl,
          imageUrls: allImageUrls,
          published: publish,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to update story")
      }

      // Redirect to dashboard after successful update
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error updating story:", err)
      setError(err.message || "Произошла ошибка при обновлении истории")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading) {
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
      <h1 className="text-3xl font-bold mb-6">Редактировать историю</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, true)} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Информация об участнике войны</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  ФИО участника войны *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Заголовок истории *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Дата рождения
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Дата смерти
                  </label>
                  <input
                    id="deathDate"
                    name="deathDate"
                    type="date"
                    value={formData.deathDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-1">
                  Звание
                </label>
                <input
                  id="rank"
                  name="rank"
                  type="text"
                  value={formData.rank}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="militaryUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Воинская часть
                </label>
                <input
                  id="militaryUnit"
                  name="militaryUnit"
                  type="text"
                  value={formData.militaryUnit}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="awards" className="block text-sm font-medium text-gray-700 mb-1">
                  Награды
                </label>
                <input
                  id="awards"
                  name="awards"
                  type="text"
                  value={formData.awards}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Перечислите через запятую"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Фотографии и видео</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Существующие фотографии</label>

                {existingImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Фото ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                          aria-label="Удалить фото"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mb-4">Нет существующих фотографий</p>
                )}

                <label className="block text-sm font-medium text-gray-700 mb-2">Добавить новые фотографии</label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {photoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Новое фото ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                        aria-label="Удалить фото"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50">
                    <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
                    <Plus size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Добавить фото</span>
                  </label>
                </div>

                {isSubmitting && uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Загрузка фотографий: {uploadProgress}%</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Ссылка на видео (YouTube, Vimeo)
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="form-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">История</h2>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Расскажите историю *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-input min-h-[200px]"
              required
              placeholder="Опишите историю участника войны, его подвиги, интересные факты из жизни..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => router.back()} className="btn-secondary" disabled={isSubmitting}>
            Отмена
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Сохранить как черновик
          </button>
          <button type="submit" className="btn-primary flex items-center" disabled={isSubmitting}>
            {isSubmitting ? (
              "Сохранение..."
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                {isPublished ? "Обновить публикацию" : "Опубликовать"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
