/**
 * Environment configuration for production
 */
export const environment = {
  /** Application metadata */
  production: true,
  appName: 'Public Mentorship',
  appVersion: '0.0.0',

  /** API Configuration - Replace with actual production URL */
  apiBaseUrl: process.env.API_BASE_URL || '/api',
  
  /** API Endpoints */
  api: {
    auth: '/auth',
    qualifications: '/qualifications',
    applications: '/applications',
    providers: '/providers',
    base: '/base'
  },

  /** Auth Configuration */
  auth: {
    tokenKey: 'access_token',
    sessionTimeout: 1800000, // 30 minutes in production for security
    refreshTokenEnabled: true
  },

  /** UI Configuration */
  ui: {
    defaultLanguage: 'uk',
    supportedLanguages: ['uk'],
    breadcrumbEnabled: true,
    accessibilityPanelEnabled: true,
    scrollUpButtonEnabled: true
  },

  /** Feature Flags - Disabled in production */
  features: {
    consentDialogEnabled: true,
    phoneFormattingEnabled: true,
    regionFilteringEnabled: true,
    mockDataEnabled: false // Use real API in production
  },

  /** Logging Configuration - Minimal in production */
  logging: {
    enabled: true,
    verbose: false,
    logHttpRequests: false
  }
};
