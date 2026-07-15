import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Інтерфейс для даних офісу
 */
export interface Office {
  id: number;
  regionCode: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  photoUrl: string;
}

/**
 * Інтерфейс для даних області
 */
export interface Region {
  code: string;
  name: string;
}

/**
 * Сервіс для роботи з програмою менторства та підтримки підприємців
 * (Постанова №472)
 */
@Injectable({
  providedIn: 'root'
})
export class MentorshipService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  // Signals для даних
  private regionsData = signal<Region[]>([
    { code: 'UA05', name: 'Вінницька область' },
    { code: 'UA07', name: 'Волинська область' },
    { code: 'UA12', name: 'Дніпропетровська область' },
    { code: 'UA18', name: 'Житомирська область' },
    { code: 'UA21', name: 'Закарпатська область' },
    { code: 'UA23', name: 'Запорізька область' },
    { code: 'UA26', name: 'Івано-Франківська область' },
    { code: 'UA80', name: 'м. Київ' },
    { code: 'UA32', name: 'Київська область' },
    { code: 'UA35', name: 'Кіровоградська область' },
    { code: 'UA44', name: 'Луганська область' },
    { code: 'UA46', name: 'Львівська область' },
    { code: 'UA48', name: 'Миколаївська область' },
    { code: 'UA51', name: 'Одеська область' },
    { code: 'UA53', name: 'Полтавська область' },
    { code: 'UA56', name: 'Рівненська область' },
    { code: 'UA60', name: 'Сумська область' },
    { code: 'UA63', name: 'Тернопільська область' },
    { code: 'UA65', name: 'Харківська область' },
    { code: 'UA68', name: 'Херсонська область' },
    { code: 'UA71', name: 'Хмельницька область' },
    { code: 'UA74', name: 'Черкаська область' },
    { code: 'UA77', name: 'Чернівецька область' },
    { code: 'UA79', name: 'Чернігівська область' }
  ]);

  private officesData = signal<Office[]>([
    {
      id: 1,
      regionCode: 'UA05',
      name: 'Вінницький офіс',
      address: '21000, Вінницька обл., м. Вінниця, вул. Велика Арнаутська, 59',
      phone: '0 800 219 714; +38 (0432) 67-45-23',
      email: 'office@vn.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 2,
      regionCode: 'UA07',
      name: 'Волинський офіс',
      address: '10000, Волинська обл., м. Луцьк, вул. Руська, 53',
      phone: '0 800 219 714; +38 (0332) 77-88-99',
      email: 'office@lv.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 3,
      regionCode: 'UA12',
      name: 'Дніпропетровський офіс',
      address: '49000, Дніпропетровська обл., м. Дніпро, вул. Карла Маркса, 38',
      phone: '0 800 219 714; +38 (056) 789-01-23',
      email: 'office@dn.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 4,
      regionCode: 'UA18',
      name: 'Бердичівський офіс',
      address: '13312, Житомирська обл., м. Бердичів, вул. М.Грушевського, 26',
      phone: '0 800 219 714; +38 (0412) 50-01-72',
      email: 'office@berd.zt.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 5,
      regionCode: 'UA21',
      name: 'Закарпатський офіс',
      address: '90000, Закарпатська обл., м. Ужгород, вул. Володимира Великого, 36',
      phone: '0 800 219 714; +38 (0312) 23-45-67',
      email: 'office@uzhgorod.za.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 6,
      regionCode: 'UA23',
      name: 'Запорізький офіс',
      address: '49000, Запорізька обл., м. Запоріжжя, вул. Соборна, 51',
      phone: '0 800 219 714; +38 (061) 234-56-78',
      email: 'office.zp.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 7,
      regionCode: 'UA26',
      name: 'Івано-Франківський офіс',
      address: '76000, Івано-Франківська обл., м. Івано-Франківськ, вул. Вітовського, 18',
      phone: '0 800 219 714; +38 (0342) 34-56-78',
      email: 'office.if.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 8,
      regionCode: 'UA80',
      name: 'Київський міський офіс',
      address: '01001, м. Київ, вул. Григорія Сковороди, 17',
      phone: '0 800 219 714; +38 (044) 456-78-90',
      email: 'office.kyiv.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 9,
      regionCode: 'UA32',
      name: 'Київський обласний офіс',
      address: '04113, Київська обл., м. Біла Церква, вул. Соборна, 57',
      phone: '0 800 219 714; +38 (0456) 67-89-01',
      email: 'office.bcerkva.kyiv.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 10,
      regionCode: 'UA35',
      name: 'Кропивницький офіс',
      address: '25000, Кіровоградська обл., м. Кропивницький, вул. Соборна, 81',
      phone: '0 800 219 714; +38 (0522) 78-90-12',
      email: 'office.kropyvno.kiro.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 11,
      regionCode: 'UA44',
      name: 'Луглянський офіс',
      address: '91000, Луганська обл., м. Рубіжне, вул. Леніна, 22',
      phone: '0 800 219 714; +38 (0642) 89-01-23',
      email: 'office.luhansk.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 12,
      regionCode: 'UA46',
      name: 'Львівський офіс',
      address: '79000, Львівська обл., м. Львів, вул. Городоцька, 183',
      phone: '0 800 219 714; +38 (032) 901-23-45',
      email: 'office.lviv.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 13,
      regionCode: 'UA48',
      name: 'Баштанський офіс',
      address: '56101, Миколаївська обл., м. Баштанка, провулок Перемоги 2',
      phone: '0 800 219 723; +38 (0512) 76-65-63',
      email: 'jobcentr-basht@ocz-mk.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 14,
      regionCode: 'UA51',
      name: 'Одеський офіс',
      address: '65000, Одеська обл., м. Одеса, вул. Непорожнього, 19/2',
      phone: '0 800 219 714; +38 (048) 012-34-56',
      email: 'office.od.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 15,
      regionCode: 'UA53',
      name: 'Полтавський офіс',
      address: '36000, Полтавська обл., м. Полтава, вул Вокзальна, 37',
      phone: '0 800 219 714; +38 (0532) 12-34-56',
      email: 'office.pt.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    },
    {
      id: 16,
      regionCode: 'UA56',
      name: 'Рівненський офіс',
      address: '33000, Рівненська обл., м. Рівне, вул. Польова, 2',
      phone: '0 800 219 714; +38 (0362) 23-45-67',
      email: 'office.rv.dcz.gov.ua',
      photoUrl: 'assets/images/office-placeholder.jpg'
    }
  ]);

  // Computed сигнали для отримання даних
  allRegions = computed(() => [...this.regionsData()].sort((a, b) => a.name.localeCompare(b.name)));
  allOffices = computed(() => [...this.officesData()]);

  // ============================================
  // Методи для роботи з заходами менторства
  // ============================================

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

  // ============================================
  // Методи для роботи з регіонами та офісами
  // ============================================

  /**
   * Отримати список всіх областей
   */
  getAllRegions(): Observable<Region[]> {
    return of(this.allRegions());
  }

  /**
   * Отримати область за кодом
   */
  getRegionByCode(code: string): Region | undefined {
    return this.regionsData().find(r => r.code === code);
  }

  /**
   * Отримати всі офіси
   */
  getAllOffices(): Observable<Office[]> {
    return of(this.allOffices());
  }

  /**
   * Отримати офіси за кодом області
   */
  getOfficesByRegion(regionCode: string): Observable<Office[]> {
    const filtered = this.allOffices().filter(o => o.regionCode === regionCode);
    return of(filtered);
  }

  /**
   * Отримати офіс за ID
   */
  getOfficeById(id: number): Office | undefined {
    return this.officesData().find(o => o.id === id);
  }

  /**
   * Отримати назву області за кодом
   */
  getRegionNameByCode(code: string): string {
    const region = this.getRegionByCode(code);
    return region ? region.name : code;
  }

  /**
   * Отримати список назв областей (для вибору в формі)
   */
  getRegionNames(): Observable<string[]> {
    return of(
      [...this.regionsData()]
        .map(r => r.name)
        .sort((a, b) => a.localeCompare(b))
    );
  }

  /**
   * Отримати теми консультацій
   */
  getConsultationTopics(): Observable<string[]> {
    const topics = [
      'Державні програми підтримки бізнесу',
      'Менторський супровід в отриманні мікрогранту',
      'Підбір грантових програм',
      'Інше'
    ];
    return of([...topics].sort((a, b) => a.localeCompare(b)));
  }

  // ============================================
  // Методи для роботи з базовими даними
  // ============================================

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

  // ============================================
  // Методи для роботи з заявками
  // ============================================

  /**
   * Подання універсальної заяви на менторську підтримку
   */
  submitMentorshipApplication(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mentorship/application`, data);
  }

  /**
   * Подання заявки на консультацію в офісі
   */
  submitConsultationRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mentorship/consultation`, data);
  }

  /**
   * Отримання статусу заяви
   */
  getApplicationStatus(applicationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mentorship/application/${applicationId}`);
  }
}
