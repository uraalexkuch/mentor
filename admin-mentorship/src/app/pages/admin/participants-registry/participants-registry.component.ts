import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationStatus } from '@mentor/shared-types';

/** Колонка для таблиці учасників */
export interface ParticipantRow {
  id: string;
  number: number;              // № з/п
  fullName: string;            // ПІБ
  region: string;              // Регіон
  age: number;                 // Вік (суворо 18-25)
  isActiveEntrepreneur: boolean;   // Діючий підприємець (чекбокс)
  needsTraining: boolean;      // Потреба у навчанні (чекбокс)
  needsMentorship: boolean;    // Менторська підтримка (чекбокс)
  needsPracticalHelp: boolean; // Практична допомога (чекбокс)
  needsGrantSupport: boolean;  // Підтримка для гранту (чекбокс)
  status: ApplicationStatus;   // Статус
  isIDP: boolean;              // ВПО
  hasDisability: boolean;      // Особа з інвалідністю
  isCombatant: boolean;        // УБД
  isVeteranEnterprise: boolean;// Ветеранське підприємництво
  isFamilyMember: boolean;     // Член сім'ї
  veteranFullName?: string;    // ПІБ ветерана (для членів сім'ї)
  veteranRnokpp?: string;      // РНОКПП ветерана
  veteranContactInfo?: string; // Контакти ветерана
}

@Component({
  selector: 'app-participants-registry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participants-registry.component.html',
  styleUrls: ['./participants-registry.component.css']
})
export class ParticipantsRegistryComponent {
  // Signals для стану
  isLoading = signal(false);
  searchQuery = signal('');
  filterIDP = signal(false);
  filterDisability = signal(false);
  filterYouth = signal(false);
  filterVeteranCategory = signal(false);
  editingParticipant = signal<ParticipantRow | null>(null);

  regions = [
    'Вінницька область', 'Волинська область', 'Дніпропетровська область', 'Донецька область', 
    'Житомирська область', 'Закарпатська область', 'Запорізька область', 'Івано-Франківська область', 
    'Київська область', 'Кіровоградська область', 'Луганська область', 'Львівська область', 
    'Миколаївська область', 'Одеська область', 'Полтавська область', 'Рівненська область', 
    'Сумська область', 'Тернопільська область', 'Харківська область', 'Херсонська область', 
    'Хмельницька область', 'Черкаська область', 'Чернівецька область', 'Чернігівська область', 'м. Київ'
  ];
  /** Статуси заявок згідно з бізнес-правилами ДЦЗ */
  statusOptions: ApplicationStatus[] = [
    ApplicationStatus.SUBMITTED,
    ApplicationStatus.IN_PROCESSING,
    ApplicationStatus.CONFIRMED,
    ApplicationStatus.RESERVE,
    ApplicationStatus.REJECTED,
    ApplicationStatus.COMPLETED,
    ApplicationStatus.CONSULTATION_DATE
  ];

  // Mock дані учасників (виключно чекбокси для потреб)
  participants = signal<ParticipantRow[]>([
    {
      id: '1', number: 1, fullName: 'Шевченко Тарас Олександрович',
      region: 'Київська', age: 23, isActiveEntrepreneur: true,
      needsTraining: true, needsMentorship: true, needsPracticalHelp: false, needsGrantSupport: true,
      status: ApplicationStatus.SUBMITTED, isIDP: true, hasDisability: false,
      isCombatant: true, isVeteranEnterprise: false, isFamilyMember: false
    },
    {
      id: '2', number: 2, fullName: 'Коваленко Анна Сергіївна',
      region: 'Одеська', age: 21, isActiveEntrepreneur: false,
      needsTraining: true, needsMentorship: false, needsPracticalHelp: true, needsGrantSupport: true,
      status: ApplicationStatus.IN_PROCESSING, isIDP: false, hasDisability: true,
      isCombatant: false, isVeteranEnterprise: false, isFamilyMember: true,
      veteranFullName: 'Коваленко Сергій Іванович', veteranRnokpp: '1234567890', veteranContactInfo: '+380501234567'
    },
    {
      id: '3', number: 3, fullName: 'Бондаренко Дмитро Ігорович',
      region: 'Харківська', age: 25, isActiveEntrepreneur: true,
      needsTraining: false, needsMentorship: true, needsPracticalHelp: true, needsGrantSupport: false,
      status: ApplicationStatus.CONFIRMED, isIDP: false, hasDisability: false,
      isCombatant: false, isVeteranEnterprise: true, isFamilyMember: false
    },
    {
      id: '4', number: 4, fullName: 'Мельник Юрія Василівна',
      region: 'Львівська', age: 19, isActiveEntrepreneur: false,
      needsTraining: true, needsMentorship: true, needsPracticalHelp: true, needsGrantSupport: true,
      status: ApplicationStatus.RESERVE, isIDP: true, hasDisability: true,
      isCombatant: false, isVeteranEnterprise: false, isFamilyMember: false
    },
    {
      id: '5', number: 5, fullName: 'Петренко Максим Олегович',
      region: 'Полтавська', age: 24, isActiveEntrepreneur: true,
      needsTraining: true, needsMentorship: false, needsPracticalHelp: false, needsGrantSupport: true,
      status: ApplicationStatus.REJECTED, isIDP: false, hasDisability: false,
      isCombatant: false, isVeteranEnterprise: false, isFamilyMember: false
    }
  ]);

  // Фільтровані учасники (computed signal)
  filteredParticipants = computed(() => {
    let result = this.participants();
    
    if (this.filterIDP()) result = result.filter(p => p.isIDP);
    if (this.filterDisability()) result = result.filter(p => p.hasDisability);
    if (this.filterYouth()) result = result.filter(p => this.isAgeEligible(p.age));
    if (this.filterVeteranCategory()) {
      result = result.filter(p => p.isCombatant || p.isVeteranEnterprise || p.isFamilyMember);
    }

    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(p => 
        p.fullName.toLowerCase().includes(query) ||
        p.region.toLowerCase().includes(query) ||
        p.status.toLowerCase().includes(query)
      );
    }
    
    return result;
  });

  // Статистика (computed signals)
  totalParticipants = computed(() => this.filteredParticipants().length);
  
  confirmedCount = computed(() => 
    this.filteredParticipants().filter(p => p.status === 'підтверджено').length
  );
  
  pendingCount = computed(() => 
    this.filteredParticipants().filter(p => 
      p.status === 'опрацьовується' || p.status === 'подано'
    ).length
  );

  ngOnInit(): void {
    setTimeout(() => this.isLoading.set(false), 500);
  }

  /** Зміна статусу учасника */
  updateStatus(participantId: string, newStatus: ApplicationStatus): void {
    const updated = this.participants().map(p => 
      p.id === participantId ? { ...p, status: newStatus } : p
    );
    this.participants.set(updated);
  }

  /** Перевірка віку (18-25) — суворе обмеження */
  isAgeEligible(age: number): boolean {
    return age >= 18 && age <= 25;
  }

  // Логіка модального вікна
  openEditModal(participant: ParticipantRow): void {
    // Створюємо копію для редагування
    this.editingParticipant.set({ ...participant });
  }

  closeEditModal(): void {
    this.editingParticipant.set(null);
  }

  saveParticipant(): void {
    const edited = this.editingParticipant();
    if (!edited) return;

    this.participants.update(items =>
      items.map(p => p.id === edited.id ? edited : p)
    );
    this.closeEditModal();
  }

  /** Мітка статусу */
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
    return labels[status] ?? status;
  }
}
