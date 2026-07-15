import { Component, ElementRef, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-scroll-up',
    templateUrl: './scroll-up.component.html',
    styleUrls: ['./scroll-up.component.css'],
    standalone: true,
    imports: [NgIf]
})
export class ScrollUpComponent {
  isShown: boolean = false; 

  constructor(private elementRef: ElementRef) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const footerElement = this.elementRef.nativeElement.querySelector('.footer');
    const footerHeight = footerElement ? footerElement.offsetHeight : 0;
    this.isShown = scrollPosition > 100 && scrollPosition + window.innerHeight < document.body.scrollHeight - footerHeight;
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
