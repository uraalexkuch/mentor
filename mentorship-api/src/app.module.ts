import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsModule } from './modules/applications/applications.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { MenteesModule } from './modules/mentees/mentees.module';
import { AuthModule } from './modules/auth/auth.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { ApplicationEntity } from './modules/applications/entities/application.entity';
import { ConsultationEntity } from './modules/consultations/entities/consultation.entity';
import { CertificateEntity } from './modules/certificates/entities/certificate.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // TypeORM конфігурація з .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'mentorship_db'),
        entities: [ApplicationEntity, ConsultationEntity, CertificateEntity],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),

    // Модулі проєкту
    AuthModule,
    ApplicationsModule,
    ConsultationsModule,
    CertificatesModule,
    MentorsModule,
    MenteesModule,
  ],
})
export class AppModule {}
