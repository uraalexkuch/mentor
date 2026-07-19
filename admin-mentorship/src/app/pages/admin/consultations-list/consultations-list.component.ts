import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  isIDP?: boolean;
  hasDisability?: boolean;
  isCombatant?: boolean;
  isVeteranEnterprise?: boolean;
  isFamilyMember?: boolean;
  isBusinessActive: boolean;
  businessInactiveReason?: string;
  applicationType: string;
  officeConsultationTopics?: {
    businessPlans: boolean;
    personnel: boolean;
    creditPrograms: boolean;
    stateCompensations: boolean;
  };
  otherTopicDescription?: string;
  consultationResult?: string;
  consultantName?: string;
  preferredDate: string;
  status: ApplicationStatus;
}

@Component({
  selector: 'app-consultations-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultations-list.component.html',
  styleUrls: ['./consultations-list.component.css']
})
export class ConsultationsListComponent {
  // Сигнали стану
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');
  filterIDP = signal<boolean>(false);
  filterDisability = signal<boolean>(false);
  filterYouth = signal<boolean>(false);
  filterVeteranCategory = signal<boolean>(false);
  
  // Дані
  editingConsultation = signal<ConsultationRow | null>(null);

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
      isIDP: false, hasDisability: false, isCombatant: true, isVeteranEnterprise: false, isFamilyMember: false,
      applicationType: 'TRAINING',
      preferredDate: '2026-08-01', status: ApplicationStatus.SUBMITTED
    },
    {
      id: '2', number: 2, fullName: 'Сидоренко Максим Вікторович',
      birthDate: '2005-09-22', phone: '+380509876543', email: 'maksym@example.com',
      region: 'Одеська', isBusinessActive: false, businessInactiveReason: 'Планую відкрити бізнес протягом 3 місяців',
      isIDP: true, hasDisability: false, isCombatant: false, isVeteranEnterprise: false, isFamilyMember: false,
      applicationType: 'OFFICE_CONSULTATION',
      otherTopicDescription: 'Питання реєстрації ФОП', preferredDate: '2026-07-25', status: ApplicationStatus.IN_PROCESSING
    },
    {
      id: '3', number: 3, fullName: 'Кравченко Дарія Миколаївна',
      birthDate: '2001-01-10', phone: '+380631112233', email: 'darya@example.com',
      region: 'Харківська', isBusinessActive: true,
      isIDP: false, hasDisability: false, isCombatant: false, isVeteranEnterprise: true, isFamilyMember: false,
      applicationType: 'MENTORSHIP',
      preferredDate: '2026-07-30', status: ApplicationStatus.CONFIRMED
    }
  ]);

  filteredConsultations = computed(() => {
    let result = this.consultations();

    if (this.filterIDP()) {
      result = result.filter(c => c.isIDP);
    }
    if (this.filterDisability()) {
      result = result.filter(c => c.hasDisability);
    }
    if (this.filterYouth()) {
      result = result.filter(c => c.birthDate && this.isAgeEligible(c.birthDate));
    }
    if (this.filterVeteranCategory()) {
      result = result.filter(c => c.isCombatant || c.isVeteranEnterprise || c.isFamilyMember);
    }

    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(c => 
        c.fullName.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query) ||
        c.status.toLowerCase().includes(query)
      );
    }
    
    return result;
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

  // Логіка модального вікна
  openEditModal(consultation: ConsultationRow): void {
    const copy = { ...consultation };
    if (!copy.officeConsultationTopics) {
      copy.officeConsultationTopics = {
        businessPlans: false,
        personnel: false,
        creditPrograms: false,
        stateCompensations: false
      };
    }
    this.editingConsultation.set(copy);
  }

  closeEditModal(): void {
    this.editingConsultation.set(null);
  }

  saveConsultation(): void {
    const edited = this.editingConsultation();
    if (!edited) return;

    this.consultations.update(items =>
      items.map(c => c.id === edited.id ? edited : c)
    );
    this.closeEditModal();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uk-UA');
  }

  getApplicationTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'TRAINING': 'Навчання',
      'OFFICE_CONSULTATION': 'Консультації офісу',
      'MENTORSHIP': 'Менторство',
      'VETERAN_MENTORSHIP': 'Менторський супровід ветеранів'
    };
    return labels[type] || 'Не вказано';
  }

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
    return labels[status] || status;
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
    return classes[status] || '';
  }
}
