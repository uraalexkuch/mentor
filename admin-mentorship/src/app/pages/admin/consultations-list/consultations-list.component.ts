import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatus, ConsultationOrderDto } from '@mentor/shared-types';

/** Рядок заявки на консультацію */
export interface ConsultationRow {
  id: string;
  number: number;
  fullName: string;
  birthDate: string;
  phone: string;
  email?: string;
  region: string;
  isBusinessActive: boolean;
  businessInactiveReason?: string;
  applicationType: string;
  officeConsultationTopics?: {
    businessPlans: boolean;
    personnel: boolean;
    creditPrograms: boolean;
  };
  otherTopicDescription?: string;
  preferredDate: string;
  status: ApplicationStatus;
}

@Component({
  selector: 'app-consultations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultations-list.component.html',
  styleUrls: ['./consultations-list.component.css']
})
export class ConsultationsListComponent {
  isLoading = signal(true);
  searchQuery = signal('');

  statusOptions: ApplicationStatus[] = [
    ApplicationStatus.SUBMITTED,
    ApplicationStatus.IN_PROCESSING,
    ApplicationStatus.CONFIRMED,
    ApplicationStatus.RESERVE,
    ApplicationStatus.REJECTED,
    ApplicationStatus.COMPLETED,
    ApplicationStatus.CONSULTATION_DATE
  ];

  consultations = signal<ConsultationRow[]>([
    {
      id: '1', number: 1, fullName: 'Іваненко Ольга Петрівна',
      birthDate: '2003-05-15', phone: '+380671234567', email: 'olena@example.com',
      region: 'Київська', isBusinessActive: true,
      applicationType: 'TRAINING',
      preferredDate: '2026-08-01', status: ApplicationStatus.SUBMITTED
    },
    {
      id: '2', number: 2, fullName: 'Сидоренко Максим Вікторович',
      birthDate: '2005-09-22', phone: '+380509876543', email: 'maksym@example.com',
      region: 'Одеська', isBusinessActive: false, businessInactiveReason: 'Планую відкрити бізнес протягом 3 місяців',
      applicationType: 'OFFICE_CONSULTATION',
      otherTopicDescription: 'Питання реєстрації ФОП', preferredDate: '2026-07-25', status: ApplicationStatus.IN_PROCESSING
    },
    {
      id: '3', number: 3, fullName: 'Кравченко Дарія Миколаївна',
      birthDate: '2001-01-10', phone: '+380631112233', email: 'darya@example.com',
      region: 'Харківська', isBusinessActive: true,
      applicationType: 'MENTORSHIP',
      preferredDate: '2026-07-30', status: ApplicationStatus.CONFIRMED
    }
  ]);

  filteredConsultations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.consultations();
    
    return this.consultations().filter(c => 
      c.fullName.toLowerCase().includes(query) ||
      c.region.toLowerCase().includes(query) ||
      c.status.includes(query)
    );
  });

  totalConsultations = computed(() => this.filteredConsultations().length);
  
  ngOnInit(): void {
    setTimeout(() => this.isLoading.set(false), 500);
  }

  updateStatus(id: string, newStatus: ApplicationStatus): void {
    const updated = this.consultations().map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    );
    this.consultations.set(updated);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uk-UA');
  }

  getApplicationTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'TRAINING': 'Навчання',
      'OFFICE_CONSULTATION': 'Консультації офісу',
      'MENTORSHIP': 'Менторство'
    };
    return labels[type] || 'Не вказано';
  }

  getStatusLabel(status: ApplicationStatus): string {
    const labels: Record<ApplicationStatus, string> = {
      'подано': 'Подано',
      'опрацьовується': 'Опрацьовується',
      'підтверджено': 'Підтверджено',
      'резерв': 'Резерв',
      'відмовлено': 'Відмовлено',
      'завершено навчання': 'Завершено навчання',
      'дата консультації': 'Дата консультації'
    };
    return labels[status];
  }
}
