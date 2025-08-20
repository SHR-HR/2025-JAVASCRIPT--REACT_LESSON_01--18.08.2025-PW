// Импорт необходимых модулей и хуков из React
import React, { useEffect, useState, useCallback } from "react";

// Основной компонент карточки объявления
// Принимает три пропса: ad (объект объявления), onUpdate и onDelete (функции обратного вызова)
export default function AdCard({ ad, onUpdate, onDelete }) {
  // Состояние для отслеживания режима редактирования (вкл/выкл)
  const [isEditing, setIsEditing] = useState(false);
  // Состояние для хранения черновика редактирования (копия объявления)
  const [draft, setDraft] = useState(ad);

  // Эффект для синхронизации черновика с исходными данными объявления
  // Срабатывает при изменении пропса ad
  useEffect(() => setDraft(ad), [ad]);

  // Обработчик изменения полей ввода в режиме редактирования
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((d) => ({ 
      ...d, 
      [name]: name === "price" ? Number(value) : value // Для поля price преобразуем в число
    }));
  };

  // Вспомогательная функция для чтения файла как Data URL
  const readFileAsDataURL = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader(); // Создаем объект для чтения файлов
      r.onload = () => res(r.result); // При успешной загрузке возвращаем результат
      r.onerror = rej; // При ошибке отклоняем промис
      r.readAsDataURL(file); // Читаем файл как Data URL
    });

  // Обработчик события перетаскивания файла (drag and drop)
  const onDrop = useCallback(async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение браузера
    const file = e.dataTransfer.files?.[0]; // Получаем первый перетащенный файл
    if (!file) return; // Если файла нет - выходим
    const dataUrl = await readFileAsDataURL(file); // Читаем файл как Data URL
    setDraft((d) => ({ ...d, imageUrl: dataUrl })); // Обновляем черновик с новой картинкой
  }, []); // Пустой массив зависимостей - функция создается один раз

  // Обработчик сохранения изменений
  const handleSave = () => {
    // Проверяем обязательные поля: название и изображение
    if (!draft.title?.trim() || !draft.imageUrl?.trim()) return;
    
    // Вызываем функцию обновления с отформатированными данными
    onUpdate(ad.id, {
      title: draft.title.trim(), // Обрезаем пробелы в названии
      description: draft.description?.trim() ?? "", // Обрезаем пробелы в описании или пустая строка
      price: Number.isFinite(draft.price) ? draft.price : 0, // Проверяем что цена - число
      imageUrl: draft.imageUrl.trim ? draft.imageUrl.trim() : draft.imageUrl // Data URL без обрезки пробелов
    });
    setIsEditing(false); // Выходим из режима редактирования
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    setDraft(ad); // Восстанавливаем исходные данные объявления
    setIsEditing(false); // Выходим из режима редактирования
  };

  // Рендер компонента
  return (
    // Основной контейнер карточки с условным классом для режима редактирования
    <article className={`card ${isEditing ? "card--editing" : ""}`}>
      
      {/* Условный рендеринг: режим просмотра или режим редактирования */}
      {!isEditing ? (
        // РЕЖИМ ПРОСМОТРА (не редактирование)
        <>
          {/* Контейнер для изображения объявления */}
          <div className="card__imageWrap">
            <img
              src={ad.imageUrl} // URL изображения
              alt={ad.title} // Альтернативный текст для доступности
              onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")} // Запасное изображение при ошибке загрузки
            />
          </div>

          {/* Тело карточки с информацией об объявлении */}
          <div className="card__body">
            <h3 className="card__title">{ad.title}</h3> {/* Название объявления */}
            <p className="card__desc">{ad.description || "—"}</p> {/* Описание или прочерк если пусто */}
            <div className="card__meta">
              <span className="price">{ad.price?.toLocaleString()} ₸</span> {/* Цена с форматированием и символом тенге */}
            </div>
          </div>

          {/* Кнопки действий в режиме просмотра */}
          <div className="card__actions">
            <button className="btn" onClick={() => setIsEditing(true)}>Редактировать</button>
            <button className="btn btn--danger" onClick={() => onDelete(ad.id)}>Удалить</button>
          </div>
        </>
      ) : (
        // РЕЖИМ РЕДАКТИРОВАНИЯ
        <>
          {/* Область для перетаскивания изображения с обработчиками drag and drop */}
          <div
            className="card__imageWrap card__imageWrap--drop"
            onDragOver={(e) => e.preventDefault()} // Разрешаем перетаскивание
            onDrop={onDrop} // Обработчик сброса файла
            title="Перетащи сюда картинку" // Подсказка при наведении
          >
            <img
              src={draft.imageUrl || "https://placehold.co/600x400?text=Drag+Image+Here"} // Предпросмотр изображения
              alt="preview" // Альтернативный текст
              onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")} // Запасное изображение
            />
          </div>

          {/* Тело карточки с полями ввода для редактирования */}
          <div className="card__body">
            {/* Поле для названия объявления (обязательное) */}
            <label className="field">
              <span>Название *</span>
              <input name="title" value={draft.title} onChange={handleChange} />
            </label>

            {/* Поле для описания объявления */}
            <label className="field">
              <span>Описание</span>
              <textarea name="description" rows={3} value={draft.description} onChange={handleChange} />
            </label>

            {/* Поле для цены (числовое) */}
            <label className="field">
              <span>Цена</span>
              <input name="price" type="number" min="0" value={draft.price ?? 0} onChange={handleChange} />
            </label>

            {/* Поле для URL изображения (обязательное) */}
            <label className="field">
              <span>URL изображения *</span>
              <input 
                name="imageUrl" 
                value={draft.imageUrl} 
                onChange={handleChange} 
                placeholder="https://... или data:image/..." // Подсказка для пользователя
              />
            </label>
          </div>

          {/* Кнопки действий в режиме редактирования */}
          <div className="card__actions">
            <button className="btn btn--primary" onClick={handleSave}>Сохранить</button>
            <button className="btn" onClick={handleCancel}>Отмена</button>
          </div>
        </>
      )}
    </article>
  );
}




