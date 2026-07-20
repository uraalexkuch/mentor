import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Mentor } from './models/mentor.model';
import { Mentee } from './models/mentee.model';
import { MentorshipPair } from './models/mentorship-pair.model';
import { Application } from './models/application.model';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('🌱 Очищення бази даних (ментори, підопічні, пари, заявки)...');
  await MentorshipPair.destroy({ where: {} });
  await Mentor.destroy({ where: {} });
  await Mentee.destroy({ where: {} });
  // await Application.destroy({ where: {} }); // We will only inject some mock data if applications are empty

  console.log('🌱 Наповнення бази даних моковими даними...');

  const mentors = await Mentor.bulkCreate([
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'ivan.m@example.com',
      firstName: 'Іван',
      lastName: 'Петренко',
      specialization: 'Маркетинг та PR',
      experienceYears: 8,
      rating: 4.8,
      maxActiveMentees: 5,
      isAvailable: true,
      organizationType: 'Бізнес',
      isVolunteer: true,
      isActive: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'olena.k@example.com',
      firstName: 'Олена',
      lastName: 'Коваленко',
      specialization: 'Фінанси',
      experienceYears: 12,
      rating: 5.0,
      maxActiveMentees: 3,
      isAvailable: false,
      organizationType: 'NGO',
      isVolunteer: true,
      isActive: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      email: 's.bondar@example.com',
      firstName: 'Сергій',
      lastName: 'Бондар',
      specialization: 'IT та технології',
      experienceYears: 5,
      rating: 4.5,
      maxActiveMentees: 4,
      isAvailable: true,
      organizationType: 'Бізнес',
      isVolunteer: false,
      isActive: true,
    }
  ]);

  const mentees = await Mentee.bulkCreate([
    {
      id: '550e8400-e29b-41d4-a716-446655440101',
      email: 'mentee1@example.com',
      firstName: 'Анна',
      lastName: 'Шевченко',
      profession: 'Дизайнер',
      desiredSpecialization: 'Маркетинг',
      businessType: 'planned',
      isActive: true,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440102',
      email: 'mentee2@example.com',
      firstName: 'Петро',
      lastName: 'Іванов',
      profession: 'Програміст',
      desiredSpecialization: 'IT',
      businessType: 'existing',
      isActive: true,
    }
  ]);

  await MentorshipPair.bulkCreate([
    {
      id: '550e8400-e29b-41d4-a716-446655440201',
      mentorId: mentors[0].id,
      menteeId: mentees[0].id,
      status: 'IN_PROGRESS',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440202',
      mentorId: mentors[2].id,
      menteeId: mentees[1].id,
      status: 'PLANNING',
    }
  ]);
  
  const applicationsCount = await Application.count();
  if (applicationsCount === 0) {
    await Application.bulkCreate([
      {
        fullName: 'Олександр Сидоренко',
        birthDate: new Date('1990-05-15'),
        passportSeries: 'AB',
        passportNumber: '123456',
        phone: '+380501234567',
        email: 'alex@example.com',
        regionCode: 'Київ',
        isBusinessActive: false,
        receivedMicrogrant: false,
        applicantCategories: ['ВПО'],
        needsTraining: true,
        status: 'підтверджено',
      },
      {
        fullName: 'Марія Ковальчук',
        birthDate: new Date('1985-11-20'),
        passportSeries: 'CD',
        passportNumber: '987654',
        phone: '+380671234567',
        email: 'maria@example.com',
        regionCode: 'Львів',
        isBusinessActive: true,
        receivedMicrogrant: true,
        micrograntYear: '2023',
        primaryBusinessActivity: 'Торгівля',
        applicantCategories: ['УБД', 'ВПО'],
        needsMentorshipSupport: true,
        status: 'опрацьовується',
      }
    ]);
  }

  console.log('✅ Базу даних успішно наповнено!');
  await app.close();
  process.exit(0);
}

bootstrap().catch(err => {
  console.error('❌ Помилка наповнення бази даних:', err);
  process.exit(1);
});
