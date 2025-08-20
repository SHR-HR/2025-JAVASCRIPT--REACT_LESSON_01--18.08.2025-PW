// Конфигурационный файл ESLint для настройки линтера JavaScript/React
// ESLint - инструмент для статического анализа кода и выявления ошибок

// Импорт базовой конфигурации JavaScript из официального пакета @eslint/js
import js from '@eslint/js'
// Импорт глобальных переменных для различных сред (браузер, node.js и т.д.)
import globals from 'globals'
// Импорт плагина для проверки правил использования React хуков
import reactHooks from 'eslint-plugin-react-hooks'
// Импорт плагина для поддержки Fast Refresh в React (горячая перезагрузка)
import reactRefresh from 'eslint-plugin-react-refresh'
// Импорт функций для создания конфигурации ESLint
import { defineConfig, globalIgnores } from 'eslint/config'

// Экспорт конфигурации по умолчанию с использованием defineConfig
export default defineConfig([
  // Глобальное игнорирование папки 'dist' (собранные файлы для production)
  globalIgnores(['dist']),
  
  {
    // Применять правила ко всем файлам с расширениями .js и .jsx
    files: ['**/*.{js,jsx}'],
    
    // Расширение базовых конфигураций:
    extends: [
      js.configs.recommended,                    // Рекомендуемая конфигурация JavaScript
      reactHooks.configs['recommended-latest'],  // Последняя рекомендуемая конфигурация React Hooks
      reactRefresh.configs.vite,                 // Конфигурация для React Refresh в Vite
    ],
    
    // Настройки языка JavaScript
    languageOptions: {
      ecmaVersion: 2020,           // Версия ECMAScript (синтаксис JavaScript)
      globals: globals.browser,    // Глобальные переменные браузера (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest',     // Последняя версия ECMAScript для парсера
        ecmaFeatures: { jsx: true }, // Включение поддержки JSX синтаксиса
        sourceType: 'module',      // Использование ES6 модулей (import/export)
      },
    },
    
    // Пользовательские правила ESLint
    rules: {
      // Правило для неиспользуемых переменных с исключением для переменных в верхнем регистре
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // ^[A-Z_] - регулярное выражение: игнорировать переменные, начинающиеся с заглавной буквы или _
      // Это позволяет не считать ошибкой компоненты React (PascalCase) и константы (UPPER_CASE)
    },
  },
])




