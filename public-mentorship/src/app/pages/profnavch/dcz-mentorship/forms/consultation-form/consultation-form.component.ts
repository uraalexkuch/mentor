import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.css']
})
export class ConsultationFormComponent implements OnInit {
  officeData: { name: string; address: string; phone: string; email: string } | null = null;
  today: string = new Date().toISOString().split('T')[0];

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

  // Дані форми
  formData = {
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    phone: '',
    email: '',
    isBusinessActive: '' as '' | 'yes' | 'no',
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

  submitted = false;
  submitSuccess = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const stateData = nav?.extras?.state || history.state;

    if (stateData?.['officeData']) {
      this.officeData = stateData['officeData'];
    }

    if (stateData?.['personalData']) {
      const p = stateData['personalData'];
      this.formData.lastName = p.lastName || '';
      this.formData.firstName = p.firstName || '';
      this.formData.middleName = p.middleName || '';
      this.formData.birthDate = p.birthDate || '';
      this.formData.phone = p.phone || '';
      this.formData.email = p.email || '';
    }
  }

  get isFormValid(): boolean {
    const hasConsultationTopic =
      this.formData.consultationTopics.statePrograms ||
      this.formData.consultationTopics.grantSelection ||
      this.formData.consultationTopics.mentorSupport ||
      (this.formData.consultationTopics.other && this.formData.otherTopic.trim().length > 0);

    const businessValid =
      this.formData.isBusinessActive === 'yes' ||
      (this.formData.isBusinessActive === 'no' && this.formData.inactiveReason.trim().length > 0);

    return (
      this.formData.lastName.trim().length > 0 &&
      this.formData.firstName.trim().length > 0 &&
      this.formData.birthDate.length > 0 &&
      this.formData.phone.trim().length > 0 &&
      this.formData.email.trim().length > 0 &&
      this.formData.isBusinessActive !== '' &&
      businessValid &&
      hasConsultationTopic &&
      this.formData.desiredDate.length > 0
    );
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.isFormValid) return;

    // Тут можна відправити дані на сервер
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
  }
}
