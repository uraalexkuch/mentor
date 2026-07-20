import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Application } from '../../models/application.model';
import { Consultation } from '../../models/consultation.model';
import { Certificate } from '../../models/certificate.model';
import { Mentor } from '../../models/mentor.model';
import { Mentee } from '../../models/mentee.model';
import { MentorshipPair } from '../../models/mentorship-pair.model';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  
  @Get('data')
  @ApiOperation({ summary: 'Отримати дані для дашборду' })
  @ApiResponse({ status: 200, description: 'Дані дашборду' })
  async getDashboardData() {
    const totalApplications = await Application.count();
    const approvedApplications = await Application.count({ where: { status: 'підтверджено' } });
    
    const totalConsultations = await Consultation.count();
    
    const totalMentors = await Mentor.count();
    const activePairs = await MentorshipPair.count({ where: { status: 'IN_PROGRESS' } });
    
    const totalCertificates = await Certificate.count();

    // Chart data (mock for now, but dynamic from DB in real case)
    const applicationsByRegion = {
      labels: ['Київ', 'Львів', 'Одеса', 'Дніпро', 'Харків'],
      data: [45, 30, 20, 15, 14]
    };
    
    const statusData = {
      labels: ['Подано', 'Опрацьовується', 'Підтверджено', 'Відхилено'],
      data: [
        await Application.count({ where: { status: 'подано' } }),
        await Application.count({ where: { status: 'опрацьовується' } }),
        approvedApplications,
        await Application.count({ where: { status: 'відмовлено' } })
      ]
    };

    // Data for tables and charts
    const allApplications = await Application.findAll({ order: [['createdAt', 'DESC']] });
    const allMentors = await Mentor.findAll({ order: [['createdAt', 'DESC']] });
    const allMentees = await Mentee.findAll({ order: [['createdAt', 'DESC']] });
    const allPairs = await MentorshipPair.findAll({ order: [['createdAt', 'DESC']] });
    const allCertificates = await Certificate.findAll({ order: [['createdAt', 'DESC']] });
    const allConsultations = await Consultation.findAll({ order: [['createdAt', 'DESC']] });

    return {
      stats: {
        totalApplications,
        approvedApplications,
        totalConsultations,
        totalMentors,
        activePairs,
        totalCertificates
      },
      charts: {
        applicationsByRegion,
        statusData
      },
      recent: {
        applications: allApplications,
        mentors: allMentors,
        mentees: allMentees,
        pairs: allPairs,
        certificates: allCertificates,
        consultations: allConsultations
      }
    };
  }
}
