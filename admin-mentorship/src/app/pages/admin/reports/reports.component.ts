import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReportRow {
  region: string;
  total: number;
  confirmed: number;
  completed: number;
  rejected: number;
  consultations: number;
  certificates: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  selectedYear = signal(2026);
  years = [2024, 2025, 2026];

  reportData = signal<ReportRow[]>([
    { region: 'Київська',         total: 42, confirmed: 30, completed: 18, rejected: 5,  consultations: 12, certificates: 16 },
    { region: 'Одеська',          total: 35, confirmed: 24, completed: 14, rejected: 4,  consultations: 10, certificates: 12 },
    { region: 'Харківська',       total: 29, confirmed: 20, completed: 11, rejected: 3,  consultations:  8, certificates:  9 },
    { region: 'Дніпропетровська', total: 31, confirmed: 22, completed: 13, rejected: 2,  consultations:  9, certificates: 11 },
    { region: 'Львівська',        total: 27, confirmed: 18, completed: 10, rejected: 4,  consultations:  7, certificates:  8 },
    { region: 'Полтавська',       total: 18, confirmed: 12, completed:  6, rejected: 2,  consultations:  5, certificates:  5 },
    { region: 'Вінницька',        total: 15, confirmed: 10, completed:  5, rejected: 1,  consultations:  4, certificates:  4 },
    { region: 'Рівненська',       total: 12, confirmed:  8, completed:  4, rejected: 2,  consultations:  3, certificates:  3 },
  ]);

  // Totals
  totalApplications = computed(() => this.reportData().reduce((s, r) => s + r.total, 0));
  totalConfirmed    = computed(() => this.reportData().reduce((s, r) => s + r.confirmed, 0));
  totalCompleted    = computed(() => this.reportData().reduce((s, r) => s + r.completed, 0));
  totalRejected     = computed(() => this.reportData().reduce((s, r) => s + r.rejected, 0));
  totalConsultations= computed(() => this.reportData().reduce((s, r) => s + r.consultations, 0));
  totalCertificates = computed(() => this.reportData().reduce((s, r) => s + r.certificates, 0));

  completionRate = computed(() => {
    const t = this.totalApplications();
    return t ? Math.round((this.totalCompleted() / t) * 100) : 0;
  });

  barWidth(value: number): number {
    const max = Math.max(...this.reportData().map(r => r.total));
    return max ? Math.round((value / max) * 100) : 0;
  }
}
