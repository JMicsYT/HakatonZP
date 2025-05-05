import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">О проекте "Помним"</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="mb-4">
            Проект "Помним" создан с целью сохранения и публикации историй о родственниках – участниках войны,
            обеспечения возможности поиска информации и обмена воспоминаниями между пользователями.
          </p>
          <p className="mb-4">
            Наша миссия – сохранить память о подвигах наших предков для будущих поколений, создать единое пространство,
            где каждый может поделиться историей своей семьи и найти информацию о других участниках войны.
          </p>
          <p>
            Мы верим, что каждая история имеет значение, и каждый герой достоин того, чтобы о нем помнили.
            Присоединяйтесь к нашему проекту и помогите сохранить историческую память о тех, кто защищал нашу Родину.
          </p>
        </div>
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="О проекте Помним"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Наши цели</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Сохранение памяти</h3>
            <p className="text-gray-600">
              Создание цифрового архива историй о участниках войны, доступного для всех желающих.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Объединение поколений</h3>
            <p className="text-gray-600">
              Создание связи между поколениями через истории о подвигах предков и сохранение семейной памяти.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Патриотическое воспитание</h3>
            <p className="text-gray-600">
              Формирование у молодого поколения чувства патриотизма и уважения к историческому прошлому нашей страны.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Как это работает</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-xl mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-medium mb-2">Регистрация</h3>
            <p className="text-gray-600">Создайте аккаунт на нашей платформе</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-xl mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-medium mb-2">Создание истории</h3>
            <p className="text-gray-600">Добавьте информацию о вашем родственнике</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-xl mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-medium mb-2">Публикация</h3>
            <p className="text-gray-600">Опубликуйте историю на платформе</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-xl mx-auto mb-4">
              4
            </div>
            <h3 className="text-lg font-medium mb-2">Поиск</h3>
            <p className="text-gray-600">Ищите истории других участников войны</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Присоединяйтесь к проекту</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Станьте частью нашего сообщества и помогите сохранить память о героях войны. Регистрируйтесь на платформе и
          делитесь историями ваших родственников.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/register" className="btn-primary">
            Зарегистрироваться
          </Link>
          <Link href="/stories" className="btn-secondary">
            Читать истории
          </Link>
        </div>
      </div>
    </div>
  )
}
