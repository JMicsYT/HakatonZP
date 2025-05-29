"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Upload, X, Plus } from "lucide-react"

export default function CreateStoryPage() {
  const { user, isLoading } = useAuth()
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

  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

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
    setIsPublished(publish)

    try {
      // Upload photos first
      const imageUrls = await uploadPhotos()
      setUploadedImageUrls(imageUrls)

      // Create story
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          videoUrl,
          imageUrls,
          published: publish,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to create story")
      }

      // Redirect to dashboard after successful submission
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error submitting story:", err)
      setError(err.message || "Произошла ошибка при сохранении истории")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      <h1 className="text-3xl font-bold mb-6">Добавить новую историю</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, true)} className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-3">Информация об участнике войны</h2>

            <div className="space-y-3">
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
                  className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
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
                  className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
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
                    className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
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
                    className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
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
                  className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
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
                  className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
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
                  className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
                  placeholder="Перечислите через запятую"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Фотографии и видео</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Фотографии</label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {photoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Фото ${index + 1}`}
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
                  className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3">История</h2>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Расскажите историю *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-input border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm p-2 min-h-[200px]"
              required
              placeholder="Опишите историю участника войны, его подвиги, интересные факты из жизни..."
            />
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Обратите внимание:</strong> После отправки на публикацию, ваша история будет проверена
                модератором перед тем, как она появится на сайте.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            Сохранить как черновик
          </button>
          <button type="submit" className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center" disabled={isSubmitting}>
            {isSubmitting ? (
              "Публикация..."
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                Отправить на публикацию
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}