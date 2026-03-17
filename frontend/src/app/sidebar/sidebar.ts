import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const ROUTE_MAP: Record<string, string> = {
  'relatorios': 'reports',
  'motoristas': 'drivers',
  'clientes': 'clients',
  'avaliacoes': 'ratings',
  'aprovar-motoristas': 'verification',
  'viagens': 'trips',
  'settings': 'admin',
  'perfil': 'profile'
};

const PAGE_ROUTES: Record<string, string> = {
  'reports': '/admin/relatorios',
  'drivers': '/admin/motoristas',
  'clients': '/admin/clientes',
  'ratings': '/admin/avaliacoes',
  'verification': '/admin/aprovar-motoristas',
  'trips': '/admin/viagens',
  'admin': '/admin/settings',
  'profile': '/admin/perfil'
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isExpanded = signal(false);
  activePage = signal('reports');

  // Pending approvals badge count
  pendingCount = signal(0);

  // Images
  SidebarLeft = "assets/icons/sidebar-left.svg";
  ChartSquare = "assets/icons/chart-square.svg";
  Personalcard = "assets/icons/personalcard.svg";
  User = "assets/icons/user-edit.svg";
  Verify = "assets/icons/verify.svg";
  Setting = "assets/icons/setting.svg";
  Logout = "assets/icons/logout.svg";
  SidebarRight = "assets/icons/sidebar-right.svg";

  ngOnInit(): void {
    // Sync sidebar with current URL on init
    this.syncActivePageFromUrl(this.router.url);

    // Listen for route changes to keep sidebar in sync
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.syncActivePageFromUrl(event.urlAfterRedirects || event.url);
    });

    // Fetch pending driver approvals for badge
    this.fetchPendingCount();
  }

  private syncActivePageFromUrl(url: string): void {
    const segments = url.split('/').filter(Boolean);
    // Look for the admin sub-route segment
    if (segments[0] === 'admin' && segments[1]) {
      const page = ROUTE_MAP[segments[1]];
      if (page) {
        this.activePage.set(page);
      }
    }
  }

  private fetchPendingCount(): void {
    // Fetch from admin service - pending drivers count
    import('../services/admin.service').then(m => {
      const adminService = inject(m.AdminService);
    }).catch(() => {});
    // For now, we'll use the AdminService via HTTP
  }

  toggleSidebar() {
    this.isExpanded.update(v => !v);
  }

  setActivePage(page: string) {
    this.activePage.set(page);
    const route = PAGE_ROUTES[page];
    if (route) {
      this.router.navigate([route]);
    }
  }

  logout() {
    this.authService.logout();
  }
}
