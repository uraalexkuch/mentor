/**
 * PM2 ecosystem configuration для монорепозиторію менторства
 * Державна служба зайнятості (Постанова №472)
 */

module.exports = {
  apps: [
    // ============================================
    // BACKEND API (NestJS)
    // ============================================
    {
      name: 'mentorship-api',
      script: 'npm',
      args: 'run start:prod',
      cwd: './mentorship-api',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        API_PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'password',
        DB_NAME: 'mentorship_db',
        JWT_SECRET: 'mentorship-secret-key-change-in-production'
      },
      env_development: {
        NODE_ENV: 'development',
        API_PORT: 3000
      },
      error_file: './logs/api-err.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '512M'
    },

    // ============================================
    // PUBLIC FRONTEND (Angular)
    // ============================================
    {
      name: 'public-mentorship',
      script: 'npm',
      args: 'run start',
      cwd: './public-mentorship',
      env: {
        NODE_ENV: 'production',
        PORT: 4200
      },
      error_file: './logs/public-err.log',
      out_file: './logs/public-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '256M'
    },

    // ============================================
    // ADMIN FRONTEND (Angular)
    // ============================================
    {
      name: 'admin-mentorship',
      script: 'npm',
      args: 'run start',
      cwd: './admin-mentorship',
      env: {
        NODE_ENV: 'production',
        PORT: 4201
      },
      error_file: './logs/admin-err.log',
      out_file: './logs/admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '256M'
    }
  ],

  // Deploy configuration (опціонально)
  deploy: {
    production: {
      user: 'app',
      host: ['192.168.1.100'],
      ref: 'main',
      repo: 'git@github.com:username/mentor-monorepo.git',
      path: '/var/www/mentor',
      'post-deploy': 'npm install && npm run build:all && pm2 reload ecosystem.config.js --env production'
    }
  }
};
