import { ConfigService } from '@nestjs/config';
import * as path from 'path';

/**
 * Конфігурація Sequelize з .env файлу
 */
export const sequelizeConfiguration = (configService: ConfigService) => ({
  dialect: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'password'),
  database: configService.get('DB_NAME', 'mentorship_db'),
  
  // Автоматичне створення таблиць (тільки для development!)
  synchronize: true,
  
  // Логування SQL запитів
  logging: configService.get('NODE_ENV') !== 'production'
    ? ((msg: string) => console.log(`[SQL] ${msg}`))
    : false,
  
  // Дорослі моделі з src/models/
  models: [path.join(__dirname, '../models/*.model.{ts,js}')],
  
  // Автоматичне додавання timestamp'ів
  timestamps: true,
  
  // Дефолтні опції для полів
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    paranoid: false, // Видалення замість м'якого видалення
  },
});
