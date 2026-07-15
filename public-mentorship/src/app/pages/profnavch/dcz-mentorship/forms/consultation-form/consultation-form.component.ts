import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ConsultationFormData {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  phone: string;
  email: string;
  isBusinessActive: '' | 'yes' | 'no';
  inactiveReason: string;
  consultationTopics: {
    statePrograms: boolean;
    grantSelection: boolean;
    mentorSupport: boolean;
    other: boolean;
  };
  otherTopic: string;
  desiredDate: string;
}

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.css']
})
export class ConsultationFormComponent {
  private router = inject(Router);

  // Signals для даних форми
  formData = signal<ConsultationFormData>({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    phone: '',
    email: '',
    isBusinessActive: '',
    inactiveReason: '',
    consultationTopics: {
      statePrograms: false,
      grantSelection: false,
      mentorSupport: false,
      other: false
    },
    otherTopic: '',
    desiredDate: ''
  });

  officeData = signal<{ name: string; address: string; phone: string; email: string } | null>(null);
  submitted = signal(false);
  submitSuccess = signal(false);
  today = signal(new Date().toISOString().split('T')[0]);

  // Список областей
  regions = [
    'Вінницька область',
    'Волинська область',
    'Дніпропетровська область',
    'Донецька область',
    'Житомирська область',
    'Закарпатська область',
    'Запорізька область',
    'Івано-Франківська область',
    'Київська область',
    'Кіровоградська область',
    'Луганська область',
    'Львівська область',
    'Миколаївська область',
    'Одеська область',
    'Полтавська область',
    'Рівненська область',
    'Сумська область',
    'Тернопільська область',
    'Харківська область',
    'Херсонська область',
    'Хмельницька область',
    'Черкаська область',
    'Чернівецька область',
    'Чернігівська область',
    'м. Київ'
  ];

  // Computed сигнал для перевірки віку (не старше 25)
  isAgeValid = computed(() => {
    const data = this.formData();
    const birthDateStr = data.birthDate;
    if (!birthDateStr) return true; // valid initially, required handles emptiness
    
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age <= 25;
  });

  // Computed сигнал для валідації форми
  isFormValid = computed(() => {
    const data = this.formData();
    const hasConsultationTopic = 
      data.consultationTopics.statePrograms ||
      data.consultationTopics.grantSelection ||
      data.consultationTopics.mentorSupport ||
      (data.consultationTopics.other && data.otherTopic.trim().length > 0);

    const businessValid = 
      data.isBusinessActive === 'yes' ||
      (data.isBusinessActive === 'no' && data.inactiveReason.trim().length > 0);

    return (
      data.lastName.trim().length > 0 &&
      data.firstName.trim().length > 0 &&
      data.birthDate.length > 0 &&
      data.phone.trim().length > 0 &&
      data.email.trim().length > 0 &&
      data.isBusinessActive !== '' &&
      businessValid &&
      hasConsultationTopic &&
      this.isAgeValid() &&
      data.desiredDate.length > 0
    );
  });

  constructor() {
    // Спочатку намагаємося отримати дані з sessionStorage (надійніший спосіб)
    const officeDataJson = sessionStorage.getItem('selectedOfficeData');
    if (officeDataJson) {
      try {
        this.officeData.set(JSON.parse(officeDataJson));
      } catch (e) {
        console.error('Помилка парсингу даних офісу:', e);
      }
    }

    // Отримуємо персональні дані з sessionStorage (з форми реєстрації)
    const personalDataJson = sessionStorage.getItem('consultationPersonalData');
    if (personalDataJson) {
      try {
        const p = JSON.parse(personalDataJson);
        this.formData.update(current => ({
          ...current,
          lastName: p.lastName || '',
          firstName: p.firstName || '',
          middleName: p.middleName || '',
          birthDate: p.birthDate || '',
          phone: p.phone || '',
          email: p.email || '',
          isBusinessActive: p.isBusinessActive || ''
        }));
      } catch (e) {
        console.error('Помилка парсингу персональних даних:', e);
      }
    }

    // Фоллбек на router state для сумісності
    const nav = this.router.getCurrentNavigation();
    const stateData = nav?.extras?.state;

    if (!this.officeData() && stateData?.['officeData']) {
      this.officeData.set(stateData['officeData']);
    }

    if (!personalDataJson && stateData?.['personalData']) {
      const p = stateData['personalData'];
      this.formData.update(current => ({
        ...current,
        lastName: p.lastName || '',
        firstName: p.firstName || '',
        middleName: p.middleName || '',
        birthDate: p.birthDate || '',
        phone: p.phone || '',
        email: p.email || '',
        isBusinessActive: p.isBusinessActive || ''
      }));
    }
  }

  // Helper методи для оновлення даних
  updateField<K extends keyof ConsultationFormData>(field: K, value: ConsultationFormData[K]): void {
    this.formData.update(current => ({ ...current, [field]: value }));
  }

  updateConsultationTopic(topic: keyof ConsultationFormData['consultationTopics'], value: boolean): void {
    this.formData.update(current => ({
      ...current,
      consultationTopics: { ...current.consultationTopics, [topic]: value }
    }));
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;
    
    this.submitted.set(true);
    console.log('Форма відправлена:', this.formData(), 'Офіс:', this.officeData());
    this.submitSuccess.set(true);
  }

  goBack(): void {
    this.router.navigate(['/profnavch/mentorship/consultants']);
  }

  resetForm(): void {
    this.submitSuccess.set(false);
    this.submitted.set(false);
    this.formData.update(() => ({
      lastName: '', firstName: '', middleName: '', birthDate: '',
      phone: '', email: '', isBusinessActive: '', inactiveReason: '',
      consultationTopics: { statePrograms: false, grantSelection: false, mentorSupport: false, other: false },
      otherTopic: '', desiredDate: ''
    }));
  }
}
