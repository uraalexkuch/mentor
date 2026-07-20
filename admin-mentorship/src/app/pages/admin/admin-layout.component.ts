import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  requiredRole?: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);

  sidebarCollapsed = signal(false);
  currentRoute = signal('dashboard');
  currentUser = signal<User | null>(null);

  menuItems: MenuItem[] = [
    { id: 'dashboard',    label: 'Дашборд',       icon: '📊', route: '/admin/dashboard'    },
    { id: 'participants', label: 'Учасники',       icon: '👥', route: '/admin/participants' },
    { id: 'certificates', label: 'Сертифікати',   icon: '🏆', route: '/admin/certificates' },
    { id: 'consultations',label: 'Консультації',  icon: '💬', route: '/admin/consultations'},
    { id: 'mentors',      label: 'Ментори',       icon: '🤝', route: '/admin/mentors'      },
    { id: 'mentorship-pairs', label: 'Менторські пари', icon: '🔗', route: '/admin/mentorship-pairs' },
    { id: 'reports',      label: 'Звіти',         icon: '📈', route: '/admin/reports', requiredRole: 'SUPER_ADMIN' },
    { id: 'settings',     label: 'Налаштування',  icon: '⚙️', route: '/admin/settings', requiredRole: 'SUPER_ADMIN' }
  ];

  // Назва поточної сторінки для breadcrumb
  currentLabel = computed(() => {
    const found = this.menuItems.find(m => m.id === this.currentRoute());
    return found?.label ?? 'Адмінка';
  });

  // Відфільтроване меню залежно від ролі користувача
  visibleMenuItems = computed(() => {
    const userRole = this.currentUser()?.role;
    if (userRole === 'SUPER_ADMIN') {
      return this.menuItems;
    }
    return this.menuItems.filter(item => !item.requiredRole || item.requiredRole === userRole);
  });

  private routerSubscription?: Subscription;

  ngOnInit() {
    // Отримуємо поточного користувача
    this.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });

    // Встановлюємо активний пункт з URL при першому завантаженні
    const urlSegment = this.router.url.split('/').pop() ?? 'dashboard';
    this.currentRoute.set(urlSegment);

    // Оновлюємо при кожній навігації
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const seg = e.urlAfterRedirects.split('/').pop() ?? 'dashboard';
        this.currentRoute.set(seg);
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  get currentUser$() {
    return this.authService.currentUser$;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(prev => !prev);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserInitials(nameOrEmail: string): string {
    const parts = (nameOrEmail || '').split(/[\s@]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (nameOrEmail.substring(0, 2)).toUpperCase();
  }
}
