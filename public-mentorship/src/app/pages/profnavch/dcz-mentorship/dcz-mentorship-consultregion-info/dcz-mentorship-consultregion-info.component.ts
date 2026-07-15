import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

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
  selector: 'app-dcz-mentorship-consultregion-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dcz-mentorship-consultregion-info.component.html',
  styleUrls: ['./dcz-mentorship-consultregion-info.component.css']
})
export class DczMentorshipConsultregionInfoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals для даних
  filterParam = toSignal(this.route.queryParams.pipe(), { initialValue: {} });
  
  filteredOffices = computed(() => {
    const filter = (this.filterParam() as any)['filter'];
    return filter 
      ? this.allOffices.filter(o => o.regionCode === filter)
      : this.allOffices;
  });

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

  constructor() {}

  ngOnInit(): void {
    // Signals автоматично оновлюються через computed з toSignal
  }

  orderConsultation(office: Office): void {
    console.log('Замовлення консультації в:', office.name);
    sessionStorage.setItem('selectedOfficeData', JSON.stringify(office));
    this.router.navigate(['/profnavch/mentorship/consultation-form']);
  }
}
