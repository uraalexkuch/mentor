import { Component, Inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-intern50-confirm',
  templateUrl: './dialog-intern-confirm.component.html',
  styleUrls: ['./dialog-intern-confirm.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgIf]
})
export class DialogInternConfirmComponent {
  title: SafeHtml;
  message: SafeHtml;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string | { title: string; message: string },
    private sanitizer: DomSanitizer
  ) {
    if (typeof data === 'string') {
      this.title = 'Дякуємо!';
      this.message = this.sanitizer.bypassSecurityTrustHtml(data);
    } else {
      this.title = this.sanitizer.bypassSecurityTrustHtml(data.title);
      this.message = this.sanitizer.bypassSecurityTrustHtml(data.message);
    }
  }
}
