import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Помним</h3>
            <p className="text-gray-600">
              Платформа для сохранения и публикации историй о родственниках – участниках войны.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-red-700">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-gray-600 hover:text-red-700">
                  Истории
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-red-700">
                  Поиск
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-red-700">
                  О проекте
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: info@pomnim.ru</li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-red-700">
                  Форма обратной связи
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-6 text-center text-gray-600">
          <p>© {currentYear} Помним. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
