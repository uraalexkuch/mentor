/**
 * Конфігурація API для admin-mentorship
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:3000', // URL backend API
  apiBaseUrl: 'http://localhost:3000/api',
  endpoints: {
    login: '/auth/login',
    profile: '/auth/me',
    admins: '/auth/admins',
  },
};
