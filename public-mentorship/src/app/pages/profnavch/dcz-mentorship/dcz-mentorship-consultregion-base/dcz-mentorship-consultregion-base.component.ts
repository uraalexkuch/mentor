import { Component, input, signal, computed } from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dcz-mentorship-consultregion-base',
  standalone: true,
  imports: [MatSidenavModule],
  templateUrl: './dcz-mentorship-consultregion-base.component.html',
  styleUrls: ['./dcz-mentorship-consultregion-base.component.css']
})
export class DczMentorshipConsultregionBaseComponent {
  // Використання input() замість @Input() (Angular 21)
  opened = input<boolean>(true);

  modes = signal<MatDrawerMode>('side');

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe(result => {
      // При зміні розміру екрану оновлюємо стани
      const isXSmall = result.matches;
      this.modes.set(isXSmall ? 'over' : 'side');
    });
  }

  // Computed сигнал для перевірки, чи потрібно відкрити сайдбар
  shouldOpenSidebar = computed(() => {
    return this.opened() && this.modes() !== 'over';
  });
}
