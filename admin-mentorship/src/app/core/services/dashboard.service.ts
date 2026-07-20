import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

export interface DashboardData {
  stats: {
    totalApplications: number;
    approvedApplications: number;
    totalConsultations: number;
    totalMentors: number;
    activePairs: number;
    totalCertificates: number;
  };
  charts: {
    applicationsByRegion: { labels: string[]; data: number[] };
    statusData: { labels: string[]; data: number[] };
  };
  recent: {
    applications: any[];
    mentors: any[];
    mentees: any[];
    pairs: any[];
    certificates: any[];
    consultations: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${API_CONFIG.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/data`);
  }
}
