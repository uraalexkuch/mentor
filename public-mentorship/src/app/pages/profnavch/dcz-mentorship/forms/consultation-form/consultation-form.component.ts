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

  // Дані форми
  formData: ConsultationFormData = {
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
  };

  officeData: { name: string; address: string; phone: string; email: string } | null = null;
  submitted = false;
  submitSuccess = false;
  today = new Date().toISOString().split('T')[0];

  // Список областей
  regions = [
    'Вінницька область', 'Волинська область', 'Дніпропетровська область', 'Донецька область',
    'Житомирська область', 'Закарпатська область', 'Запорізька область', 'Івано-Франківська область',
    'Київська область', 'Кіровоградська область', 'Луганська область', 'Львівська область',
    'Миколаївська область', 'Одеська область', 'Полтавська область', 'Рівненська область',
    'Сумська область', 'Тернопільська область', 'Харківська область', 'Херсонська область',
    'Хмельницька область', 'Черкаська область', 'Чернівецька область', 'Чернігівська область', 'м. Київ'
  ];

  // Перевірка віку (не старше 25)
  get isAgeValid(): boolean {
    const data = this.formData;
    const birthDateStr = data.birthDate;
    if (!birthDateStr) return true; // valid initially, required handles emptiness
    
    const birthDate = new Date(birthDateStr);
    const todayDate = new Date();
    let age = todayDate.getFullYear() - birthDate.getFullYear();
    const m = todayDate.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && todayDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age <= 25;
  }

  // Валідація форми
  get isFormValid(): boolean {
    const data = this.formData;
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
      this.isAgeValid &&
      data.desiredDate.length > 0
    );
  }

  constructor() {
    // Спочатку намагаємося отримати дані з sessionStorage (надійніший спосіб)
    if (typeof sessionStorage !== 'undefined') {
      const officeDataJson = sessionStorage.getItem('selectedOfficeData');
      if (officeDataJson) {
        try {
          this.officeData = JSON.parse(officeDataJson);
        } catch (e) {
          console.error('Помилка парсингу даних офісу:', e);
        }
      }

      // Отримуємо персональні дані з sessionStorage (з форми реєстрації)
      const personalDataJson = sessionStorage.getItem('consultationPersonalData');
      if (personalDataJson) {
        try {
          const p = JSON.parse(personalDataJson);
          this.formData = {
            ...this.formData,
            lastName: p.lastName || '',
            firstName: p.firstName || '',
            middleName: p.middleName || '',
            birthDate: p.birthDate || '',
            phone: p.phone || '',
            email: p.email || '',
            isBusinessActive: p.isBusinessActive || ''
          };
        } catch (e) {
          console.error('Помилка парсингу персональних даних:', e);
        }
      }
    }

    // Фоллбек на router state для сумісності
    const nav = this.router.getCurrentNavigation();
    const stateData = nav?.extras?.state;

    if (!this.officeData && stateData?.['officeData']) {
      this.officeData = stateData['officeData'];
    }

    if (stateData?.['personalData'] && typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('consultationPersonalData')) {
      const p = stateData['personalData'];
      this.formData = {
        ...this.formData,
        lastName: p.lastName || '',
        firstName: p.firstName || '',
        middleName: p.middleName || '',
        birthDate: p.birthDate || '',
        phone: p.phone || '',
        email: p.email || '',
        isBusinessActive: p.isBusinessActive || ''
      };
    }
  }

  onSubmit(): void {
    if (!this.isFormValid) return;
    
    this.submitted = true;
    console.log('Форма відправлена:', this.formData, 'Офіс:', this.officeData);
    this.submitSuccess = true;
  }

  goBack(): void {
    this.router.navigate(['/profnavch/mentorship/consultants']);
  }

  resetForm(): void {
    this.submitSuccess = false;
    this.submitted = false;
    this.formData = {
      lastName: '', firstName: '', middleName: '', birthDate: '',
      phone: '', email: '', isBusinessActive: '', inactiveReason: '',
      consultationTopics: { statePrograms: false, grantSelection: false, mentorSupport: false, other: false },
      otherTopic: '', desiredDate: ''
    };
  }
}
