import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Сервіс для роботи з заходами професійної підготовки ОПК
 * (Постанова №452)
 */
@Injectable({
  providedIn: 'root'
})
export class OpkService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  /**
   * Подання інформації про потребу в професійних кваліфікаціях (Форма 1)
   */
  submitNeedInfo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/qualifications/demand`, data);
  }

  /**
   * Заява роботодавця про потребу в навчанні/компенсації (Форма 2)
   */
  submitEmployerApplication(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/employer`, data);
  }

  /**
   * Заявка від надавача послуг на участь в проекті (Форма 3)
   */
  submitProviderApplication(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/providers/register`, data);
  }

  /**
   * Запит від кандидата на отримання гранту (Форма 4)
   */
  submitCandidateRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/candidate`, data);
  }

  /**
   * Отримання списку доступних кваліфікацій
   */
  getQualifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/qualifications`);
  }

  /**
   * Отримання списку ЦПТО (Mapping)
   */
  getCPTO(): Observable<any[]> {
    // В ідеалі це має бути ендпоінт, але для початку можна повернути статику або локальний JSON
    return this.http.get<any[]>(`${this.apiUrl}/base/cpto-list`);
  }

  /**
   * Отримання ліцензованих професій ЦПТО
   */
  getCptoProf(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/base/cptoprofnavch`);
  }

  /**
   * Отримання програм підвищення кваліфікації ЦПТО
   */
  getCptoKzpProf(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/base/cptokzpnavch`);
  }

  /**
   * Отримання контактів ЦПТО
   */
  getCPTOContacts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/base/getrcontactregioncpto`);
  }

  /**
   * Отримання списку центрів зайнятості
   */
  getAddress(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/base/getrcontactregion/`);
  }
}
