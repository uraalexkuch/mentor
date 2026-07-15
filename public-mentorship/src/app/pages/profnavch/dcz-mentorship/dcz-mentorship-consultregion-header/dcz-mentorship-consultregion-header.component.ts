import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dcz-mentorship-consultregion-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './dcz-mentorship-consultregion-header.component.html',
  styleUrls: ['./dcz-mentorship-consultregion-header.component.css']
})
export class DczMentorshipConsultregionHeaderComponent {
  // Використання input() замість @Input() (Angular 21)
  title = input<string>('Оберіть область');

  // Використання output() замість @Output() (Angular 21)
  drawer = output<void>();

  isMobile = false;

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  onDrawerToggle(): void {
    this.drawer.emit();
  }
}
