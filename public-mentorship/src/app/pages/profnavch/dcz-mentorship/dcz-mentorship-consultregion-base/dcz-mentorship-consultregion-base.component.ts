import { Component, Input } from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dcz-mentorship-consultregion-base',
  templateUrl: './dcz-mentorship-consultregion-base.component.html',
  styleUrls: ['./dcz-mentorship-consultregion-base.component.css'],
  standalone: true,
  imports: [MatSidenavModule]
})
export class DczMentorshipConsultregionBaseComponent {
  @Input() opened = true;
  modes: MatDrawerMode = 'side';

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe(result => {
      this.opened = !result.matches;
      this.modes = result.matches ? 'over' : 'side';
    });
  }
}
