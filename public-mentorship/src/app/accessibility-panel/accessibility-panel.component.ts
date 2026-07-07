import { Component, inject } from '@angular/core';
import {AccessibilityService} from "../services/accessibility.service";

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  standalone: true,
  styleUrls: ['./accessibility-panel.component.css']
})
export class AccessibilityPanelComponent {
  // Інжектуємо сервіс та отримуємо доступ до сигналу з налаштуваннями
  public accessibilityService = inject(AccessibilityService);
  public settings = this.accessibilityService.settings.asReadonly();
}
