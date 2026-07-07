import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { ScrollUpComponent } from '../../../../../components/scroll-up/scroll-up.component';

@Component({
  selector: 'app-mentorship-program',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatTableModule,
    MatIconModule,
    BreadcrumbComponent,
    ScrollUpComponent
  ],
  templateUrl: './mentorship-program.component.html',
  styleUrls: ['./mentorship-program.component.css']
})
export class MentorshipProgramComponent implements OnInit {
  router = inject(Router);
  panelOpenState = false;
  isMobile = false;

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  // Дані для Реєстру освітніх програм
  displayedColumnsProf: string[] = ['id', 'courseName', 'duration', 'format'];
  dataSourceProf = [
    { id: 1, courseName: 'Основи підприємницької діяльності та бізнес-планування', duration: '30 годин (6 тижнів)', format: 'Змішаний (Офлайн/Онлайн)' },
    { id: 2, courseName: 'Управління фінансами для мікробізнесу', duration: '20 годин (4 тижні)', format: 'Онлайн' },
    { id: 3, courseName: 'Презентація бізнес-ідей та маркетинг', duration: '15 годин (3 тижні)', format: 'Офлайн' }
  ];

  faq = [
    {
      title: 'Хто може брати участь у програмі?',
      content: 'Особи віком від 18 до 25 років, які хочуть започаткувати власний бізнес або вже є діючими отримувачами мікрогранту.'
    },
    {
      title: 'Яка тривалість навчання?',
      content: 'Тримісячний курс, що включає бізнес-планування, управління фінансами та практичні навички.'
    },
    {
      title: 'Що дає сертифікат після завершення навчання?',
      content: 'Сертифікат дає право на отримання мікрогранту "Власна справа" за спрощеною процедурою без проходження співбесіди в центрі зайнятості.'
    },
    {
      title: 'Коли починається менторський супровід?',
      content: 'Менторський супровід надається після 12 місяців діяльності бізнесу та включає персоналізовану допомогу з розробки планів розвитку.'
    }
  ];

  legalLinks = [
    { text: 'Закон України "Про зайнятість населення"', url: 'https://zakon.rada.gov.ua/laws/show/556-14' },
    { text: 'Постанова КМУ № 472 про менторську підтримку', url: 'https://zakon.rada.gov.ua/laws/show/472-2026-%D0%BF' }
  ];

  handlePanelClick(event: Event): void {
    if ((event.target as HTMLElement).tagName === 'A') {
      event.stopPropagation();
    }
  }
}
