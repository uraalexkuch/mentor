import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  private router = inject(Router);

  sidebarCollapsed = signal(false);
  currentRoute = signal('dashboard');

  menuItems: MenuItem[] = [
    { id: 'dashboard',    label: 'Дашборд',       icon: '📊', route: '/admin/dashboard'    },
    { id: 'participants', label: 'Учасники',       icon: '👥', route: '/admin/participants' },
    { id: 'certificates', label: 'Сертифікати',   icon: '🏆', route: '/admin/certificates' },
    { id: 'consultations',label: 'Консультації',  icon: '💬', route: '/admin/consultations'},
    { id: 'mentors',      label: 'Ментори',       icon: '🤝', route: '/admin/mentors'      },
    { id: 'mentorship-pairs', label: 'Менторські пари', icon: '🔗', route: '/admin/mentorship-pairs' },
    { id: 'reports',      label: 'Звіти',         icon: '📈', route: '/admin/reports'      },
    { id: 'settings',     label: 'Налаштування',  icon: '⚙️', route: '/admin/settings'     }
  ];

  // Назва поточної сторінки для breadcrumb
  currentLabel = computed(() => {
    const found = this.menuItems.find(m => m.id === this.currentRoute());
    return found?.label ?? 'Адмінка';
  });

  constructor() {
    // Встановлюємо активний пункт з URL при першому завантаженні
    const urlSegment = this.router.url.split('/').pop() ?? 'dashboard';
    this.currentRoute.set(urlSegment);

    // Оновлюємо при кожній навігації
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const seg = e.urlAfterRedirects.split('/').pop() ?? 'dashboard';
        this.currentRoute.set(seg);
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(prev => !prev);
  }
}
