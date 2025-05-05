import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Medal {
  id: number
  name: string
  image: string
  description: string
}

const medals: Medal[] = [
  {
    id: 1,
    name: "Орден Красной Звезды",
    image: "https://avatars.mds.yandex.net/i?id=0ae47e3353e1847d259637413c7c70ed_l-9065942-images-thumbs&n=13",
    description: "Вручался за большие заслуги в деле обороны СССР как в военное, так и в мирное время.",
  },
  {
    id: 2,
    name: "Орден Славы",
    image: "https://avatars.mds.yandex.net/i?id=340809d5bf6669b48e8c29daacfec561_l-9875416-images-thumbs&n=13",
    description: "Вручался за личный подвиг на поле боя.",
  },
  {
    id: 3,
    name: "Орден Отечественной войны",
    image: "https://polkrf.ru/storage/veterans/May2023/wrPgac9NxLexKZAK51Pe6wd0GNt2hsxW9wx2lZiZ.jpg",
    description: "Вручался за храбрость, стойкость и мужество, проявленные в боях.",
  },
  {
    id: 4,
    name: "Медаль «За отвагу»",
    image: "https://cdn.moypolk.ru/static/resize/w800/soldiers/awards/2023/05/05/e22f510ad3031d1f08340df6888829a1.png",
    description: "Одна из самых почетных солдатских наград.",
  },
  {
    id: 5,
    name: "Медаль «За боевые заслуги»",
    image: "https://avatars.mds.yandex.net/i?id=feedc5d58e3fbe399bdf12862895ca56_l-3708982-images-thumbs&n=13",
    description: "Вручалась за активное содействие успеху боевых действий.",
  },
]

export default function MedalsShowcase() {
  return (
    <div className="py-8">
      <h2 className="section-title-victory mb-8">Награды Великой Отечественной войны</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {medals.map((medal) => (
          <Card key={medal.id} className="card-victory hover:scale-105 transition-all duration-300">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image src={medal.image || "/placeholder.svg"} alt={medal.name} fill className="object-contain" />
              </div>
              <h3 className="text-lg font-bold text-center mb-2">{medal.name}</h3>
              <p className="text-sm text-gray-600 text-center">{medal.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
