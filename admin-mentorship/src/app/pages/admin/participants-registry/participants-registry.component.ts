import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}

@Component({
  selector: 'app-participants-registry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participants-registry.component.html',
  styleUrls: ['./participants-registry.component.css']
})
export class ParticipantsRegistryComponent {
  // Signals для стану
  isLoading = signal(true);
  searchQuery = signal('');

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
      status: ApplicationStatus.SUBMITTED
    },
    {
      id: '2', number: 2, fullName: 'Коваленко Анна Сергіївна',
      region: 'Одеська', age: 21, isActiveEntrepreneur: false,
      needsTraining: true, needsMentorship: false, needsPracticalHelp: true, needsGrantSupport: true,
      status: ApplicationStatus.IN_PROCESSING
    },
    {
      id: '3', number: 3, fullName: 'Бондаренко Дмитро Ігорович',
      region: 'Харківська', age: 25, isActiveEntrepreneur: true,
      needsTraining: false, needsMentorship: true, needsPracticalHelp: true, needsGrantSupport: false,
      status: ApplicationStatus.CONFIRMED
    },
    {
      id: '4', number: 4, fullName: 'Мельник Юрія Василівна',
      region: 'Львівська', age: 19, isActiveEntrepreneur: false,
      needsTraining: true, needsMentorship: true, needsPracticalHelp: true, needsGrantSupport: true,
      status: ApplicationStatus.RESERVE
    },
    {
      id: '5', number: 5, fullName: 'Петренко Максим Олегович',
      region: 'Полтавська', age: 24, isActiveEntrepreneur: true,
      needsTraining: true, needsMentorship: false, needsPracticalHelp: false, needsGrantSupport: true,
      status: ApplicationStatus.REJECTED
    }
  ]);

  // Фільтровані учасники (computed signal)
  filteredParticipants = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.participants();
    
    return this.participants().filter(p => 
      p.fullName.toLowerCase().includes(query) ||
      p.region.toLowerCase().includes(query) ||
      p.status.includes(query)
    );
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
