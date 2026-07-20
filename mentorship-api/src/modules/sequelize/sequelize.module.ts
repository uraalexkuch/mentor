import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Application } from '../../models/application.model';
import { Consultation } from '../../models/consultation.model';
import { Certificate } from '../../models/certificate.model';
import { AdminUser } from '../../models/admin-user.model';
import { MentorshipPair } from '../../models/mentorship-pair.model';
import { Mentor } from '../../models/mentor.model';
import { Mentee } from '../../models/mentee.model';

/**
 * Модуль для ініціалізації Sequelize з автоматичним скануванням моделей
 */
@Module({})
export class SequelizeModule implements OnModuleInit {
  private sequelize: Sequelize | null = null;

  constructor(private configService: ConfigService) {
    // Ініціалізація відбувається в onModuleInit для уникнення помилок типу
  }

  async onModuleInit() {
    try {
      const dbHost = this.configService.get('DB_HOST', 'localhost');
      const dbPort = this.configService.get<number>('DB_PORT', 5432);
      const dbUsername = this.configService.get('DB_USERNAME', 'postgres');
      const dbPassword = this.configService.get('DB_PASSWORD', 'password');
      const dbName = this.configService.get('DB_NAME', 'mentorship_db');
      const isProduction = this.configService.get('NODE_ENV') === 'production';

      console.log(`🔌 Підключення до БД: ${dbHost}:${dbPort}/${dbName}`);

      this.sequelize = new Sequelize({
        dialect: 'postgres' as any,
        host: dbHost,
        port: dbPort,
        username: dbUsername,
        password: dbPassword,
        database: dbName,
        
        // Ручне реєстрування моделей замість автоматичного сканування
        models: [Application, Consultation, Certificate, AdminUser, MentorshipPair, Mentor, Mentee],
        
        // Логування
        logging: isProduction
          ? false
          : ((msg: string) => console.log(`[SQL] ${msg}`)) as any,
          
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });

      await this.sequelize.authenticate();
      console.log('✅ Підключення до БД встановлено!');
      
      // Синхронізація всіх моделей (створення/оновлення таблиць)
      await this.sequelize.sync({ alter: true });
      console.log('📊 Усі таблиці успішно синхронізовані!');
      
    } catch (error) {
      console.error('❌ Помилка підключення до БД:', error);
      throw error;
    }
  }

  getSequelize(): Sequelize {
    if (!this.sequelize) {
      throw new Error('Sequelize not initialized');
    }
    return this.sequelize;
  }
}
