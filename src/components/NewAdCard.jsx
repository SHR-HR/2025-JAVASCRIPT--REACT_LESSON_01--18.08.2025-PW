// Импорт необходимых модулей и хуков из React
import React, { useCallback, useEffect, useState } from "react";

// Компонент для создания нового объявления
// Принимает один пропс: onCreate - функция для создания нового объявления
export default function NewAdCard({ onCreate }) {
  // Состояние для отслеживания открытия/закрытия формы создания
  const [open, setOpen] = useState(false);
  // Состояние для хранения данных формы нового объявления
  const [form, setForm] = useState({ 
    title: "",           // Название объявления
    description: "",     // Описание объявления
    price: 0,            // Цена (числовое значение)
    imageUrl: ""         // URL или Data URL изображения
  });

  // Обработчик изменения полей ввода формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ 
      ...f, 
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
    setForm((f) => ({ ...f, imageUrl: dataUrl })); // Обновляем форму с новой картинкой
  }, []); // Пустой массив зависимостей - функция создается один раз

  // Эффект для обработки вставки изображения из буфера обмена (Ctrl+V)
  useEffect(() => {
    if (!open) return; // Работает только когда форма открыта
    
    const handler = async (e) => {
      // Ищем изображение среди элементов буфера обмена
      const item = [...e.clipboardData.items].find((i) => i.type.startsWith("image/"));
      if (!item) return; // Если не нашли изображение - выходим
      const file = item.getAsFile(); // Получаем файл из элемента буфера
      const dataUrl = await readFileAsDataURL(file); // Читаем файл как Data URL
      setForm((f) => ({ ...f, imageUrl: dataUrl })); // Обновляем форму с новой картинкой
    };
    
    // Добавляем обработчик события вставки
    window.addEventListener("paste", handler);
    
    // Функция очистки: удаляем обработчик при размонтировании или изменении open
    return () => window.removeEventListener("paste", handler);
  }, [open]); // Зависимость от open - эффект срабатывает при изменении состояния открытия формы

  // Обработчик отправки формы создания объявления
  const handleSubmit = () => {
    // Проверяем обязательные поля: название и изображение
    if (!form.title.trim() || !form.imageUrl) return;
    
    // Вызываем функцию создания с отформатированными данными
    onCreate({
      title: form.title.trim(), // Обрезаем пробелы в названии
      description: form.description.trim(), // Обрезаем пробелы в описании
      price: Number.isFinite(form.price) ? form.price : 0, // Проверяем что цена - число
      imageUrl: form.imageUrl.trim ? form.imageUrl.trim() : form.imageUrl // Data URL без обрезки пробелов
    });
    
    // Сбрасываем форму к начальным значениям
    setForm({ title: "", description: "", price: 0, imageUrl: "" });
    setOpen(false); // Закрываем форму
  };

  // Если форма закрыта - показываем кнопку для открытия формы
  if (!open) {
    return (
      <button className="card card--new" onClick={() => setOpen(true)}>
        + Создать объявление
      </button>
    );
  }

  // Если форма открыта - показываем форму создания
  return (
    <article className="card card--editing card--newForm">
      {/* Область для перетаскивания и вставки изображений */}
      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()} // Разрешаем перетаскивание
        onDrop={onDrop} // Обработчик сброса файла
        title="Перетащи сюда картинку или вставь её (Ctrl+V)" // Подсказка при наведении
      >
        <img
          src={form.imageUrl || "https://placehold.co/800x300?text=Drop+or+Paste+Image"} // Предпросмотр или заглушка
          alt="preview" // Альтернативный текст
          onError={(e) => (e.currentTarget.src = "https://placehold.co/800x300?text=No+Image")} // Запасное изображение при ошибке
        />
      </div>

      {/* Тело формы с полями ввода */}
      <div className="card__body">
        {/* Поле для названия объявления (обязательное) */}
        <label className="field">
          <span>Название *</span>
          <input name="title" value={form.title} onChange={handleChange} />
        </label>

        {/* Поле для описания объявления */}
        <label className="field">
          <span>Описание</span>
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} />
        </label>

        {/* Поле для цены (числовое) */}
        <label className="field">
          <span>Цена</span>
          <input type="number" name="price" min="0" value={form.price} onChange={handleChange} />
        </label>

        {/* Поле для URL изображения (обязательное) */}
        <label className="field">
          <span>URL изображения *</span>
          <input 
            name="imageUrl" 
            value={form.imageUrl} 
            onChange={handleChange} 
            placeholder="https://... или перетащи файл" // Подсказка для пользователя
          />
        </label>
      </div>

      {/* Кнопки действий формы */}
      <div className="card__actions">
        <button className="btn btn--primary" onClick={handleSubmit}>Создать</button>
        <button className="btn" onClick={() => setOpen(false)}>Отмена</button>
      </div>
    </article>
  );
}







