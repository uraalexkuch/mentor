import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export type ApplicationType = '' | 'TRAINING' | 'OFFICE_CONSULTATION' | 'MENTORSHIP';

interface ConsultationFormData {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  phone: string;
  email: string;
  isBusinessActive: '' | 'yes' | 'no';
  inactiveReason: string;
  receivedMicrogrant: '' | 'yes' | 'no';       // Отримував мікрогрант/грант «Власна справа»
  micrograntYear: string;                      // Рік отримання мікрогранту
  primaryBusinessActivity: string;             // Основний вид діяльності
  applicationType: ApplicationType;
  officeConsultationTopics: {
    businessPlans: boolean;
    personnel: boolean;
    creditPrograms: boolean;
  };
  otherTopic: string;
  desiredDate: string;
  applicantCategories: {
    idp: boolean;
    disability: boolean;
    combatant: boolean;
    warDisabled: boolean;
    familyMember: boolean;
    veteranEnterprise: boolean;
  };
  veteranFullName: string;
  veteranRnokpp: string;
  veteranPhone: string;
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
    receivedMicrogrant: '',
    micrograntYear: '',
    primaryBusinessActivity: '',
    applicationType: '',
    officeConsultationTopics: {
      businessPlans: false,
      personnel: false,
      creditPrograms: false
    },
    otherTopic: '',
    desiredDate: '',
    applicantCategories: {
      idp: false,
      disability: false,
      combatant: false,
      warDisabled: false,
      familyMember: false,
      veteranEnterprise: false
    },
    veteranFullName: '',
    veteranRnokpp: '',
    veteranPhone: ''
  };

  officeData: { name: string; address: string; phone: string; email: string } | null = null;
  submitted = false;
  submitSuccess = false;
  today = new Date().toISOString().split('T')[0];

  // \u0420\u043e\u043a\u0438 \u043e\u0442\u0440\u0438\u043c\u0430\u043d\u043d\u044f \u043c\u0456\u043a\u0440\u043e\u0433\u0440\u0430\u043d\u0442\u0443
  micrograntYears = [2022, 2023, 2024, 2025, 2026];

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
    
    return age >= 18 && age <= 25;
  }

  // Валідація форми
  get isFormValid(): boolean {
    const data = this.formData;
    
    // Перевірка наявності обраного типу послуги
    let hasApplicationTypeValid = data.applicationType !== '';
    
    // Якщо обрано консультацію в офісі для діючого підприємця (п.5)
    if (data.applicationType === 'OFFICE_CONSULTATION' && data.isBusinessActive === 'yes' && data.receivedMicrogrant === 'yes') {
      const hasOfficeTopic = data.officeConsultationTopics.businessPlans || 
                             data.officeConsultationTopics.personnel || 
                             data.officeConsultationTopics.creditPrograms;
      if (!hasOfficeTopic) {
        hasApplicationTypeValid = false;
      }
    }

    const businessValid =
      data.isBusinessActive === 'no' ||
      (
        data.isBusinessActive === 'yes' &&
        data.receivedMicrogrant !== '' &&
        (
          data.receivedMicrogrant === 'no' ||
          (
            data.receivedMicrogrant === 'yes' &&
            data.micrograntYear !== '' &&
            data.primaryBusinessActivity.trim().length > 0
          )
        )
      );

    const familyValid = !data.applicantCategories.familyMember || 
      (data.veteranFullName.trim().length > 0 && 
       data.veteranRnokpp.trim().length > 0 && 
       data.veteranPhone.trim().length > 0);

    return (
      data.lastName.trim().length > 0 &&
      data.firstName.trim().length > 0 &&
      data.birthDate.length > 0 &&
      data.phone.trim().length > 0 &&
      data.email.trim().length > 0 &&
      data.isBusinessActive !== '' &&
      businessValid &&
      hasApplicationTypeValid &&
      this.isAgeValid &&
      familyValid &&
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
      receivedMicrogrant: '', micrograntYear: '', primaryBusinessActivity: '',
      applicationType: '',
      officeConsultationTopics: { businessPlans: false, personnel: false, creditPrograms: false },
      otherTopic: '', desiredDate: '',
      applicantCategories: {
        idp: false,
        disability: false,
        combatant: false,
        warDisabled: false,
        familyMember: false,
        veteranEnterprise: false
      },
      veteranFullName: '',
      veteranRnokpp: '',
      veteranPhone: ''
    };
  }
}
