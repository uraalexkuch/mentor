import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  activeSection = signal<'general' | 'notifications' | 'security'>('general');

  // General settings
  siteName      = signal('Адміністративна панель — Менторство ДЦЗ');
  contactEmail  = signal('admin@dcz.gov.ua');
  maxParticipants = signal(500);
  programYear   = signal(2026);

  // Notification settings
  notifications = signal<NotificationSetting[]>([
    { id: 'new-app',      label: 'Нові заявки',           description: 'Сповіщення про кожну нову заявку учасника',   enabled: true  },
    { id: 'status-change',label: 'Зміна статусу',         description: 'Сповіщення при зміні статусу заявки',         enabled: true  },
    { id: 'consult',      label: 'Заявки на консультацію',description: 'Сповіщення при нових заявках на консультацію',enabled: true  },
    { id: 'cert-issued',  label: 'Видача сертифікатів',   description: 'Сповіщення при виданні нового сертифіката',   enabled: false },
    { id: 'report-ready', label: 'Готовність звітів',     description: 'Щотижневий звіт по програмі',                enabled: false },
  ]);

  saveSuccess = signal(false);

  setSection(section: 'general' | 'notifications' | 'security'): void {
    this.activeSection.set(section);
    this.saveSuccess.set(false);
  }

  toggleNotification(id: string): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  }

  saveSettings(): void {
    // Mock save
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }
}
