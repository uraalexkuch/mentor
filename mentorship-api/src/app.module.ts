import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from './modules/sequelize/sequelize.module';

// Модулі проєкту
import { ApplicationsModule } from './modules/applications/applications.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { MenteesModule } from './modules/mentees/mentees.module';
import { AuthModule } from './modules/auth/auth.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { MentorshipPairsModule } from './modules/mentorship-pairs/mentorship-pairs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    // Модуль конфігурації (завантажує .env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Sequelize модуль з автоматичним скануванням моделей
    SequelizeModule,

    // Модулі проєкту
    AuthModule,
    ApplicationsModule,
    ConsultationsModule,
    CertificatesModule,
    MentorsModule,
    MenteesModule,
    MentorshipPairsModule,
    DashboardModule,
  ],
})
export class AppModule {}
