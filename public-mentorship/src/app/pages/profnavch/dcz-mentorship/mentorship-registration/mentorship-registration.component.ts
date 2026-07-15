import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageValidator(maxAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age > maxAge ? { maxAgeInvalid: true } : null;
  };
}
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { Router } from '@angular/router';
import { ScrollUpComponent } from '../../../../components/scroll-up/scroll-up.component';
import { ConsentDialogComponent } from '../../consent-dialog/consent-dialog.component';

@Component({
  selector: 'app-mentorship-registration',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    BreadcrumbComponent,
    ScrollUpComponent
  ],
  templateUrl: './mentorship-registration.component.html',
  styleUrls: ['./mentorship-registration.component.css']
})
export class MentorshipRegistrationComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  // Signals для станів
  isSubmitting = signal(false);
  showSuccessMessage = signal(false);
  isMobile = signal(false);
  consentAccepted = signal(false);

  wizardForm!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];

  // Computed сигнал для валідації форми
  isFormValid = computed(() => {
    return this.wizardForm.valid && !this.isSubmitting();
  });

  // Signals для даних
  regions = signal([
    'Вінницька область', 'Волинська область', 'Дніпропетровська область', 'Донецька область', 
    'Житомирська область', 'Закарпатська область', 'Запорізька область', 'Івано-Франківська область', 
    'Київська область', 'Кіровоградська область', 'Луганська область', 'Львівська область', 
    'Миколаївська область', 'Одеська область', 'Полтавська область', 'Рівненська область', 
    'Сумська область', 'Тернопільська область', 'Харківська область', 'Херсонська область', 
    'Хмельницька область', 'Черкаська область', 'Чернівецька область', 'Чернігівська область', 'м. Київ'
  ]);

  consultationTopics = signal([
    'Державні програми підтримки бізнесу',
    'Менторський супровід в отриманні мікрогранту',
    'Підбір грантових програм',
    'Інше'
  ]);

  officeData: { name: string; address: string; phone: string; email: string } | null = null;

  constructor() {
    // Отримання даних з state при навігації
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['officeData']) {
      this.officeData = nav.extras.state['officeData'];
    } else {
      const stateData = history.state?.officeData;
      if (stateData) {
        this.officeData = stateData;
      }
    }

    // Ініціалізація форми
    this.initForm();
    
    // Effect для моніторингу змін форми
    effect(() => {
      const formValue = this.wizardForm.value;
      console.log('Зміна форми:', formValue);
    });
  }

  ngOnInit(): void {
    this.setupDynamicValidation();
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    this.openConsentDialog();
  }

  openConsentDialog(): void {
    const dialogRef = this.dialog.open(ConsentDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: true,
      data: { title: 'Підтвердження згоди на обробку даних' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consentAccepted.set(true);
      } else {
        alert('Для продовження заповнення форми необхідно надати згоду на обробку персональних даних.');
        this.openConsentDialog();
      }
    });
  }

  checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  private initForm(): void {
    this.wizardForm = this.fb.group({
      // Крок 1: Ідентифікація
      step1_identity: this.fb.group({
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        middleName: [''],
        birthDate: ['', [Validators.required, ageValidator(25)]],
        rnokpp: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        region: ['', Validators.required]
      }),
      // Крок 2: Статус та Вибір напрямку
      step2_needs: this.fb.group({
        isActiveBusiness: ['no', Validators.required],
        applicationType: ['MENTORSHIP', Validators.required]
      }),
      // Крок 3: Деталізація (Динамічний крок)
      step3_details: this.fb.group({
        // Поля для програми Менторства
        needsTraining: [{ value: false, disabled: true }],
        needsMentorship: [{ value: false, disabled: true }],
        notYouthWorker: [{ value: false, disabled: true }, Validators.requiredTrue],
        
        // Поля для Офісу
        consultationTopic: [{ value: '', disabled: true }, Validators.required],
        desiredDate: [{ value: '', disabled: true }, Validators.required]
      })
    });
  }

  private setupDynamicValidation(): void {
    const typeControl = this.wizardForm.get('step2_needs.applicationType');
    const businessControl = this.wizardForm.get('step2_needs.isActiveBusiness');
    const step3 = this.wizardForm.get('step3_details');

    // Автоматичний вибір напрямку в залежності від статусу бізнесу
    businessControl?.valueChanges.subscribe((isActive: string) => {
      if (isActive === 'no') {
        typeControl?.setValue('MENTORSHIP');
      } else if (isActive === 'yes') {
        typeControl?.setValue('OFFICE_CONSULTATION');
      }
    });

    typeControl?.valueChanges.subscribe((type: string) => {
      if (type === 'MENTORSHIP') {
        // Увімкнути поля менторства
        step3?.get('needsTraining')?.enable();
        step3?.get('notYouthWorker')?.enable();
        
        // Вимкнути поля офісу
        step3?.get('consultationTopic')?.disable();
        step3?.get('desiredDate')?.disable();
        step3?.get('needsMentorship')?.disable();
      } else if (type === 'OFFICE_CONSULTATION') {
        // Увімкнути поля офісу
        step3?.get('consultationTopic')?.enable();
        step3?.get('desiredDate')?.enable();
        step3?.get('needsMentorship')?.enable();
        
        // Вимкнути поля менторства
        step3?.get('needsTraining')?.disable();
        step3?.get('notYouthWorker')?.disable();
      }
    });
  }

  formatPhoneNumber(): void {
    const phoneCtrl = this.wizardForm.get('step1_identity.phone');
    if (phoneCtrl?.value) {
      let phone = phoneCtrl.value.replace(/\D/g, '');
      if (phone.length >= 10 && phone.length < 12) {
        phone = phone.replace(/^38/, '');
        const formatted = '+38 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
        phoneCtrl.setValue(formatted, {emitEvent: false});
      }
    }
  }

  onSubmit(): void {
    if (this.wizardForm.invalid) {
      this.wizardForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.wizardForm.getRawValue();

    // Формування payload згідно з цільовими ідентифікаторами корпоративної БД
    const payload = {
      dcz_application_type: formData.step2_needs.applicationType,
      dcz_applicant_lastname: formData.step1_identity.lastName,
      dcz_applicant_firstname: formData.step1_identity.firstName,
      dcz_applicant_middlename: formData.step1_identity.middleName,
      dcz_applicant_rnokpp: formData.step1_identity.rnokpp,
      dcz_applicant_birthdate: formData.step1_identity.birthDate,
      dcz_applicant_phone: formData.step1_identity.phone,
      dcz_applicant_email: formData.step1_identity.email,
      dcz_region_code: formData.step1_identity.region,
      dcz_is_active_entrepreneur: formData.step2_needs.isActiveBusiness === 'yes',
      dcz_mentorship_needs_training: formData.step3_details.needsTraining || false,
      dcz_mentorship_needs_support: formData.step3_details.needsMentorship || false,
      dcz_office_consultation_topic: formData.step3_details.consultationTopic || null,
      dcz_office_desired_date: formData.step3_details.desiredDate || null
    };

    console.log('Сформований пакет даних для БД:', payload);
    
    // Імітація обробки
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.showSuccessMessage.set(true);
    }, 1500);
  }

  resetForm(): void {
    this.showSuccessMessage.set(false);
    this.wizardForm.reset();
    this.initForm();
    this.setupDynamicValidation();
  }

  getStepGroup(stepName: string): FormGroup {
    return this.wizardForm.get(stepName) as FormGroup;
  }

  // Обробка переходу з Кроку 2
  onStep2Next(stepper: any): void {
    if (this.wizardForm.get('step2_needs.applicationType')?.value === 'OFFICE_CONSULTATION') {
      // Зберігаємо персональні дані в sessionStorage для форми консультації
      const identityData = this.wizardForm.get('step1_identity')?.value;
      if (identityData) {
        sessionStorage.setItem('consultationPersonalData', JSON.stringify({
          lastName: identityData.lastName,
          firstName: identityData.firstName,
          middleName: identityData.middleName,
          birthDate: identityData.birthDate,
          phone: identityData.phone,
          email: identityData.email
        }));
      }
      // Перенаправляємо на сторінку офісів
      this.router.navigate(['/profnavch/mentorship/consultants']);
    } else {
      // Інакше йдемо до Кроку 3 (Навчання)
      stepper.next();
    }
  }
}
