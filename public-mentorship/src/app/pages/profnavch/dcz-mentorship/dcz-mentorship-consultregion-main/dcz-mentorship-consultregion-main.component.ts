import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DczMentorshipConsultregionBaseComponent } from '../dcz-mentorship-consultregion-base/dcz-mentorship-consultregion-base.component';

export interface Office {
  id: number;
  regionCode: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  photoUrl: string;
}

@Component({
  selector: 'app-dcz-mentorship-consultregion-main',
  templateUrl: './dcz-mentorship-consultregion-main.component.html',
  styleUrls: ['./dcz-mentorship-consultregion-main.component.css'],
  standalone: true,
  imports: [CommonModule, DczMentorshipConsultregionBaseComponent, MatButtonModule, MatIconModule, RouterLink]
})
export class DczMentorshipConsultregionMainComponent implements OnInit {
  selectedItem: string | null = null;
  opened = true;
  offices: Office[] = [];

  regionsList = [
    { code: 'UA05', name: 'Вінницька' },
    { code: 'UA07', name: 'Волинська' },
    { code: 'UA12', name: 'Дніпропетровська' },
    { code: 'UA18', name: 'Житомирська' },
    { code: 'UA21', name: 'Закарпатська' },
    { code: 'UA23', name: 'Запорізька' },
    { code: 'UA26', name: 'Івано-Франківська' },
    { code: 'UA80', name: 'Київ' },
    { code: 'UA32', name: 'Київська' },
    { code: 'UA35', name: 'Кіровоградська' },
    { code: 'UA44', name: 'Луганська' },
    { code: 'UA46', name: 'Львівська' },
    { code: 'UA48', name: 'Миколаївська' },
    { code: 'UA51', name: 'Одеська' },
    { code: 'UA53', name: 'Полтавська' },
    { code: 'UA56', name: 'Рівненська' }
  ];

  allOffices: Office[] = [
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
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Початкове завантаження з snapshot
    const initialFilter = this.route.snapshot.queryParams['filter'];
    if (initialFilter) {
      this.selectedItem = initialFilter;
      this.offices = this.allOffices.filter(o => o.regionCode === initialFilter);
    } else {
      this.offices = this.allOffices;
    }
    
    // Підписка на зміну query params
    this.route.queryParams.subscribe(params => {
      const filterValue = params['filter'];
      if (filterValue) {
        this.selectedItem = filterValue;
        this.offices = this.allOffices.filter(o => o.regionCode === filterValue);
      } else {
        this.offices = this.allOffices;
      }
    });
  }

  selectItem(id: string): void {
    this.selectedItem = id;
  }

  orderConsultation(office: Office): void {
    // Перенаправлення на форму запису, передаючи дані обраного офісу
    console.log('Замовлення консультації в:', office.name);
    this.router.navigate(['/profnavch/mentorship/consultation-form'], {
      state: { officeData: office }
    });
  }
}
