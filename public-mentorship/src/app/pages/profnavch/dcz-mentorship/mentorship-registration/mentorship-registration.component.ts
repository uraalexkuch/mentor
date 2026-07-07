import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreadcrumbComponent } from 'xng-breadcrumb';
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
    MatDialogModule,
    BreadcrumbComponent,
    ScrollUpComponent
  ],
  templateUrl: './mentorship-registration.component.html',
  styleUrls: ['./mentorship-registration.component.css']
})
export class MentorshipRegistrationComponent implements OnInit {
  private fb = new FormBuilder();
  
  registrationForm!: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  isMobile = false;
  consentAccepted = false;

  constructor(private dialog: MatDialog) {}

  // Імітація списку регіонів
  regions = [
    { value: 'vin', viewValue: 'Вінницька область' },
    { value: 'vol', viewValue: 'Волинська область' },
    { value: 'dnp', viewValue: 'Дніпропетровська область' },
    { value: 'don', viewValue: 'Донецька область' },
    { value: 'iro', viewValue: 'Івано-Франківська область' },
    { value: 'kyh', viewValue: 'Кіровоградська область' },
    { value: 'lom', viewValue: 'Луганська область' },
    { value: 'lviv', viewValue: 'Львівська область' },
    { value: 'myk', viewValue: 'Миколаївська область' },
    { value: 'odn', viewValue: 'Одеська область' },
    { value: 'polt', viewValue: 'Полтавська область' },
    { value: 'rivne', viewValue: 'Рівненська область' },
    { value: 'smart', viewValue: 'м. Київ' },
    { value: 'smy', viewValue: 'Сумська область' },
    { value: 'tern', viewValue: 'Тернопільська область' },
    { value: 'khark', viewValue: 'Харківська область' },
    { value: 'kherson', viewValue: 'Херсонська область' },
    { value: 'khm', viewValue: 'Хмельницька область' },
    { value: 'cherk', viewValue: 'Черкаська область' },
    { value: 'chernivtsi', viewValue: 'Чернівецька область' },
    { value: 'chernih', viewValue: 'Чернігівська область' }
  ];

  centers = [
    'Київський міський центр зайнятості',
    'Львівський обласний центр зайнятості',
    'Одеський обласний центр зайнятості',
    'Харківський обласний центр зайнятості'
  ];

  ngOnInit(): void {
    this.initForm();
    this.setupDynamicValidation();
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    this.openConsentDialog();
  }

  openConsentDialog(): void {
    const dialogRef = this.dialog.open(ConsentDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { title: 'Підтвердження згоди на обробку даних' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consentAccepted = true;
        this.registrationForm.get('consentDataProcessing')?.setValue(true);
        this.registrationForm.get('consentDataProcessing')?.updateValueAndValidity();
      } else {
        alert('Для продовження заповнення форми необхідно надати згоду на обробку персональних даних.');
        this.openConsentDialog();
      }
    });
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  private initForm(): void {
    this.registrationForm = this.fb.group({
      // Блок 1: Персональні дані
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      birthDate: ['', [Validators.required, this.ageValidator(18, 25)]], // Відповідно до п. 2 Порядку
      rnokpp: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      passport: ['', Validators.required],
      centerName: ['', Validators.required],

      // Блок 2: Контакти
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      region: ['', Validators.required],

      // Блок 3: Динамічний статус згідно з Алгоритмом
      isActiveEntrepreneur: ['no', Validators.required],
      receivedGrant: ['no'],
      grantYear: [''],
      mainActivity: [''],

      // Блок 4: Потреби (п. 4 Порядку)
      needsTraining: [false],
      needsMentorship: [false],
      needsPracticalHelp: [false],
      needsGrantHelp: [false],

      // Блок 5: Додаткові статуси (п. 2 Порядку)
      isIdp: [false],
      hasDisability: [false],

      // Блок 6: Юридичні згоди
      consentDataProcessing: [false, Validators.requiredTrue],
      // НОВА ЗГОДА: Перевірка п. 14 Порядку (Постанова № 1252)
      notYouthWorker: [false, Validators.requiredTrue],
      // НОВА ЗГОДА: Перевірка п. 13 Порядку (Податки та робочі місця)
      consentTaxCheck: [false] 
    });
  }

  // Налаштування динамічної появи полів та валідації
  private setupDynamicValidation(): void {
    // Відслідковуємо зміну "Чи є Ви діючим підприємцем?"
    this.registrationForm.get('isActiveEntrepreneur')?.valueChanges.subscribe(value => {
      const receivedGrantCtrl = this.registrationForm.get('receivedGrant');
      if (value === 'yes') {
        receivedGrantCtrl?.setValidators(Validators.required);
      } else {
        receivedGrantCtrl?.clearValidators();
        receivedGrantCtrl?.setValue('no');
      }
      receivedGrantCtrl?.updateValueAndValidity();
    });

    // Відслідковуємо зміну "Чи отримували Ви мікрогрант?"
    this.registrationForm.get('receivedGrant')?.valueChanges.subscribe(value => {
      const grantYearCtrl = this.registrationForm.get('grantYear');
      const mainActivityCtrl = this.registrationForm.get('mainActivity');
      const consentTaxCheckCtrl = this.registrationForm.get('consentTaxCheck');
      
      if (value === 'yes') {
        grantYearCtrl?.setValidators([Validators.required, Validators.pattern(/^(202[2-9])$/)]);
        mainActivityCtrl?.setValidators(Validators.required);
        // Згода на перевірку податків стає обов'язковою для грантоотримувачів згідно з п.13
        consentTaxCheckCtrl?.setValidators(Validators.requiredTrue);
      } else {
        grantYearCtrl?.clearValidators();
        grantYearCtrl?.setValue('');
        mainActivityCtrl?.clearValidators();
        mainActivityCtrl?.setValue('');
        consentTaxCheckCtrl?.clearValidators();
        consentTaxCheckCtrl?.setValue(false);
      }
      grantYearCtrl?.updateValueAndValidity();
      mainActivityCtrl?.updateValueAndValidity();
      consentTaxCheckCtrl?.updateValueAndValidity();
    });
  }

  private ageValidator(min: number, max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return (age >= min && age <= max) ? null : { ageOutOfRange: { currentAge: age, min, max } };
    };
  }

  formatPhoneNumber(): void {
    const phoneCtrl = this.registrationForm.get('phone');
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
    // Перевірка, чи вибрана хоча б одна послуга
    const formVal = this.registrationForm.value;
    const hasService = formVal.needsTraining || formVal.needsMentorship || formVal.needsPracticalHelp || formVal.needsGrantHelp;
    
    if (!hasService) {
      alert('Будь ласка, оберіть хоча б один вид послуги (Блок 4).');
      return;
    }

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    console.log('Дані заяви на менторство:', this.registrationForm.getRawValue());
    
    // Імітація запиту
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccessMessage = true;
    }, 1500);
  }

  resetForm(): void {
    this.showSuccessMessage = false;
    this.registrationForm.reset();
    this.initForm();
  }
}
