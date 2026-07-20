import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import {
  ApplicationStatus,
  MentorshipApplicationDto,
  ConsultationOrderDto,
  CertificateRegistryItemDto,
  MentorDto,
  MentorshipPairDto,
  MentorshipStatus,
  UserRole,
} from '@mentor/shared-types';
import { DashboardService } from '../../core/services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    BaseChartDirective,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  ApplicationStatus = ApplicationStatus;
  today = new Date();
  activeTab = signal<'participants' | 'consultations' | 'mentors' | 'pairs' | 'certificates'>('participants');

  // ==================== API DATA ====================

  applications = signal<MentorshipApplicationDto[]>([]);
  consultations = signal<ConsultationOrderDto[]>([]);
  certificates = signal<CertificateRegistryItemDto[]>([]);
  mentors = signal<MentorDto[]>([]);
  pairs = signal<MentorshipPairDto[]>([]);
  mentees = signal<any[]>([]);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.applications.set(data.recent.applications);
        this.consultations.set(data.recent.consultations);
        this.certificates.set(data.recent.certificates);
        this.mentors.set(data.recent.mentors);
        this.pairs.set(data.recent.pairs);
        this.mentees.set(data.recent.mentees);
      },
      error: (err) => console.error('Failed to load dashboard data:', err)
    });
  }

  // Пільгові категорії — computed (замість pipe)
  idpCount = computed(() => this.applications().filter((a: any) => a.applicantCategories?.includes('ВПО')).length);
  disabilityCount = computed(() => this.applications().filter((a: any) => a.applicantCategories?.includes('Особа з інвалідністю')).length);
  combatantCount = computed(() => this.applications().filter((a: any) => a.applicantCategories?.includes('УБД')).length);
  veteranEnterpriseCount = computed(() => this.applications().filter((a: any) => a.applicantCategories?.includes('Ветеранське підприємство')).length);
  familyMemberCount = computed(() => this.applications().filter((a: any) => a.applicantCategories?.includes('Член сім\'ї ветерана')).length);

  totalApplications = computed(() => this.applications().length);
  totalConsultations = computed(() => this.consultations().length);
  totalMentors = computed(() => this.mentors().length);
  totalPairs = computed(() => this.pairs().length);
  totalCertificates = computed(() => this.certificates().length);

  submittedCount = computed(() => this.applications().filter(a => a.status === ApplicationStatus.SUBMITTED).length);
  processingCount = computed(() => this.applications().filter(a => a.status === ApplicationStatus.IN_PROCESSING).length);
  confirmedCount = computed(() => this.applications().filter(a => a.status === ApplicationStatus.CONFIRMED).length);
  completedCount = computed(() => this.applications().filter(a => a.status === ApplicationStatus.COMPLETED).length);
  rejectionCount = computed(() => this.applications().filter(a => a.status === ApplicationStatus.REJECTED).length);
  reserveCount = computed(() => this.applications().filter(a => a.status === ApplicationStatus.RESERVE).length);

  completionRate = computed(() => {
    const total = this.totalApplications();
    return total === 0 ? 0 : Math.round((this.completedCount() / total) * 100);
  });

  recentApplications = computed(() =>
    [...this.applications()]
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 5)
  );

  // ==================== CHART.JS DATA ====================

  // --- Учасники: статуси (doughnut) ---
  participantsStatusChartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Подано', 'Опрацьовується', 'Підтверджено', 'Резерв', 'Завершено', 'Відхилено'],
    datasets: [{
      data: [
        this.submittedCount(),
        this.processingCount(),
        this.confirmedCount(),
        this.reserveCount(),
        this.completedCount(),
        this.rejectionCount(),
      ],
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ef4444'],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  }));

  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { padding: 12, font: { size: 12 } } },
    },
    cutout: '65%',
  };

  // --- Учасники: потреби (bar) ---
  needsChartData = computed<ChartData<'bar'>>(() => {
    const apps = this.applications();
    return {
      labels: ['Навчання', 'Менторська підтримка', 'Практична допомога', 'Мікрогрант'],
      datasets: [{
        label: 'Кількість',
        data: [
          apps.filter((a: any) => a.needsTraining).length,
          apps.filter((a: any) => a.needsMentorshipSupport).length,
          apps.filter((a: any) => a.needsPracticalHelp).length,
          apps.filter((a: any) => a.needsMicrograntMentorship).length,
        ],
        backgroundColor: ['#6366f1', '#0ea5e9', '#14b8a6', '#f59e0b'],
        borderRadius: 6,
      }],
    };
  });

  horizontalBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { precision: 0 } },
      y: { grid: { display: false } },
    },
  };

  // --- Консультації: типи (pie) ---
  consultationTypesChartData = computed<ChartData<'pie'>>(() => {
    const cs = this.consultations();
    return {
      labels: ['Навчання', 'Очна консультація', 'Менторство', 'Вет. менторство'],
      datasets: [{
        data: [
          cs.filter(c => c.applicationType === 'TRAINING').length,
          cs.filter(c => c.applicationType === 'OFFICE_CONSULTATION').length,
          cs.filter(c => c.applicationType === 'MENTORSHIP').length,
          cs.filter(c => c.applicationType === 'VETERAN_MENTORSHIP').length,
        ],
        backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    };
  });

  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right', labels: { padding: 10, font: { size: 12 } } } },
  };

  // --- Консультації: статуси (bar) ---
  consultationStatusChartData = computed<ChartData<'bar'>>(() => {
    const cs = this.consultations();
    return {
      labels: ['Подано', 'Опрацьовується', 'Підтверджено', 'Дата консультації'],
      datasets: [{
        label: 'Консультацій',
        data: [
          cs.filter(c => c.status === ApplicationStatus.SUBMITTED).length,
          cs.filter(c => c.status === ApplicationStatus.IN_PROCESSING).length,
          cs.filter(c => c.status === ApplicationStatus.CONFIRMED).length,
          cs.filter(c => c.status === ApplicationStatus.CONSULTATION_DATE).length,
        ],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
        borderRadius: 6,
      }],
    };
  });

  verticalBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { precision: 0 } },
      x: { grid: { display: false } },
    },
  };

  // --- Ментори: спеціалізації (bar) ---
  mentorSpecChartData = computed<ChartData<'bar'>>(() => {
    const ms = this.mentors();
    const specs: Record<string, number> = {};
    ms.forEach(m => { specs[m.specialization] = (specs[m.specialization] || 0) + 1; });
    return {
      labels: Object.keys(specs),
      datasets: [{
        label: 'Ментори',
        data: Object.values(specs),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      }],
    };
  });

  // --- Ментори: доступність (pie) ---
  mentorAvailabilityChartData = computed<ChartData<'pie'>>(() => ({
    labels: ['Вільні', 'Зайняті'],
    datasets: [{
      data: [
        this.mentors().filter(m => m.isAvailable).length,
        this.mentors().filter(m => !m.isAvailable).length,
      ],
      backgroundColor: ['#10b981', '#f59e0b'],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  }));

  smallDoughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 10, font: { size: 12 } } } },
    cutout: '60%',
  };

  // --- Пари: статуси (bar) ---
  pairsStatusChartData = computed<ChartData<'bar'>>(() => ({
    labels: ['Планується', 'В процесі', 'Завершено'],
    datasets: [{
      label: 'Кількість',
      data: [
        this.pairs().filter(p => p.status === MentorshipStatus.PLANNING).length,
        this.pairs().filter(p => p.status === MentorshipStatus.IN_PROGRESS).length,
        this.pairs().filter(p => p.status === MentorshipStatus.COMPLETED).length,
      ],
      backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
      borderRadius: 6,
    }],
  }));

  // --- Сертифікати: по роках (bar) ---
  certYearChartData = computed<ChartData<'bar'>>(() => {
    const certs = this.certificates();
    const byYear: Record<number, number> = {};
    certs.forEach(c => { byYear[c.year] = (byYear[c.year] || 0) + 1; });
    const years = Object.keys(byYear).sort();
    return {
      labels: years,
      datasets: [{
        label: 'Сертифікатів',
        data: years.map(y => byYear[+y]),
        backgroundColor: '#f59e0b',
        borderRadius: 6,
      }],
    };
  });

  // --- Сертифікати: валідність (doughnut) ---
  certValidityChartData = computed<ChartData<'doughnut'>>(() => {
    const certs = this.certificates();
    const valid = certs.filter(c => this.isValidCertificateFormat(c.certificateNumber)).length;
    return {
      labels: ['Коректні', 'Некоректні'],
      datasets: [{
        data: [valid, certs.length - valid],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    };
  });

  // ==================== HELPERS ====================

  getStatusLabel(status: ApplicationStatus): string {
    const labels: Record<ApplicationStatus, string> = {
      [ApplicationStatus.SUBMITTED]: 'Подано',
      [ApplicationStatus.IN_PROCESSING]: 'Опрацьовується',
      [ApplicationStatus.CONFIRMED]: 'Підтверджено',
      [ApplicationStatus.RESERVE]: 'Резерв',
      [ApplicationStatus.REJECTED]: 'Відмовлено',
      [ApplicationStatus.COMPLETED]: 'Завершено',
      [ApplicationStatus.CONSULTATION_DATE]: 'Дата консультації',
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
      [ApplicationStatus.CONSULTATION_DATE]: 'status-consultation',
    };
    return classes[status];
  }

  getConsultationTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      TRAINING: 'Навчання',
      OFFICE_CONSULTATION: 'Очна консультація',
      MENTORSHIP: 'Менторство',
      VETERAN_MENTORSHIP: 'Вет. менторство',
      '': 'Не вказано',
    };
    return labels[type] ?? type;
  }

  getRegionName(code: string): string {
    const regions: Record<string, string> = {
      '08': 'Вінницька', '14': 'Дніпропетровська', '26': 'Харківська',
      '30': 'Київська', '32': 'Кіровоградська', '46': 'Одеська',
      '48': 'Полтавська', '68': 'Черкаська',
    };
    return regions[code] || `Регіон ${code}`;
  }

  isValidCertificateFormat(number: string): boolean {
    return /^\d{8}\/\d{2}-\d{2}$/.test(number);
  }

  getPairStatus(status: MentorshipStatus): string {
    return { PLANNING: 'Планується', IN_PROGRESS: 'В процесі', COMPLETED: 'Завершено' }[status] ?? status;
  }

  getMentorName(id: string): string {
    const mentor = this.mentors().find(m => m.id === id);
    return mentor ? `${mentor.firstName} ${mentor.lastName}` : id;
  }

  getMenteeName(id: string): string {
    // Поки немає реального списку mentees, беремо з заявок або форматуємо ID
    const app = this.applications().find(a => a.id === id.replace('mentee-', ''));
    if (app) return app.fullName;
    return id.replace('mentee-00', 'Підопічний ').replace('mentee-0', 'Підопічний ');
  }

  getPairStatusClass(status: MentorshipStatus): string {
    return { PLANNING: 'status-reserve', IN_PROGRESS: 'status-processing', COMPLETED: 'status-completed' }[status] ?? '';
  }

}
