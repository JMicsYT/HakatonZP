import Link from "next/link"
import Image from "next/image"
import SearchBar from "@/components/search-bar"
import FeaturedStories from "@/components/featured-stories"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <section className="py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Сохраним память о героях вместе</h1>
            <p className="text-lg mb-8">
              Платформа "Помним" создана для сохранения и публикации историй о родственниках – участниках войны.
              Делитесь воспоминаниями, фотографиями и видео, чтобы сохранить память о подвигах наших предков.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary">
                Присоединиться
              </Link>
              <Link href="/stories" className="btn-secondary">
                Читать истории
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-[300px] md:h-[400px] w-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Военные фотографии"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Найти историю</h2>
        <SearchBar />
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Избранные истории</h2>
        <FeaturedStories />
      </section>

      <section className="py-8 bg-gray-50 rounded-lg p-6 my-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">О проекте</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-center mb-4">
            Проект "Помним" создан для сохранения памяти о тех, кто защищал нашу Родину в годы войны. Каждая история
            имеет значение, каждое воспоминание бесценно.
          </p>
          <p className="text-center">
            Присоединяйтесь к нам, чтобы сохранить историю вашей семьи для будущих поколений.
          </p>
        </div>
      </section>
    </div>
  )
}
