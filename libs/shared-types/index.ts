/**
 * Спільні DTO-інтерфейси для системи менторства Державної служби зайнятості
 * Програма підтримки молодих підприємців (Постанова №472)
 * 
 * СУВОРІ ОБМЕЖ��ННЯ:
 * - Цільова аудиторія: 18-25 років
 * - Навчання: макс. 6 тижнів (30 годин), групи по 30 осіб
 * - Чекбокси замість текстових полів для потреб/навичок
 * - ЗАБОРОНЕНО: КЕКВ, ручний аналіз за Постановою 738
 */

// ==================== ENUMS ====================

/** Статуси заявок згідно з бізнес-правилами ДЦЗ */
export enum ApplicationStatus {
  SUBMITTED = 'подано',
  IN_PROCESSING = 'опрацьовується',
  CONFIRMED = 'підтверджено',
  RESERVE = 'резерв',
  REJECTED = 'відмовлено',
  COMPLETED = 'завершено навчання',
  CONSULTATION_DATE = 'дата консультації'
}

/** Типи потреб учасників */
export enum ParticipantNeed {
  TRAINING = 'Навчання',
  MENTORSHIP_SUPPORT = 'Менторська підтримка',
  PRACTICAL_HELP = 'Практична допомога',
  MICROGRANT_MENTORSHIP = 'Менторство для мікрогранту'
}

/** Теми онлайн-консультації */
export enum ConsultationTopic {
  GOVERNMENT_PROGRAMS = 'Державні програми',
  GRANT_SELECTION = 'Підбір грантів',
  MENTORSHIP_SUPPORT = 'Менторський супровід',
  OTHER = 'Інше'
}

export type ApplicationType = '' | 'TRAINING' | 'OFFICE_CONSULTATION' | 'MENTORSHIP' | 'VETERAN_MENTORSHIP';

/** Роки отримання мікрогранту */
export type MicrograntYear = `${number} рік`;

// ==================== HELPERS ====================

/** Перевірка віку: 18-25 років */
export function isEligibleAge(birthDate: Date): boolean {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18 && age <= 25;
}

/** Валідація номера сертифіката: ХХХХХХХХ/УУ-ZZ */
export function isValidCertificateNumber(number: string): boolean {
  const regex = /^\d{8}\/\d{2}-\d{2}$/;
  return regex.test(number);
}

/** Генерація номера сертифіката: ХХХХХХХХ/УУ-ZZ */
export function generateCertificateNumber(edrpoU: string, year: number): string {
  const yearDigits = String(year).slice(-2);
  const randomPart = Math.floor(Math.random() * 90000000 + 10000000).toString();
  const lastTwoDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${randomPart}/${yearDigits}-${lastTwoDigits}`;
}

// ==================== MENTORSHIP APPLICATION DTO ====================

/** Заявка на участь у заходах для молодих підприємців */
export interface MentorshipApplicationDto {
  id: string;
  
  // === Особисті дані ===
  fullName: string;                    // ПІБ повністю
  birthDate: string;                   // Дата народження (ISO)
  passportSeries: string;              // Серія паспорта
  passportNumber: string;              // Номер паспорта
  rnokpp: string;                      // РНОКПП
  rnokppRefusalNote?: string;          // Відмітка про відмову вказати РНОКПП
  phone: string;                       // Телефон
  email: string;                       // Email
  regionCode: string;                  // Код регіону
  employmentCenterId: string;          // ID центру зайнятості
  
  // === Інформація про бізнес ===
  isBusinessActive: boolean;           // Чи діючий підприємець (Так/Ні)
  receivedMicrogrant: boolean;         // Чи отримували мікрогрант "Власна справа" (Так/Ні)
  micrograntYear?: MicrograntYear;     // Рік отримання мікрогранту ("2022 рік", "2023 рік"...)
  primaryBusinessActivity?: string;    // Основний вид діяльності
  
  // === Пільгові категорії ===
  isIDP: boolean;                      // ВПО
  hasDisability: boolean;              // Особа з інвалідністю
  
  // === Ветеранські категорії ===
  isCombatant: boolean;                // УБД
  isWarDisabled: boolean;              // Особа з інвалідністю внаслідок війни
  isFamilyMember: boolean;             // Член сім'ї
  isVeteranEnterprise: boolean;        // Ветеранське підприємництво
  
  // === Дані ветерана (для членів сім'ї) ===
  veteranFullName?: string;
  veteranRnokpp?: string;
  veteranContactInfo?: string;
  
  // === Потреби (ТІЛЬКИ ЧЕКБОКСИ) ===
  needs: {
    training: boolean;                 // Навчання
    mentorshipSupport: boolean;        // Менторська підтримка
    practicalHelp: boolean;            // Практична допомога
    micrograntMentorship: boolean;     // Менторство для мікрогранту
  };
  
  // === Метадані ===
  status: ApplicationStatus;
  createdAt: string;                   // Дата створення (ISO)
  updatedAt?: string;                  // Дата оновлення (ISO)
  certificateNumber?: string;          // Номер сертифіката (ХХХХХХХХ/УУ-ZZ)
}

// ==================== CONSULTATION ORDER DTO ====================

/** Форма замовлення онлайн-консультації */
export interface ConsultationOrderDto {
  id: string;
  
  // === Особисті дані ===
  fullName: string;                    // ПІБ повністю
  birthDate: string;                   // Дата народження (ISO)
  phone: string;                       // Телефон
  email: string;                       // Email
  regionCode: string;                  // Код рег��ону
  
  // === Інформація про бізнес ===
  isBusinessActive: boolean;           // Чи бізнес діючий (Так/Ні)
  businessInactiveReason?: string;     // Текстова причина (якщо Ні)
  
  // === Напрям підтримки ===
  applicationType: ApplicationType;
  officeConsultationTopics?: {
    businessPlans: boolean;
    personnel: boolean;
    creditPrograms: boolean;
    stateCompensations: boolean;       // Державні компенсації
  };
  otherTopicDescription?: string;      // Опис для теми "Інше" (якщо потрібно)
  consultationResult?: string;         // Результат консультації
  consultantName?: string;             // Ім'я фахівця
  
  // === Бажана дата консультації ===
  preferredDate: string;               // Бажана дата (ISO)
  
  // === Метадані ===
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string;
}

// ==================== CERTIFICATE REGISTRY DTO ====================

/** Елемент реєстру сертифікатів */
export interface CertificateRegistryItemDto {
  id: string;
  
  year: number;                        // Рок видачі
  institutionName: string;             // Назва закладу
  edrpoUCode: string;                  // Код ЄДРПОУ
  
  certificateNumber: string;           // Реєстраційний номер (ХХХХХХ��Х/УУ-ZZ)
  
  participantFullName: string;         // ПІБ підприємця
  programName: string;                 // Назва програми
  
  issueDate: string;                   // Дата видачі (ISO)
  
  region?: string;                     // Регіон
  note?: string;                       // Примітка
}

// ==================== USER DTO (для авторизації) ====================

export enum UserRole {
  ADMIN = 'admin',
  COORDINATOR = 'coordinator',
  MENTOR = 'mentor',
  MENTEE = 'mentee'
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  role: UserRole;
  regionCode?: string;
  isActive: boolean;
  createdAt: string;
}

// ==================== MENTOR DTO ====================

export interface MentorDto extends UserDto {
  role: UserRole.MENTOR;
  
  specialization: string;
  experienceYears: number;
  rating: number;                    // 0-5
  maxActiveMentees: number;          // Макс. кількість підопічних
  isAvailable: boolean;
  organizationType: string;          // Класифікація (ГО, бізнес, заклад освіти)
  isVolunteer: boolean;              // Підтвердження безоплатної основи
}

// ==================== MENTORSHIP PAIR DTO ====================

export enum MentorshipStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface MentorshipPairDto {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MentorshipStatus;
  createdAt: string;
  updatedAt?: string;
}

// ==================== MENTEE DTO ====================

export interface MenteeDto extends UserDto {
  role: UserRole.MENTEE;
  
  profession: string;
  desiredSpecialization: string;
  businessType: 'existing' | 'planned'; // Діючий / Планований бізнес
}

// ==================== MENTORSHIP SESSION DTO ====================

export enum SessionStatus {
  PLANNED = 'планується',
  ACTIVE = 'активна',
  COMPLETED = 'завершена',
  CANCELLED = 'скасована'
}

export interface MentorshipSessionDto {
  id: string;
  mentorId: string;
  menteeId: string;
  applicationId: string;
  
  startDate: string;                 // Дата початку (ISO)
  endDate?: string;                  // Дата завершення (ISO)
  
  totalHours: number;                // Загальна кількість годин (макс. 30)
  completedHours: number;            // Виконані години
  
  status: SessionStatus;
  
  createdAt: string;
}

// ==================== GROUP DTO ====================

/** Група навчання (до 30 осіб) */
export interface TrainingGroupDto {
  id: string;
  name: string;
  maxParticipants: number;           // Макс. 30
  currentParticipants: number;       // Поточна кількість
  
  startDate: string;
  endDate: string;                   // Макс. 6 тижнів від startDate
  
  mentorId?: string;
  
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}
