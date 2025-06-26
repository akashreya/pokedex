export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://pokeapi.co/api/v2',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Pokedex',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Performance Monitoring
  enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false',
  enableErrorLogging: import.meta.env.VITE_ENABLE_ERROR_LOGGING !== 'false',
  
  // Analytics (configure these with your actual service keys)
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  
  // Cache Configuration
  cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxCacheSize: 50 * 1024 * 1024, // 50MB
  
  // Performance Budgets
  performanceBudgets: {
    CLS: 0.1,
    FID: 100,
    FCP: 1800,
    LCP: 2500,
    TTFB: 600
  }
};

export default config; 