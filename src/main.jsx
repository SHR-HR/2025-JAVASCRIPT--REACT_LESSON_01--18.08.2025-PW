// Импорт библиотеки React (необходима для работы с JSX)
import React from "react";
// Импорт ReactDOM из пакета react-dom/client для рендеринга в DOM
import ReactDOM from "react-dom/client";
// Импорт главного компонента приложения App
import App from "./App.jsx";
// Импорт глобальных стилей приложения
import "./styles.scss";

// Создание корневого элемента React и рендеринг приложения в DOM
// document.getElementById("root") - находим HTML элемент с id="root" в index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // Оборачиваем приложение в StrictMode для дополнительных проверок в development режиме
  // StrictMode помогает выявлять потенциальные проблемы в коде
  <React.StrictMode>
    {/* Главный компонент приложения - корневой компонент React дерева */}
    <App />
  </React.StrictMode>
);





