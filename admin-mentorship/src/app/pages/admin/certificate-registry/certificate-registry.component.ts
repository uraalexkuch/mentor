import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateRegistryItemDto } from '@mentor/shared-types';

/** Рядок реєстру сертифікатів */
export interface CertificateRow {
  id: string;
  number: number;
  year: number;
  institutionName: string;
  edrpoUCode: string;
  certificateNumber: string; // ХХХХХХХХ/УУ-ZZ
  participantFullName: string;
  programName: string;
  issueDate: string;
  note?: string;
}

@Component({
  selector: 'app-certificate-registry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-registry.component.html',
  styleUrls: ['./certificate-registry.component.css']
})
export class CertificateRegistryComponent {
  // Signals для стану
  isLoading = signal(true);
  searchQuery = signal('');

  // Дані сертифікатів (mock)
  certificates = signal<CertificateRow[]>([
    {
      id: '1', number: 1, year: 2026,
      institutionName: 'Державний центр зайнято��ті',
      edrpoUCode: '00000001',
      certificateNumber: '12345678/26-01',
      participantFullName: 'Шевченко Тарас Олександрович',
      programName: 'Менторство молодих підприємців',
      issueDate: '2026-07-15',
      note: 'Завершено навчання'
    },
    {
      id: '2', number: 2, year: 2026,
      institutionName: 'Одеський регіональний центр',
      edrpoUCode: '00000046',
      certificateNumber: '87654321/26-02',
      participantFullName: 'Коваленко Анна Сергіївна',
      programName: 'Підтримка мікрогрантів',
      issueDate: '2026-07-10',
      note: ''
    },
    {
      id: '3', number: 3, year: 2025,
      institutionName: 'Київський обласний центр',
      edrpoUCode: '00000030',
      certificateNumber: '11223344/25-03',
      participantFullName: 'Бондаренко Дмитро Ігорович',
      programName: 'Менторська підтримка',
      issueDate: '2025-12-20',
      note: 'Підвищення кваліфікації'
    },
    {
      id: '4', number: 4, year: 2025,
      institutionName: 'Харківський регіональний центр',
      edrpoUCode: '00000026',
      certificateNumber: '55667788/25-04',
      participantFullName: 'Мельник Юрія Василівна',
      programName: 'Розвиток бізнесу',
      issueDate: '2025-11-15',
      note: ''
    },
    {
      id: '5', number: 5, year: 2026,
      institutionName: 'Полтавський обласний центр',
      edrpoUCode: '00000048',
      certificateNumber: '99887766/26-05',
      participantFullName: 'Петренко Максим Олегович',
      programName: 'Менторство молодих підприємців',
      issueDate: '2026-06-30',
      note: 'Грантова підтримка'
    }
  ]);

  // Фільтровані сертифікати (computed signal)
  filteredCertificates = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.certificates();
    
    return this.certificates().filter(c => 
      c.participantFullName.toLowerCase().includes(query) ||
      c.certificateNumber.toLowerCase().includes(query) ||
      c.programName.toLowerCase().includes(query) ||
      c.institutionName.toLowerCase().includes(query)
    );
  });

  // Статистика (computed signals)
  totalCertificates = computed(() => this.filteredCertificates().length);
  
  certificatesThisYear = computed(() => 
    this.filteredCertificates().filter(c => c.year === new Date().getFullYear()).length
  );

  /** Парсинг номера сертифіката */
  parseCertificateNumber(number: string): { eightDigits: string; year: string; sequence: string } | null {
    const parts = number.split('/');
    if (parts.length !== 2) return null;
    
    const seqParts = parts[1].split('-');
    if (seqParts.length !== 2) return null;
    
    return {
      eightDigits: parts[0],
      year: seqParts[0],
      sequence: seqParts[1]
    };
  }

  /** Валідація формату номера */
  isValidCertificateFormat(number: string): boolean {
    const regex = /^\d{8}\/\d{2}-\d{2}$/;
    return regex.test(number);
  }

  /** Форматування дати */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
