import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReportRow {
  region: string;
  total: number;
  confirmed: number;
  trainingCompleted: number;
  mentorshipCompleted: number;
  grantsReceived: number;
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
    { region: 'Київська',         total: 42, confirmed: 30, trainingCompleted: 25, mentorshipCompleted: 15, grantsReceived: 5, rejected: 5,  consultations: 12, certificates: 25 },
    { region: 'Одеська',          total: 35, confirmed: 24, trainingCompleted: 20, mentorshipCompleted: 10, grantsReceived: 3, rejected: 4,  consultations: 10, certificates: 20 },
    { region: 'Харківська',       total: 29, confirmed: 20, trainingCompleted: 18, mentorshipCompleted: 8,  grantsReceived: 2, rejected: 3,  consultations:  8, certificates: 18 },
    { region: 'Дніпропетровська', total: 31, confirmed: 22, trainingCompleted: 20, mentorshipCompleted: 12, grantsReceived: 4, rejected: 2,  consultations:  9, certificates: 20 },
    { region: 'Львівська',        total: 27, confirmed: 18, trainingCompleted: 15, mentorshipCompleted: 7,  grantsReceived: 3, rejected: 4,  consultations:  7, certificates: 15 },
    { region: 'Полтавська',       total: 18, confirmed: 12, trainingCompleted: 10, mentorshipCompleted: 5,  grantsReceived: 1, rejected: 2,  consultations:  5, certificates: 10 },
    { region: 'Вінницька',        total: 15, confirmed: 10, trainingCompleted: 8,  mentorshipCompleted: 4,  grantsReceived: 1, rejected: 1,  consultations:  4, certificates:  8 },
    { region: 'Рівненська',       total: 12, confirmed:  8, trainingCompleted: 6,  mentorshipCompleted: 3,  grantsReceived: 0, rejected: 2,  consultations:  3, certificates:  6 },
  ]);

  // Totals
  totalApplications = computed(() => this.reportData().reduce((s, r) => s + r.total, 0));
  totalConfirmed    = computed(() => this.reportData().reduce((s, r) => s + r.confirmed, 0));
  totalTrainingCompleted = computed(() => this.reportData().reduce((s, r) => s + r.trainingCompleted, 0));
  totalMentorshipCompleted = computed(() => this.reportData().reduce((s, r) => s + r.mentorshipCompleted, 0));
  totalGrantsReceived = computed(() => this.reportData().reduce((s, r) => s + r.grantsReceived, 0));
  totalRejected     = computed(() => this.reportData().reduce((s, r) => s + r.rejected, 0));
  totalConsultations= computed(() => this.reportData().reduce((s, r) => s + r.consultations, 0));
  totalCertificates = computed(() => this.reportData().reduce((s, r) => s + r.certificates, 0));

  completionRate = computed(() => {
    const t = this.totalConfirmed();
    return t ? Math.round((this.totalTrainingCompleted() / t) * 100) : 0;
  });

  mentorshipRate = computed(() => {
    const t = this.totalTrainingCompleted();
    return t ? Math.round((this.totalMentorshipCompleted() / t) * 100) : 0;
  });

  grantRate = computed(() => {
    const t = this.totalMentorshipCompleted();
    return t ? Math.round((this.totalGrantsReceived() / t) * 100) : 0;
  });

  barWidth(value: number): number {
    const max = Math.max(...this.reportData().map(r => r.total));
    return max ? Math.round((value / max) * 100) : 0;
  }
}
