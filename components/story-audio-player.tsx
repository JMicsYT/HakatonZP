"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, StopCircle } from "lucide-react"

interface StoryAudioPlayerProps {
  storyId: string
  storyContent: string
  audioUrl?: string | null
}

export default function StoryAudioPlayer({ storyId, storyContent, audioUrl: initialAudioUrl }: StoryAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isWebSpeechSupported, setIsWebSpeechSupported] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const textChunksRef = useRef<string[]>([])
  const currentChunkIndexRef = useRef(0)

  // Проверяем поддержку Web Speech API при загрузке компонента
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      speechSynthRef.current = window.speechSynthesis
      setIsWebSpeechSupported(true)
    } else {
      setError("Ваш браузер не поддерживает синтез речи")
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }

      // Останавливаем синтез речи при размонтировании компонента
      if (speechSynthRef.current && utteranceRef.current) {
        speechSynthRef.current.cancel()
      }
    }
  }, [])

  // Разбиваем текст на абзацы для последовательного озвучивания
  useEffect(() => {
    if (storyContent) {
      // Разбиваем текст на абзацы или предложения для лучшего озвучивания
      const chunks = storyContent
        .split(/\n\n|\. /)
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 0)
        .map((chunk) => (chunk.endsWith(".") ? chunk : chunk + "."))

      textChunksRef.current = chunks
    }
  }, [storyContent])

  const speakText = () => {
    if (!speechSynthRef.current || !isWebSpeechSupported) {
      setError("Синтез речи недоступен в вашем браузере")
      return
    }

    // Отменяем предыдущий синтез, если он был
    speechSynthRef.current.cancel()

    // Начинаем с текущего индекса или с начала, если озвучка запускается заново
    if (!isPlaying) {
      currentChunkIndexRef.current = 0
    }

    const speakNextChunk = () => {
      if (currentChunkIndexRef.current >= textChunksRef.current.length) {
        setIsPlaying(false)
        setProgress(100)
        return
      }

      const chunk = textChunksRef.current[currentChunkIndexRef.current]
      setCurrentText(chunk)

      const utterance = new SpeechSynthesisUtterance(chunk)
      utterance.lang = "ru-RU"
      utterance.rate = 0.9 // Немного замедляем скорость речи для лучшего восприятия

      utterance.onend = () => {
        currentChunkIndexRef.current++
        // Обновляем прогресс
        const newProgress = (currentChunkIndexRef.current / textChunksRef.current.length) * 100
        setProgress(newProgress)

        // Говорим следующий кусок текста
        speakNextChunk()
      }

      utterance.onerror = (event) => {
        console.error("Ошибка синтеза речи:", event)
        setError("Произошла ошибка при озвучивании текста")
        setIsPlaying(false)
      }

      utteranceRef.current = utterance
      speechSynthRef.current?.speak(utterance)
    }

    speakNextChunk()
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (!isWebSpeechSupported) {
      setError("Ваш браузер не поддерживает синтез речи")
      return
    }

    if (isPlaying) {
      // Приостанавливаем озвучку
      if (speechSynthRef.current) {
        speechSynthRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      // Если озвучка была на паузе, продолжаем, иначе начинаем заново
      if (speechSynthRef.current?.paused) {
        speechSynthRef.current.resume()
        setIsPlaying(true)
      } else {
        speakText()
      }
    }
  }

  const stopAudio = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel()
    }
    setIsPlaying(false)
    setProgress(0)
    currentChunkIndexRef.current = 0
    setCurrentText("")
  }

  const resetAudio = () => {
    stopAudio()
    speakText()
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-3">Аудиоверсия истории</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-2">
        <button
          onClick={togglePlay}
          disabled={isLoading || !isWebSpeechSupported}
          className="bg-red-700 text-white rounded-full p-3 hover:bg-red-800 disabled:opacity-50"
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} />
          )}
        </button>

        <div className="flex-grow">
          <div className="bg-gray-300 h-2 rounded-full overflow-hidden">
            <div className="bg-red-700 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <button
          onClick={stopAudio}
          disabled={!isPlaying}
          className="text-gray-700 hover:text-red-700 disabled:opacity-50"
          aria-label="Остановить"
        >
          <StopCircle size={20} />
        </button>

        <button
          onClick={resetAudio}
          disabled={!isWebSpeechSupported}
          className="text-gray-700 hover:text-red-700 disabled:opacity-50"
          aria-label="Начать сначала"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {isPlaying && currentText && (
        <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
          <p className="text-sm text-gray-700">{currentText}</p>
        </div>
      )}

      {!isWebSpeechSupported && !error && (
        <p className="text-sm text-gray-600 mt-2">
          К сожалению, ваш браузер не поддерживает функцию озвучивания текста.
        </p>
      )}

      {!isPlaying && !error && isWebSpeechSupported && (
        <p className="text-sm text-gray-600 mt-2">Нажмите на кнопку воспроизведения, чтобы прослушать историю</p>
      )}
    </div>
  )
}
