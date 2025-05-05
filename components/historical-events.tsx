import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface HistoricalEvent {
  date: string
  title: string
  description: string
  image?: string
}

const historicalEvents: HistoricalEvent[] = [
  {
    date: "22 июня 1941",
    title: "Начало Великой Отечественной войны",
    description: "Германия вероломно напала на Советский Союз, нарушив пакт о ненападении.",
    image: "https://avatars.mds.yandex.net/get-entity_search/5574318/1132483476/S600xU_2x",
  },
  {
    date: "8 сентября 1941",
    title: "Начало блокады Ленинграда",
    description: "Началась 872-дневная блокада Ленинграда немецкими войсками.",
    image: "https://cdn.culture.ru/images/5905fd15-e585-5aad-bd13-ae6bc5d924f5",
  },
  {
    date: "5 декабря 1941",
    title: "Контрнаступление под Москвой",
    description: "Советские войска перешли в контрнаступление под Москвой, отбросив немецкие войска.",
    image: "https://i.mycdn.me/videoPreview?id=5553028336228&type=38&idx=8&tkn=i0du0OZ6W4K3HUHOyZWSv1xWHXY&fn=external_8",
  },
  {
    date: "2 февраля 1943",
    title: "Победа в Сталинградской битве",
    description: "Капитуляция немецких войск в Сталинграде, переломный момент в войне.",
    image: "https://cdn.culture.ru/images/a6871821-eb7c-5841-8be1-8037e06cc0c1",
  },
  {
    date: "9 мая 1945",
    title: "День Победы",
    description: "Подписание акта о безоговорочной капитуляции Германии. Окончание Великой Отечественной войны.",
    image: "https://mozyrsalt.by/uploads/2024/05/Plakat-9-maya3.jpg",
  },
]

export default function HistoricalEvents() {
  return (
    <div className="space-y-8">
      <h2 className="section-title-victory">Этот день в истории войны</h2>

      <div className="relative">
        <div className="timeline-line"></div>

        <div className="space-y-12">
          {historicalEvents.map((event, index) => (
            <div key={index} className="timeline-item">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-victory-red text-white text-sm font-medium rounded-full">
                  {event.date}
                </span>
              </div>
              <Card className="card-victory">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {event.image && (
                      <div className="w-full md:w-1/3">
                        <div className="relative h-48 rounded-md overflow-hidden">
                          <Image
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className="w-full md:w-2/3">
                      <h3 className="text-xl font-bold text-victory-black mb-2 star-victory">{event.title}</h3>
                      <p className="text-gray-700">{event.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
