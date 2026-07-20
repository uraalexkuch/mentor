/**
 * Роль адміністратора менторського проєкту
 */
export enum AdminRole {
  /** Суперадміністратор - повний доступ до всіх функцій */
  SUPER_ADMIN = 'SUPER_ADMIN',
  
  /** Регіональний модератор - модерує заявки свого регіону */
  REGIONAL_MODERATOR = 'REGIONAL_MODERATOR',
}
