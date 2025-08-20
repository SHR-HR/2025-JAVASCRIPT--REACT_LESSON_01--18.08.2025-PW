// Конфигурационный файл Vite - современного инструмента для сборки фронтенд-приложений
// Vite обеспечивает быструю разработку и оптимизированную production-сборку

// Импорт функции defineConfig из Vite для создания конфигурации с TypeScript подсказками
import { defineConfig } from 'vite'
// Импорт официального плагина React для Vite
import react from '@vitejs/plugin-react'

// Экспорт конфигурации по умолчанию
// https://vite.dev/config/ - документация по настройке Vite
export default defineConfig({
  // Массив плагинов, которые расширяют функциональность Vite
  plugins: [
    // Плагин React обеспечивает:
    // - Поддержку JSX/TSX синтаксиса
    // - Горячую перезагрузку (HMR) для React компонентов
    // - Оптимизацию сборки React приложения
    react()
  ],
})




