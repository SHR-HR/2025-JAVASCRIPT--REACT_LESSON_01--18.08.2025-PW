// Импорт необходимых хуков из React
import React, { useEffect, useMemo, useState } from "react";
// Импорт компонентов карточек объявлений
import AdCard from "./components/AdCard.jsx";
import NewAdCard from "./components/NewAdCard.jsx";

// Ключ для сохранения данных в localStorage
const LS_KEY = "ads_v1";

// Стартовые демонстрационные данные на случай пустого localStorage
const seed = [
  {
    id: crypto.randomUUID(), // Генерация уникального ID
    title: "CRT монитор Samsung",
    description: "Коллекционный, рабочий. Самовывоз.",
    price: 15000,
    imageUrl:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: crypto.randomUUID(),
    title: "Игровая консоль",
    description: "Состояние отличное, 2 геймпада.",
    price: 120000,
    imageUrl:
      "https://images.unsplash.com/photo-1606813907291-76e4d0ef9b38?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: crypto.randomUUID(),
    title: "Колонки 2.1",
    description: "Громкие, без искажений.",
    price: 25000,
    imageUrl:
      "https://images.unsplash.com/photo-1518441257438-6f7f09a6f01a?q=80&w=1200&auto=format&fit=crop"
  }
];

// Главный компонент приложения
export default function App() {
  // Инициализация состояния объявлений из localStorage
  const [ads, setAds] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY); // Получаем данные из localStorage
      return raw ? JSON.parse(raw) : seed; // Парсим JSON или используем демо-данные
    } catch {
      return seed; // В случае ошибки используем демо-данные
    }
  });

  // Состояние для поискового запроса
  const [query, setQuery] = useState("");

  // Настройки пагинации
  const pageSize = 10; // Количество элементов на странице (2 ряда × 5 колонок)
  const [page, setPage] = useState(1); // Текущая страница

  // Эффект для сохранения объявлений в localStorage при их изменении
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(ads));
  }, [ads]); // Зависимость от ads - эффект срабатывает при изменении объявлений

  // Эффект для сброса на первую страницу при изменении поискового запроса
  useEffect(() => setPage(1), [query]);

  // Мемоизированный фильтр объявлений по поисковому запросу
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase(); // Нормализуем поисковый запрос
    if (!q) return ads; // Если запрос пустой - возвращаем все объявления
    return ads.filter((a) => a.title.toLowerCase().includes(q)); // Фильтруем по заголовку
  }, [ads, query]); // Зависимости: ads и query

  // Расчет общего количества страниц
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // Индекс начала текущей страницы
  const start = (page - 1) * pageSize;
  // Элементы для текущей страницы
  const pageItems = filtered.slice(start, start + pageSize);

  // Обработчик создания нового объявления
  const handleCreate = (payload) => {
    setAds((prev) => [{ id: crypto.randomUUID(), ...payload }, ...prev]); // Добавляем в начало
    setPage(1); // Возвращаемся на первую страницу
  };

  // Обработчик обновления существующего объявления
  const handleUpdate = (id, patch) => {
    setAds((prev) => prev.map((ad) => (ad.id === id ? { ...ad, ...patch } : ad)));
  };

  // Обработчик удаления объявления
  const handleDelete = (id) => {
    setAds((prev) => prev.filter((ad) => ad.id !== id));
    // Корректировка номера страницы после удаления (если страница стала пустой)
    setTimeout(() => {
      setPage((p) => {
        const after = Math.ceil((filtered.length - 1) / pageSize) || 1;
        return Math.min(p, after);
      });
    });
  };

  // Рендер компонента
  return (
    <div className="page">
      {/* Шапка страницы */}
      <header className="page__header">
        <h1>Доска объявлений</h1>
        <p className="muted">React компоненты и пропсы. Инлайн-редактирование + пагинация.</p>

        {/* Панель инструментов с поиском */}
        <div className="toolbar">
          <input
            className="search"
            placeholder="Поиск по заголовку…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Основная область с карточками объявлений */}
      <main className="board board--cols5">
        {/* Компонент для создания нового объявления */}
        <NewAdCard onCreate={handleCreate} />
        {/* Отображение карточек объявлений текущей страницы */}
        {pageItems.map((ad) => (
          <AdCard key={ad.id} ad={ad} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </main>

      {/* Подвал с пагинацией */}
      <footer className="pager">
        {/* Кнопка "Назад" */}
        <button
          className="btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Назад
        </button>

        {/* Блок с номерами страниц */}
        <div className="pager__pages" role="tablist" aria-label="Страницы">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`pager__btn ${n === page ? "is-active" : ""}`}
              onClick={() => setPage(n)}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Кнопка "Вперед" */}
        <button
          className="btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Вперёд →
        </button>
      </footer>
    </div>
  );
}







