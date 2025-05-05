import Link from "next/link"
import Image from "next/image"
import SearchBar from "@/components/search-bar"
import FeaturedStories from "@/components/featured-stories"
import VictoryDayCountdown from "@/components/victory-day-countdown"
import HistoricalEvents from "@/components/historical-events"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-victory-black text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
          <Image
            src="https://avatars.mds.yandex.net/i?id=ab77796f83e0695e7a7dcc2b6ccc5210_l-8209451-images-thumbs&n=13"
            alt="Вечный огонь"
            width={1920}
            height={800}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-20">
          <div className="max-w-3xl">
            <div className="flex items-center mb-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">Цифровая книга памяти</h1>
            </div>
            <p className="text-xl sm:text-2xl mb-8">Сохраним историю каждого героя для будущих поколений</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="btn-victory">
                Зарегистрироваться
              </Link>
              <Link href="/stories" className="btn-secondary">
                Читать истории
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <VictoryDayCountdown />
        </div>
      </section>
      {/* About Section */}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-victory-black mb-4">О проекте</h2>
            <div className="w-24 h-1 bg-victory-red mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Цифровая книга памяти — это платформа, где каждый может сохранить и поделиться историей своих
              родственников, участвовавших в Великой Отечественной войне. Наша цель — сохранить память о каждом герое
              для будущих поколений.
            </p>
          </div>
        </div>
      </section>
      {/* Search Section */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Найти историю</h2>
        <SearchBar />
      </section>

      {/* Historical Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HistoricalEvents />
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Избранные истории</h2>
        <FeaturedStories />
      </section>
    </div>
  )
}