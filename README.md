# Mentor Monorepo

Монорепозиторій проєкту державної служби зайнятості — Програма менторства (Постанова №472).

## 📁 Структура проєкту

```
mentor/
├── public-mentorship/       # Angular 21 публічний фронтенд (порт 4200)
├── admin-mentorship/        # Angular 21 адмін панель (порт 4201)
├── mentorship-api/          # NestJS бекенд API (порт 3000)
├── libs/
│   └── shared-types/        # Спільні TypeScript типи та інтерфейси
├── ecosystem.config.js      # PM2 конфігурація
├── package.json             # Кореневий package.json (NPM Workspaces)
└── README.md
```

## 🚀 Швидкий старт

### 1. Вимоги

- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. Установка залежностей

```bash
npm install
```

Ця команда встановить залежності для всіх workspace проєктів.

### 3. Запуск сервісів

#### Запуск усіх сервісів через PM2:
```bash
npm run start:all
```

#### Запуск окремих сервісів:
```bash
# Публічний фронтенд (Angular 21, порт 4200)
npm run start:public

# Адмін панель (Angular 21, порт 4201)
npm run start:admin

# Бекенд API (NestJS, порт 3000)
npm run start:api
```

### 4. PM2 управління

```bash
# Перегляд логів
npm run logs:all

# Зупинка всіх сервісів
npm run stop:all

# Видалення всіх процесів з PM2
npm run delete:all
```

## 📦 Workspace скрипти

| Скрипт | Опис |
|--------|------|
| `npm run start:public` | Запуск публічного фронтенду |
| `npm run start:admin` | Запуск адмін панелі |
| `npm run start:api` | Запуск API сервера в режимі розробки |
| `npm run build:all` | Збірка всіх проєктів |
| `npm run start:all` | Запуск усіх сервісів через PM2 |

## 🏗️ Опис модулів

### public-mentorship
Публічна частина сайту для громадян. Angular 21, standalone components.
- **Порт:** 4200
- **Основний стек:** Angular 21, TypeScript, CSS

### admin-mentorship
Адміністративна панель для координаторів програми. Angular 21, standalone components з signal-based state management.
- **Порт:** 4201
- **Особливості:** Signal-based state (signal(), computed(), effect()), lazy loading

### mentorship-api
NestJS REST API для обслуговування обох фронтендів.
- **Порт:** 3000
- **Swagger UI:** http://localhost:3000/api/docs
- **Основні модулі:**
  - `/api/applications` — CRUD для заявок
  - `/api/mentors` — CRUD для менторів
  - `/api/mentees` — CRUD для підопічних
  - `/api/auth` — авторизація та реєстрація

### libs/shared-types
Спільна бібліотека TypeScript інтерфейсів та DTO.
- **Пакет:** `@mentor/shared-types`
- **Основні типи:**
  - `ApplicationDto` — заявка на менторство
  - `MentorDto` — ментор
  - `MenteeDto` — підопічний
  - `UserDto` — базовий користувач
  - `ApplicationStatus` — статуси заявок
  - `UserRole` — ролі користувачів

## 🔧 Додаткова інформація

### Налаштування змінних середовища

Для API створіть файл `.env` в директорії `mentorship-api/`:
```bash
cp mentorship-api/.env.example mentorship-api/.env
```

### Структура бази даних (заплановано)

- PostgreSQL — основна база даних
- Redis — кешування та сесії

### API Документація

Після запуску API сервера, Swagger UI доступний за адресою:
```
http://localhost:3000/api/docs
```

## 📝 Ліцензія

Проєкт розроблено для Державної служби зайнятості України.
