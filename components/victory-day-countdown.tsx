"use client"

import { useState, useEffect } from "react"

export default function VictoryDayCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isVictoryDay, setIsVictoryDay] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const currentYear = now.getFullYear()

      // Создаем дату 9 мая текущего года
      const victoryDay = new Date(currentYear, 4, 9) // Месяцы начинаются с 0, поэтому 4 = май

      // Если 9 мая уже прошло в этом году, берем 9 мая следующего года
      if (now > victoryDay) {
        victoryDay.setFullYear(currentYear + 1)
      }

      // Проверяем, сегодня ли День Победы
      const today = new Date()
      setIsVictoryDay(today.getDate() === 9 && today.getMonth() === 4)

      const difference = victoryDay.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isVictoryDay) {
    return (
      <div className="bg-victory-red text-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">С Днём Победы!</h2>
        <p className="text-xl">Сегодня мы чтим память героев, подаривших нам мирное небо над головой.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 victory-gradient">До Дня Победы осталось:</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.days}</span>
          <span className="countdown-label">Дней</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.hours}</span>
          <span className="countdown-label">Часов</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.minutes}</span>
          <span className="countdown-label">Минут</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.seconds}</span>
          <span className="countdown-label">Секунд</span>
        </div>
      </div>
    </div>
  )
}
