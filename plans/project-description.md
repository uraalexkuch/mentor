# Опис проекту: `public-mentorship`

## 1. Загальна інформація

| Параметр | Значення |
|----------|----------|
| **Назва** | `public-frontend` (пакет: `public-mentorship`) |
| **Тип** | Однострінковий веб-додаток (SPA) |
| **Фреймворк** | Angular 19 (standalone components) |
| **Мова** | TypeScript 5.6 |
| **UI-бібліотека** | Angular Material 19, Bootstrap 5.3 |
| **Іконки** | FontAwesome 6 |
| **Додаткові бібліотеки** | `xng-breadcrumb` (навігаційні крихти), `ngx-device-detector` (визначення типу пристрою) |
| **Порт розробки** | `http://localhost:4200` |

## 2. Призначення

Додаток призначений для надання публічних послуг з профнавчання та менторської підтримки від [Державної служби України з питань зайнятості (ДЦЗ)](https://dcz.gov.ua). Основні функції:

- **Інформування** про освітні програми з підприємницької діяльності.
- **Реєстрація** на програми менторського супроводу та отримання мікрогранту "Власна справа".
- **Пошук регіональних офісів** ДЦЗ для отримання очних консультацій.
- **Замовлення онлайн-консультацій** в обраних офісах.

## 3. Архітектура додатку

### 3.1 Структура каталогів

```
public-mentorship/
├── src/
│   ├── app/
│   │   ├── app.component.ts              # Кореневий компонент (Shell)
│   │   ├── app.config.ts                  # Конфігурація додатку (providers)
│   │   ├── app.routes.ts                  # Маршрутизація
│   │   ├── components/                    # Переиспользувані компоненти
│   │   │   ├── dialog-intern-confirm/     # Діалог підтвердження стажування
│   │   │   └── scroll-up/                 # Кнопка "Вгору"
│   │   ├── interceptors/                  # HTTP-інтерептори
│   │   │   └── auth.interceptor.ts        # Додавання JWT токену до запитів
│   │   ├── pages/                         # Сторінки додатку
│   │   │   └── profnavch/
│   │   │       ├── consent-dialog/        # Діалог згоди на обробку даних
│   │   │       └── dcz-mentorship/        # Модуль менторської підтримки
│   │   │           ├── dcz-mentorship-consultregion-base/
│   │   │           ├── dcz-mentorship-consultregion-header/
│   │   │           ├── dcz-mentorship-consultregion-info/
│   │   │           ├── dcz-mentorship-consultregion-main/
│   │   │           ├── forms/
│   │   │           │   ├── consultation-form/
│   │   │           │   └── mentorship-program/
│   │   │           └── mentorship-registration/
│   │   ├── services/                      # Сервіси
│   │   │   ├── accessibility.service.ts   # Сервіс доступності
│   │   │   ├── auth.service.ts            # Сервіс авторизації (JWT)
│   │   │   └── opk.service.ts             # Сервіс ОПК
│   │   └── standart/                      # Стандартні компоненти (шаблонізація)
│   │       ├── dcz-footer-full/           # Футер сайту ДЦЗ
│   │       └── dcz-head-new/              # Хедер сайту ДЦЗ
│   ├── assets/                            # Статичні ресурси (шрифти, зображення, JSON)
│   └── main.ts                            # Точка входу
├── angular.json                           # Конфігурація Angular CLI
└── package.json                           # Залежності проекту
```

### 3.2 Кореневий компонент (Shell)

[`app.component.ts`](public-mentorship/src/app/app.component.ts:1) — це "обгортка" (Layout Shell), яка містить:

- `<app-dcz-head-new>` — хедер з навігаційним меню та сайдбаром.
- `<router-outlet></router-outlet>` — динамічний вміст сторінок.
- `<app-dcz-footer-full>` — футер з контактами та посиланнями.

### 3.3 Конфігурація (`app.config.ts`)

```typescript
provideRouter(routes),
provideAnimationsAsync(),
provideHttpClient(withInterceptors([authInterceptor]))
```

## 4. Маршрутизація

| Шлях | Ко��понент | Опис |
|------|-----------|------|
| `/profnavch/mentorship` | [`MentorshipProgramComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/forms/mentorship-program/mentorship-program.component.ts:1) | Головна сторінка програми менторства. Містить реєстр освітніх програм, FAQ та юридичні посилання. |
| `/profnavch/mentorship/register` | [`MentorshipRegistrationComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/mentorship-registration/mentorship-registration.component.ts:1) | Багатокрокова форма реєстрації (Wizard). Збирає персональні дані, статус бізнесу та деталізацію запиту. |
| `/profnavch/mentorship/consultants` | [`DczMentorshipConsultregionMainComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/dcz-mentorship-consultregion-main/dcz-mentorship-consultregion-main.component.ts:1) | Сторінка консультантів. Сайдбар з областями + список офісів ДЦЗ. |
| `/profnavch/mentorship/consultation-form` | [`ConsultationFormComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/forms/consultation-form/consultation-form.component.ts:1) | Форма замовлення індивідуальної онлайн-консультації. |
| `**` (інші) | Redirect | Перенаправлення на `/profnavch/mentorship`. |

### 4.1 Діаграма маршрутизації (Mermaid)

```mermaid
graph TD
    A[URL] --> B{Шлях}
    B -->|/profnavch/mentorship| C[MentorshipProgramComponent]
    B -->|/profnavch/mentorship/register| D[MentorshipRegistrationComponent]
    B -->|/profnavch/mentorship/consultants| E[DczMentorshipConsultregionMainComponent]
    B -->|/profnavch/mentorship/consultation-form| F[ConsultationFormComponent]
    B -->|інші шляхи| C

    C -->|Кнопка "Реєстрація"| D
    D -->|Тип запиту: Консультація| E
    E -->|Кнопка "Замовити"| F
```

## 5. Основні компоненти та їх функції

### 5.1 [`MentorshipProgramComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/forms/mentorship-program/mentorship-program.component.ts:25)

**Призначення:** Інформаційна сторінка програми менторства.

**Дані (хардкод):**
- `dataSourceProf`: Таблиця освітніх програм (назва, тривалість, формат).
- `faq`: Розгорнуті відповіді на запитання (Mat Expansion).
- `legalLinks`: Посилання на законодавчі акти.

### 5.2 [`MentorshipRegistrationComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/mentorship-registration/mentorship-registration.component.ts:41)

**Призначення:** Багатокрокова форма реєстрації (Mat Stepper).

**Кроки форми:**
1. **Ідентифікація:** ПІБ, дата народження, РНОКПП, телефон, email, область.
2. **Статус та Вибір напрямку:** Чи є бізнес активним? Автоматичний вибір типу запиту (`MENTORSHIP` або `OFFICE_CONSULTATION`).
3. **Деталізація (Динамічна):**
   - Для Менторства: потреба в навчанні, підтримці, статус молодшого підприємця.
   - Для Консультації: тема бажана дата.

**Особливості:**
- Динамічна валідація полів залежно від типу запиту.
- Автоматичне форматування номера телефону (`+38 (XXX) XXX-XX-XX`).
- Відкриття діалогу [`ConsentDialogComponent`](public-mentorship/src/app/pages/profnavch/consent-dialog/consent-dialog.component.ts) для згоди на обробку персональних даних.
- Payload формується відповідно до цільових ідентифікаторів корпоративної БД (поля `dcz_application_type`, `dcz_applicant_lastname` тощо).

### 5.3 [`DczMentorshipConsultregionMainComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/dcz-mentorship-consultregion-main/dcz-mentorship-consultregion-main.component.ts:25)

**Призначення:** Сторінка з реєстром регіональних офісів ДЦЗ.

**Функціонал:**
- Фільтрація офісів за кодом області (через `queryParams`).
- Відображення списку офісів (назва, адреса, телефон, email).
- Кнопка "Замовити консультацію", яка перенаправляє на [`ConsultationFormComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/forms/consultation-form/consultation-form.component.ts:1) з передачею даних офісу через `router.navigate` `state`.

**Дані:**
- `regionsList`: Список областей з кодами (UA05, UA07 тощо).
- `allOffices`: Масив об'єктів `Office` (хардкод-дані для 16 офісів).

### 5.4 [`ConsultationFormComponent`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/forms/consultation-form/consultation-form.component.ts:13)

**Призначення:** Форма замовлення індивідуальної онлайн-консультації.

**Дані форми:**
- Пер��ональні дані (ПІБ, дата народження, телефон, email).
- Статус бізнесу та причина неактивності.
- Темы консультацій (держпрограми, підбір грантів, менторський супровід, інше).
- Бажана дата консультації.

**Особливості:**
- Автозаповнення даних з `history.state` (якщо користувач прийшов з форми реєстрації).
- Валідація перед відправкою (`isFormValid`).

### 5.5 [`DczHeadNewComponent`](public-mentorship/src/app/standart/dcz-head-new/dcz-head-new.component.ts:44)

**Призначення:** Хедер сайту з навігаційним меню.

**Елементи:**
- Меню: "Про нас", "Діяльність", "Зроблено в Україні", "Прес-центр", "Контакти".
- Список регіональних сайтів ДЦЗ (25 областей + м. Київ).
- Підтримка мобільних пристроїв (`MatSidenav`).
- Інтеграція з [`AccessibilityService`](public-mentorship/src/app/services/accessibility.service.ts) для налаштувань доступності.

### 5.6 [`DczFooterFullComponent`](public-mentorship/src/app/standart/dcz-footer-full/dcz-footer-full.component.ts:14)

**Призначення:** Футер сайту з контактами та посиланнями.
Визначає тип пристрою (мобільний/планшет) через `DeviceDetectorService`.

## 6. Сервіси та Інтерептори

### 6.1 [`AuthService`](public-mentorship/src/app/services/auth.service.ts:8)

**Призначення:** Управління сесією користувача (JWT).

| Метод | Опис |
|-------|------|
| `login(credentials)` | Авторизація, збереження токену в `localStorage`. |
| `register(data)` | Реєстрація нового користувача. |
| `logout()` | Очищення токена та сесії. |
| `checkToken()` | Перевірка валідності токена при ініціалізації. |

**API Endpoint:** `http://localhost:3001/api/auth` (локальний mock-сервер).

### 6.2 [`authInterceptor`](public-mentorship/src/app/interceptors/auth.interceptor.ts:8)

**Призначення:** HTTP-інтерептор для автоматичного додавання `Bearer` токена до всіх запитів.
Обробляє помилки `401` (автоматичний вихід та перенаправлення на `/login`).

### 6.3 [`AccessibilityService`](public-mentorship/src/app/services/accessibility.service.ts)

**Призначення:** Надан��я налаштувань доступності (зміна розміру шрифту, контрастність тощо) для відповідності до стандартів WCAG.

## 7. Стилі та Зовнішні залежності

- **CSS Framework:** Bootstrap 5.3 (`bootstrap/dist/css/bootstrap.min.css`).
- **Material Theme:** Indigo/Pink (`@angular/material/prebuilt-themes/indigo-pink.css`).
- **Іконки:** FontAwesome 6 (`@fortawesome/fontawesome-free/css/all.css`).
- **Шрифти:** Власні шрифти `e-Ukraine`, `Mulish`, `PTSans` (у форматі `.ttf`).

## 8. Статичні дані (`src/assets/data/`)

Проект містить JSON-файли для конфігурації та довідників:

| Файл | Призначення |
|------|-------------|
| `classifikator.json` | Класифікатори (типи освіти, організації, родины діяльності). |
| `obl.json`, `oblcontact.json` | Довідник областей та контактів. |
| `region.json` | Регіональні дані. |
| `prof.json` | Професійні класифікатори. |
| `docosvita.json`, `osvita.json` | Рівні освіти. |
| `banner.json` | Конфігурація банерів. |

## 9. Поточний стан та Примітки

1. **Дані зафіксовані в коді (Hardcoded):** Списки офісів, освітніх програм та FAQ знаходяться безпосередньо в TypeScript-компонентах. В майбутньому передбачено перенесення до API або JSON-файлів.
2. **Імітація бекенду:** `AuthService` вказує на `http://localhost:3001`, що свідчить про використання Firebase/Supabase або Node.js mock-сервера. Реальна інтеграція з БД ще не завершена (див. `console.log` у [`MentorshipRegistrationComponent.onSubmit()`](public-mentorship/src/app/pages/profnavch/dcz-mentorship/mentorship-registration/mentorship-registration.component.ts:230)).
3. **Формування Payload:** Структура даних форми реєстрації вже підготовлена до відправки в корпоративну БД ДЦЗ (префікси `dcz_`).
