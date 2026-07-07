import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from "ngx-device-detector";
import { NgIf } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dcz-footer-full',
    templateUrl: './dcz-footer-full.component.html',
    styleUrls: ['./dcz-footer-full.component.css'],
    standalone: true,
    imports: [RouterLink, MatDividerModule, NgIf]
})
export class DczFooterFullComponent implements OnInit {
constructor(private  deviceService: DeviceDetectorService,) {
}
  isMobile: boolean = false;
  isTablet: boolean = false;
  currentYear: number = new Date().getFullYear();

  ngOnInit(): void {
    this.isMobile = this. deviceService.isMobile();
    this.isTablet = this. deviceService.isTablet();
  }
}
