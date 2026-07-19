import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationStatus, MentorshipApplicationDto, ConsultationOrderDto, CertificateRegistryItemDto } from '@mentor/shared-types';

export interface DashboardStatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  ApplicationStatus = ApplicationStatus;
  today = new Date();

  // Mock data - в реальном приложении будет приходить с API
  applications = signal<MentorshipApplicationDto[]>([
    {
      id: '1', fullName: 'Іванов Петро Миколайович', birthDate: '2001-05-15',
      passportSeries: 'AB123456', passportNumber: '789012', rnokpp: '1234567890',
      phone: '+380501234567', email: 'ivanov@example.com', regionCode: '46',
      employmentCenterId: 'ec-001', isBusinessActive: true, receivedMicrogrant: false,
      primaryBusinessActivity: 'IT-консалтинг',
      needs: { training: true, mentorshipSupport: true, practicalHelp: false, micrograntMentorship: false },
      status: ApplicationStatus.SUBMITTED, createdAt: '2025-07-15T10:30:00Z'
    },
    {
      id: '2', fullName: 'Коваленко Марія Ігорівна', birthDate: '2000-08-22',
      passportSeries: 'CD234567', passportNumber: '890123', rnokpp: '2345678901',
      phone: '+380672345678', email: 'kovalenko@example.com', regionCode: '08',
      employmentCenterId: 'ec-002', isBusinessActive: false, receivedMicrogrant: true,
      micrograntYear: '2024 рік', primaryBusinessActivity: 'Кулінарія',
      needs: { training: false, mentorshipSupport: true, practicalHelp: true, micrograntMentorship: true },
      status: ApplicationStatus.IN_PROCESSING, createdAt: '2025-07-14T14:20:00Z'
    },
    {
      id: '3', fullName: 'Шевченко Олександр Васильович', birthDate: '1999-03-10',
      passportSeries: 'EF345678', passportNumber: '901234', rnokpp: '3456789012',
      phone: '+380933456789', email: 'shevchenko@example.com', regionCode: '14',
      employmentCenterId: 'ec-003', isBusinessActive: true, receivedMicrogrant: false,
      primaryBusinessActivity: 'Виробництво',
      needs: { training: true, mentorshipSupport: false, practicalHelp: true, micrograntMentorship: false },
      status: ApplicationStatus.CONFIRMED, createdAt: '2025-07-13T09:15:00Z'
    },
    {
      id: '4', fullName: 'Бондаренко Анна Сергіївна', birthDate: '2002-11-05',
      passportSeries: 'GH456789', passportNumber: '012345', rnokpp: '4567890123',
      phone: '+380664567890', email: 'bondarenko@example.com', regionCode: '30',
      employmentCenterId: 'ec-004', isBusinessActive: true, receivedMicrogrant: false,
      primaryBusinessActivity: 'Торгівля',
      needs: { training: true, mentorshipSupport: true, practicalHelp: true, micrograntMentorship: true },
      status: ApplicationStatus.REJECTED, createdAt: '2025-07-12T16:45:00Z'
    },
    {
      id: '5', fullName: 'Ткаченко Дмитро Олексійович', birthDate: '2001-01-20',
      passportSeries: 'IJ567890', passportNumber: '123456', rnokpp: '5678901234',
      phone: '+380995678901', email: 'tkachenko@example.com', regionCode: '68',
      employmentCenterId: 'ec-005', isBusinessActive: true, receivedMicrogrant: true,
      micrograntYear: '2025 рік', primaryBusinessActivity: 'Сільське господарство',
      needs: { training: false, mentorshipSupport: false, practicalHelp: false, micrograntMentorship: true },
      status: ApplicationStatus.COMPLETED, createdAt: '2025-07-11T11:00:00Z'
    }
  ]);

  consultations = signal<ConsultationOrderDto[]>([
    {
      id: 'c1', fullName: 'Сидоренко Віктор Олегович', birthDate: '2000-06-15',
      phone: '+380501112233', email: 'sidorenko@example.com', regionCode: '26',
      isBusinessActive: true,
      applicationType: 'TRAINING',
      preferredDate: '2025-08-01', status: ApplicationStatus.CONSULTATION_DATE, createdAt: '2025-07-16T09:00:00Z'
    },
    {
      id: 'c2', fullName: 'Поліщук Юлія Андріївна', birthDate: '2001-09-28',
      phone: '+380674445566', email: 'polishchuk@example.com', regionCode: '32',
      isBusinessActive: false, businessInactiveReason: 'Закрила ФОП 2024 року',
      applicationType: 'OFFICE_CONSULTATION',
      otherTopicDescription: 'Допомога з відновленням бізнесу',
      preferredDate: '2025-08-05', status: ApplicationStatus.SUBMITTED, createdAt: '2025-07-16T14:30:00Z'
    }
  ]);

  certificates = signal<CertificateRegistryItemDto[]>([
    {
      id: 'cert1', year: 2025, institutionName: 'Коледж технологій Київ',
      edrpoUCode: '12345678', certificateNumber: '12345678/25-01',
      participantFullName: 'Ментор Іван Петрович', programName: 'Осноки менторства',
      issueDate: '2025-06-15'
    },
    {
      id: 'cert2', year: 2025, institutionName: 'Одеський навчальний центр',
      edrpoUCode: '87654321', certificateNumber: '87654321/25-02',
      participantFullName: 'Ментор Сидор Братієвич', programName: 'Фінансова грамотність',
      issueDate: '2025-06-20'
    }
  ]);

  // Computed signals для статистики
  totalApplications = computed(() => this.applications().length);
  totalConsultations = computed(() => this.consultations().length);
  totalCertificates = computed(() => this.certificates().length);

  submittedCount = computed(() =>
    this.applications().filter(a => a.status === ApplicationStatus.SUBMITTED).length
  );

  processingCount = computed(() =>
    this.applications().filter(a => a.status === ApplicationStatus.IN_PROCESSING).length
  );

  confirmedCount = computed(() =>
    this.applications().filter(a => a.status === ApplicationStatus.CONFIRMED).length
  );

  completedCount = computed(() =>
    this.applications().filter(a => a.status === ApplicationStatus.COMPLETED).length
  );

  rejectionCount = computed(() =>
    this.applications().filter(a => a.status === ApplicationStatus.REJECTED).length
  );

  completionRate = computed(() => {
    const total = this.totalApplications();
    if (total === 0) return 0;
    const completed = this.completedCount();
    return Math.round((completed / total) * 100);
  });

  // Останні 5 заявок для preview на дашборді
  recentApplications = computed(() =>
    [...this.applications()]
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 5)
  );

  getStatusLabel(status: ApplicationStatus): string {
    const labels: Record<ApplicationStatus, string> = {
      [ApplicationStatus.SUBMITTED]: 'Подано',
      [ApplicationStatus.IN_PROCESSING]: 'Опрацьовується',
      [ApplicationStatus.CONFIRMED]: 'Підтверджено',
      [ApplicationStatus.RESERVE]: 'Резерв',
      [ApplicationStatus.REJECTED]: 'Відмовлено',
      [ApplicationStatus.COMPLETED]: 'Завершено навчання',
      [ApplicationStatus.CONSULTATION_DATE]: 'Дата консультації'
    };
    return labels[status];
  }

  getStatusClass(status: ApplicationStatus): string {
    const classes: Record<ApplicationStatus, string> = {
      [ApplicationStatus.SUBMITTED]: 'status-submitted',
      [ApplicationStatus.IN_PROCESSING]: 'status-processing',
      [ApplicationStatus.CONFIRMED]: 'status-confirmed',
      [ApplicationStatus.RESERVE]: 'status-reserve',
      [ApplicationStatus.REJECTED]: 'status-rejected',
      [ApplicationStatus.COMPLETED]: 'status-completed',
      [ApplicationStatus.CONSULTATION_DATE]: 'status-consultation'
    };
    return classes[status];
  }

  getRegionName(code: string): string {
    const regions: Record<string, string> = {
      '08': 'Вінницька',
      '14': 'Дніпропетровська',
      '21': 'Житомирська',
      '23': 'Закарпатська',
      '26': 'Харківська',
      '30': 'Київська',
      '32': 'Кіровоградська',
      '35': 'Луганська',
      '46': 'Одеська',
      '48': 'Полтавська',
      '56': 'Рівненська',
      '60': 'Сумська',
      '61': 'Тернопільська',
      '63': 'Херсонська',
      '65': 'Хмельницька',
      '68': 'Черкаська',
      '71': 'Чернівецька',
      '74': 'Чернігівська'
    };
    return regions[code] || `Регіон ${code}`;
  }

  isAgeEligible(birthDateStr: string): boolean {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18 && age <= 25;
  }

  isValidCertificateFormat(number: string): boolean {
    const regex = /^\d{8}\/\d{2}-\d{2}$/;
    return regex.test(number);
  }
}
