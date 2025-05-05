import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-victory-black text-white">
      <div className="ribbon h-3 w-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span>Цифровая книга памяти</span>
            </h3>
            <p className="text-gray-300">Платформа для сохранения историй о родственниках – участниках войны</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-gray-300 hover:text-white">
                  Истории
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white">
                  Поиск
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  О проекте
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@knigapamyati.ru</li>
              <li className="text-gray-300">Телефон: +7 (XXX) XXX-XX-XX</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>© {new Date().getFullYear()} Цифровая книга памяти. Все права защищены.</p>
        </div>
      </div>
      <div className="ribbon h-3 w-full"></div>
    </footer>
  )
}
