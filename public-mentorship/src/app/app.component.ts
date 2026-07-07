import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DczHeadNewComponent } from './standart/dcz-head-new/dcz-head-new.component';
import { DczFooterFullComponent } from './standart/dcz-footer-full/dcz-footer-full.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DczHeadNewComponent, DczFooterFullComponent],
  template: `
  <app-dcz-head-new></app-dcz-head-new>
  <div class="content-wrapper">
    <router-outlet></router-outlet>
  </div>
  <app-dcz-footer-full></app-dcz-footer-full>
  `
})
export class AppComponent {
  title = 'public-frontend';
}
