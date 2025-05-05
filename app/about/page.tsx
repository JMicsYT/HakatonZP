import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import MedalsShowcase from "@/components/medals-showcase"

const teamMembers = [
  {
    name: "Рижко Д.Д.",
    role: "Teamlead",
    image: "https://cdn1.ozone.ru/s3/multimedia-1-l/7001975073.jpg",
  },
  {
    name: "Куликов О.Н.",
    role: "Frontend-разработчик",
    image: "https://cdn1.ozone.ru/s3/multimedia-1-l/7001975073.jpg",
  },
  {
    name: "Туманов Н.Н.",
    role: "Backend-разработчик",
    image: "https://cdn1.ozone.ru/s3/multimedia-1-l/7001975073.jpg",
  },
  {
    name: "Коваленко Д.А.",
    role: "UX/UI дизайнер",
    image: "https://cdn1.ozone.ru/s3/multimedia-1-l/7001975073.jpg",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50 hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-victory-black mb-4">
            <span>О проекте</span>
          </h1>
          <div className="w-24 h-1 bg-victory-red mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Цифровая книга памяти — это проект, созданный для сохранения историй участников Великой Отечественной войны
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="section-title-victory">Наша миссия</h2>
            <p className="text-gray-700 mb-4">
              Миссия проекта «Цифровая книга памяти» — сохранить и передать будущим поколениям память о подвиге
              советского народа в Великой Отечественной войне через личные истории участников тех событий.
            </p>
            <p className="text-gray-700 mb-4">
              Мы стремимся создать единую базу данных, где каждый желающий может поделиться историей своего
              родственника, участвовавшего в войне, и таким образом внести свой вклад в сохранение исторической памяти.
            </p>
            <p className="text-gray-700">
              Наша цель — собрать как можно больше историй, фотографий и документов, чтобы сохранить память о каждом
              герое, независимо от его звания и наград.
            </p>
          </div>

          <div className="relative h-80 rounded-lg overflow-hidden memory-card">
            <Image src="https://avatars.mds.yandex.net/get-altay/4530524/2a00000179b735c5304c65fce111a25e9404/XXXL" alt="Вечный огонь" fill className="object-cover" />
          </div>
        </div>

        <div className="mb-16">
          <MedalsShowcase />
        </div>

        <div className="mb-16">
          <h2 className="section-title-victory mb-6 text-center">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Регистрация",
                description: "Создайте аккаунт на нашем сайте, чтобы получить доступ к функциям платформы",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                )
              },
              {
                title: "Создание истории",
                description: "Добавьте информацию о вашем родственнике, участнике войны, загрузите фото и документы",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                )
              },
              {
                title: "Публикация",
                description: "После модерации история будет опубликована и станет доступна для всех посетителей сайта",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                )
              }
            ].map((item, index) => (
              <Card key={index} className="card-victory text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-victory-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-victory-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-victory-black mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Команда */}
        <div className="mb-16">
          <h2 className="section-title-victory mb-6 text-center">Наша команда</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-2 border-victory-red">
                  <Image
                    src={member.image}
                    alt={`Член команды ${member.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-victory-black">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16 relative overflow-hidden">
          <h2 className="section-title-victory mb-6 text-center mt-4">Часто задаваемые вопросы</h2>
          <div className="space-y-6">
            {/* каждый вопрос отдельно */}
            <div>
              <h3 className="text-lg font-bold text-victory-black mb-2">
                Как я могу добавить историю своего родственника?
              </h3>
              <p className="text-gray-700">
                Для добавления истории необходимо зарегистрироваться на сайте, затем перейти в раздел "Добавить историю"
                и заполнить предложенную форму. Вы можете добавить текст, фотографии и документы.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-victory-black mb-2">Какие материалы я могу загрузить?</h3>
              <p className="text-gray-700">
                Вы можете загрузить фотографии в форматах JPG, PNG, GIF, а также документы в форматах PDF, DOC.
                Максимальный размер файла — 10 МБ.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-victory-black mb-2">Как долго проходит модерация?</h3>
              <p className="text-gray-700">
                Обычно модерация занимает от 1 до 3 рабочих дней. После проверки вы получите уведомление о публикации
                или необходимости внести изменения.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-victory-black mb-2">
                Могу ли я редактировать опубликованную историю?
              </h3>
              <p className="text-gray-700">
                Да, вы можете редактировать опубликованную историю в любое время. После редактирования история снова
                пройдет модерацию перед публикацией.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-victory-red text-white rounded-lg p-8 text-center relative overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Присоединяйтесь к проекту</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Сохраните историю своей семьи для будущих поколений. Каждая история важна для сохранения памяти о Великой
            Отечественной войне.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block bg-white text-victory-red font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-all"
            >
              Зарегистрироваться
            </Link>
            <Link
              href="/stories"
              className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-md hover:bg-white/10 transition-all"
            >
              Читать истории
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
