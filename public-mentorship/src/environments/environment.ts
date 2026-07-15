/**
 * Environment configuration for development
 */
export const environment = {
  /** Application metadata */
  production: false,
  appName: 'Public Mentorship',
  appVersion: '0.0.0-dev',

  /** API Configuration */
  apiBaseUrl: 'http://localhost:3001/api',
  
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
    sessionTimeout: 3600000, // 1 hour in milliseconds
    refreshTokenEnabled: false
  },

  /** UI Configuration */
  ui: {
    defaultLanguage: 'uk',
    supportedLanguages: ['uk', 'en'],
    breadcrumbEnabled: true,
    accessibilityPanelEnabled: true,
    scrollUpButtonEnabled: true
  },

  /** Feature Flags */
  features: {
    consentDialogEnabled: true,
    phoneFormattingEnabled: true,
    regionFilteringEnabled: true,
    mockDataEnabled: true // Use mock data until real API is connected
  },

  /** Logging Configuration */
  logging: {
    enabled: true,
    verbose: true,
    logHttpRequests: true
  }
};
