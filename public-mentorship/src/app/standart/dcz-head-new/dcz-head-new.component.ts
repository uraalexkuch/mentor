import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import {MatMenu} from "@angular/material/menu";
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf, NgFor, NgStyle, NgClass } from '@angular/common';
import {AccessibilityPanelComponent} from "../../accessibility-panel/accessibility-panel.component";
import {AccessibilityService} from "../../services/accessibility.service";

@Component({
  selector: 'app-dcz-head-new',
  templateUrl: './dcz-head-new.component.html',
  styleUrls: ['./dcz-head-new.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0%)'
      })),
      state('out', style({
        transform: 'translateX(-100%)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ],
  standalone: true,
  imports: [RouterLink, NgIf, MatTooltipModule, MatIconModule, NgFor, NgStyle, NgClass, MatSidenavModule, MatButtonModule, MatDividerModule, RouterOutlet, AccessibilityPanelComponent]
})
export class DczHeadNewComponent  {
  activeIndex: number = -1;
  menuItems = [
    {
      title: 'Про нас',
      subItems: [
        {title: 'Місія та команда', link: '/about'},
        {
          title: 'Документи',
          link: '/low'
        },
        {title: 'Правління Фонду', link: '/Fond'},
        {title: 'Бюджет', link: '/budget'},
        {title: 'Книга пам\'яті', link: '/memory'}
      ],
      visible: false
    },
    {
      title: 'Діяльність',
      subItems: [
        {
        title: 'Звіти про роботу', link: '/result'},
        { title: 'Оцінка ефективності', link: '/kpi'},
        {
          title: 'Відкриті дані',
          link: '/dateopen'
        },
        {title: 'Публічні закупівлі', link: '/publictrade'},
        {
          title: 'Запобігання корупції',
          link: '/korup'
        },
        {title: 'Додаткова інформація', link: '/other'}
      ],
      visible: false
    },
    {title: 'Зроблено в Україні', link: '/madeukraine'},

    {
      title: 'Прес-центр',
      subItems: [{title: 'Новини', link: '/news'},
        {title: 'Анонси', link: '/previewnews'},

        {title: 'Контакти прес-служби', link: '/presscontact'}],
      visible: false
    },
    {
      title: 'Контакти',
      subItems: [{title: 'Апарат', link: '/aparat'},
        {title: 'Регіональні ЦЗ (філії)', link: '/regioncz'},
        {title: 'Навчальні заклади', link: '/regioncpto'},

        {title: 'Контакт-центр', link: '/hotline'}],
      visible: false
    }
  ];
  regions = [
    {name: 'Вінницька', url: 'https://vin.dcz.gov.ua'},
    {name: 'Волинська', url: 'https://vol.dcz.gov.ua'},
    {name: 'Дніпропетровська', url: 'https://dnp.dcz.gov.ua'},
    {name: 'Донецька', url: 'https://don.dcz.gov.ua'},
    {name: 'Житомирська', url: 'https://zhy.dcz.gov.ua'},
    {name: 'Закарпатська', url: 'https://zak.dcz.gov.ua'},
    {name: 'Запорізька', url: 'https://zap.dcz.gov.ua'},
    {name: 'Івано-Франківська', url: 'https://ifr.dcz.gov.ua'},
    {name: 'Київ', url: 'https://kie.dcz.gov.ua'},
    {name: 'Київська', url: 'https://kir.dcz.gov.ua'},
    {name: 'Кіровоградська', url: 'https://kid.dcz.gov.ua'},
    {name: 'Луганська', url: 'https://lug.dcz.gov.ua'},
    {name: 'Львівська', url: 'https://lviv.dcz.gov.ua'},
    {name: 'Миколаївська', url: 'https://mik.dcz.gov.ua'},
    {name: 'Одеська', url: 'https://ode.dcz.gov.ua'},
    {name: 'Полтавська', url: 'https://pol.dcz.gov.ua'},
    {name: 'Рівненська', url: 'https://rov.dcz.gov.ua'},
    {name: 'Сумська', url: 'https://sum.dcz.gov.ua'},
    {name: 'Тернопільська', url: 'https://ter.dcz.gov.ua'},
    {name: 'Харківська', url: 'https://kha.dcz.gov.ua'},
    {name: 'Херсонська', url: 'https://khe.dcz.gov.ua'},
    {name: 'Хмельницька', url: 'https://khm.dcz.gov.ua'},
    {name: 'Черкаська', url: 'https://chk.dcz.gov.ua'},
    {name: 'Чернівецька', url: 'https://chn.dcz.gov.ua'},
    {name: 'Чернігівська', url: 'https://chg.dcz.gov.ua/'}
  ];
  @ViewChild('sidenav') sidenav?: MatSidenav;
  isAccessibilityPanelVisible = false;
  private accessibilityService = inject(AccessibilityService);
  menu!: MatMenu | null;
  isMobile = false;
  isHighContrast = false;
  dropdownOpen: boolean = false;
  constructor(private breakpointObserver: BreakpointObserver, private renderer: Renderer2,  private el: ElementRef, private router: Router) {
    breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });

  }

  toggleHighContrast() {
    this.isHighContrast = !this.isHighContrast;
    if (this.isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.closeAllMenus();
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    // Перевіряємо, чи клік відбувається поза поточним меню та не на іншому елементі меню
    if (target && !target.closest('.menu-item') && !target.closest('.menu-item-type-taxonomy')) {
      this.dropdownOpen = false;
    }
  }
  closeDropdown() {
    if (this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }
  resetMenuState() {
    // Reset active menu item
    this.activeIndex = -1;
    // Hide all sub-menus
    this.menuItems.forEach(item => {
      item.visible = false;
    });
  }



  setHeight() {
    // Додаємо перевірку, щоб переконатися, що елементи існують
    const headerBottom = this.el.nativeElement.querySelector('.header-bottom');
    const subMenu = this.el.nativeElement.querySelector('.sub-menu.h7');

    if (headerBottom && subMenu) {
      const height = headerBottom.offsetHeight + 'px';
      this.renderer.setStyle(subMenu, 'height', height);
    }
  }

  navigateTo(link: string) {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
  closeAllMenus() {
    this.menuItems.forEach(item => item.visible = false);

    this.resetMenuState()
  }

  toggleMenuTop(index: number) {
    if (this.menuItems[index].visible) {
      this.menuItems[index].visible = false;
      this.activeIndex = -1;

    } else {
      this.closeAllMenus();
      this.menuItems[index].visible = true;
      this.activeIndex = index;
      this.dropdownOpen = false;

      // **ВИПРАВЛЕННЯ:** Викликаємо setHeight тут, але з невеликою затримкою.
      // setTimeout гарантує, що функція виконається після того, як Angular оновить DOM.
      setTimeout(() => this.setHeight(), 0);
    }
  }
  toggleAccessibilityPanel(): void {
    this.isAccessibilityPanelVisible = !this.isAccessibilityPanelVisible;

    // ЗМІНЕНО: Якщо панель щойно закрили, викликаємо скидання налаштувань
    if (!this.isAccessibilityPanelVisible) {
      this.accessibilityService.resetToDefaults();
    }
  }

  handleSubItemClick(): void {
    // Navigate to the link
    // assuming you have injected the Router
    this.dropdownOpen = false;
    // Close all menus
    this.closeAllMenus();
  }

  toggleMenuTopMob(index: number) {
    if (this.activeIndex === index) {
      this.menuItems[index].visible = !this.menuItems[index].visible;
      this.activeIndex = -1;
      return;
    }
    this.menuItems.forEach(item => item.visible = false); // Close all other menus
    if (this.dropdownOpen) {
      this.dropdownOpen = false;
    }
    this.menuItems[index].visible = true;
    this.activeIndex = index;

  }



}
