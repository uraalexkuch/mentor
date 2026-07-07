import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dcz-mentorship-consultregion-header',
  templateUrl: './dcz-mentorship-consultregion-header.component.html',
  styleUrls: ['./dcz-mentorship-consultregion-header.component.css'],
  standalone: true,
  imports: [NgIf, BreadcrumbComponent, MatToolbarModule, MatButtonModule, MatIconModule]
})
export class DczMentorshipConsultregionHeaderComponent implements OnInit {
  @Input() title = 'Оберіть область';
  @Output() drawer = new EventEmitter<void>();

  isMobile = false;

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }
}
