import { Component, ChangeDetectorRef, afterNextRender, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tag, TagVariant } from '../../components/tags/tags';
import { Toggle } from '../../components/toggle/toggle';
import { Skeleton } from '../../components/skeleton/skeleton';
import { RatingService } from '../../services/rating.service';
import { TripService, TripHistoryDTO } from '../../services/trip.service';
import { AdminService } from '../../services/admin.service';
import { ClienteService } from '../../services/client.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TripMapper } from '../../utils/trip-mapper';
import { RecentTrip } from '../../models/trip-ui.model';


export interface PopularRoute {
  origin: string;
  destination: string;
  count: number;
  trend: number;
}

export interface RevenueMonth {
  label: string;
  value: number;
  display: string;
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, Tag, Toggle, Skeleton],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css',
})
export class Relatorios implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private ratingService = inject(RatingService);
  private tripService = inject(TripService);
  private adminService = inject(AdminService);
  private clienteService = inject(ClienteService);

  driverRating = { averageScore: 0, totalRatings: 0 };

  isLoading = true;
  hoveredBarIndex: number | null = null;
  hoveredStatusIndex: number | null = null;
  hoveredDriverIndex: number | null = null;
  // --- Mock data (TODO: replace with API calls) ---

  kpis = {
    revenue: { value: 'R$ 42.580', change: 12.5 },
    trips: { value: '127', change: 8.3 },
    drivers: { value: '18', change: 0 },
    clients: { value: '342', change: 15.2 },
  };

  driverCounts = {
    ativos: 18,
    aguardando: 5,
    rejeitados: 3,
  };

  get maxDriverCount(): number {
    return Math.max(
      this.driverCounts.ativos,
      this.driverCounts.aguardando,
      this.driverCounts.rejeitados,
    );
  }

  occupancyRate = 78;
  occupancyChange = 5;

  gaugeSegments: { angle: number; filled: boolean; opacity: number }[];

  private buildGauge(): { angle: number; filled: boolean; opacity: number }[] {
    const total = 30;
    const startAngle = -120;
    const endAngle = 120;
    const step = (endAngle - startAngle) / (total - 1);
    const filledCount = Math.round((total * this.occupancyRate) / 100);

    return Array.from({ length: total }, (_, i) => ({
      angle: startAngle + i * step,
      filled: i < filledCount,
      opacity: i < filledCount ? 0.3 + 0.7 * (i / Math.max(filledCount - 1, 1)) : 1,
    }));
  }

  statusCounts = {
    confirmado: 89,
    aguardando: 23,
    cancelado: 8,
    finalizado: 7,
  };

  revenueMonths: RevenueMonth[] = [
    { label: 'Dez', value: 29800, display: '29.8K' },
    { label: 'Jan', value: 34500, display: '34.5K' },
    { label: 'Fev', value: 37850, display: '37.8K' },
    { label: 'Mar', value: 42580, display: '42.6K' },
  ];

  funnelData = [
    { label: 'Solicitadas', count: 127, color: 'bg-dark' },
    { label: 'Confirmadas', count: 112, color: 'bg-secondary' },
    { label: 'Realizadas', count: 96, color: 'bg-tetiary' },
  ];

  get totalTrips(): number {
    const s = this.statusCounts;
    return s.confirmado + s.aguardando + s.cancelado + s.finalizado;
  }

  get funnelMax(): number {
    return this.funnelData[0].count;
  }

  funnelDropoff(i: number): number {
    if (i === 0) return 0;
    const prev = this.funnelData[i - 1].count;
    const curr = this.funnelData[i].count;
    return Math.round(((prev - curr) / prev) * 100);
  }

  statusPercent(count: number): number {
    return this.totalTrips > 0 ? Math.round((count / this.totalTrips) * 100) : 0;
  }

  get maxRevenueValue(): number {
    return Math.max(...this.revenueMonths.map((m) => m.value));
  }

  get revenueChange(): number {
    const m = this.revenueMonths;
    if (m.length < 2) return 0;
    const current = m[m.length - 1].value;
    const previous = m[m.length - 2].value;
    return +(((current - previous) / previous) * 100).toFixed(1);
  }

  barHeight(value: number): number {
    return Math.round((value / this.maxRevenueValue) * 100);
  }

  // Sorting
  sortColumn: 'date' | 'status' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  toggleSort(column: 'date' | 'status') {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get sortedTrips(): RecentTrip[] {
    const list = [...this.recentTrips];
    list.sort((a, b) => {
      if (a.status === 'Em andamento' && b.status !== 'Em andamento') return -1;
      if (b.status === 'Em andamento' && a.status !== 'Em andamento') return 1;

      if (!this.sortColumn) return 0;

      if (this.sortColumn === 'status') {
        const comp = a.status.localeCompare(b.status);
        return this.sortDirection === 'asc' ? comp : -comp;
      } else if (this.sortColumn === 'date') {
        // Parse DD/MM logic
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        const dateA = monthA * 100 + dayA;
        const dateB = monthB * 100 + dayB;
        const comp = dateA - dateB;
        return this.sortDirection === 'asc' ? comp : -comp;
      }
      return 0;
    });
    return list.slice(0, 20);
  }

  barTrend(i: number): 'up' | 'down' | 'same' {
    if (i === 0) return 'up';
    return this.revenueMonths[i].value >= this.revenueMonths[i - 1].value ? 'up' : 'down';
  }

  isCurrentMonth(i: number): boolean {
    return i === this.revenueMonths.length - 1;
  }

  isPreviousMonth(i: number): boolean {
    return i === this.revenueMonths.length - 2;
  }

  popularRoutes: PopularRoute[] = [
    { origin: 'Garanhuns', destination: 'Recife', count: 42, trend: 12 },
    { origin: 'Recife', destination: 'Garanhuns', count: 38, trend: 5 },
    { origin: 'Caruaru', destination: 'Recife', count: 25, trend: -3 },
    { origin: 'Petrolina', destination: 'Recife', count: 14, trend: 18 },
    { origin: 'João Pessoa', destination: 'Recife', count: 8, trend: 0 },
  ];

  get maxRouteCount(): number {
    return Math.max(...this.popularRoutes.map((r) => r.count));
  }

  settings = {
    emailNotifications: true,
    autoReports: false,
    occupancyAlerts: true,
    weeklyDigest: true,
  };

  recentTrips: RecentTrip[] = [];

  isRecentTripsModalOpen = false;
  modalOrigin = { x: 0, y: 0, w: 0, h: 0 };


openRecentTripsModal(event: MouseEvent) {
  const card = (event.currentTarget as HTMLElement).closest('.bento-recent') as HTMLElement;
  if (card) {
    const rect = card.getBoundingClientRect();
    this.modalOrigin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      w: rect.width,
      h: rect.height,
    };
  }
  this.isRecentTripsModalOpen = true;
}

closeRecentTripsModal() {
  this.isRecentTripsModalOpen = false;
}

  constructor() {
    this.gaugeSegments = this.buildGauge();

    afterNextRender(() => {
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 1400);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.fetchDriverRating();
    this.fetchAllData();
  }

  private fetchDriverRating() {
    this.ratingService.getDriverMediaAvaliacao().subscribe({
      next: (rating) => {
        this.driverRating = rating;
      },
      error: (err) => {
        console.error('Erro ao buscar notas do motorista:', err);
      }
    });
  }

  private fetchAllData() {
    this.isLoading = true;
    this.cdr.detectChanges();

    forkJoin({
      tripsPage: this.tripService.getTripHistory(undefined, undefined, undefined, undefined, undefined, undefined, 0, 1000).pipe(catchError(() => of({ content: [], totalElements: 0 }))),
      driversPage: this.adminService.listDrivers(undefined, 0, 1000).pipe(catchError(() => of({ content: [], totalElements: 0 }))),
      clients: this.clienteService.listar(0, 1000).pipe(catchError(() => of([])))
    }).subscribe({
      next: (data) => {
        this.processTrips(data.tripsPage.content);
        this.processDrivers(data.driversPage.content);
        this.processClients(data.clients);
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private processTrips(trips: TripHistoryDTO[]) {
    // 1. Status Counts
    this.statusCounts = {
      confirmado: trips.filter(t => t.status === 'SCHEDULED').length,
      aguardando: trips.filter(t => t.status === 'IN_PROGRESS').length, // Mocking progress as awaiting for UI
      cancelado: trips.filter(t => t.status === 'CANCELLED').length,
      finalizado: trips.filter(t => t.status === 'COMPLETED').length
    };

    // 2. Recent Trips Table
    this.recentTrips = trips.slice(0, 15).map(t => this.mapToRecentTrip(t));

    // 3. KPIs
    const completedTrips = trips.filter(t => t.status === 'COMPLETED');
    const totalRevenue = completedTrips.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    
    this.kpis.revenue = {
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: 0 // Could calculate if we had previous month data
    };
    this.kpis.trips = { value: trips.length.toString(), change: 0 };

    // 4. Revenue Months (grouping by month)
    const monthMap = new Map<string, number>();
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    
    completedTrips.forEach(t => {
      const date = new Date(t.date + 'T00:00:00');
      const monthLabel = months[date.getMonth()];
      monthMap.set(monthLabel, (monthMap.get(monthLabel) || 0) + (t.totalAmount || 0));
    });

    // Take last 4 months that have data or defaults
    const currentMonthIdx = new Date().getMonth();
    this.revenueMonths = [];
    for (let i = 3; i >= 0; i--) {
       const idx = (currentMonthIdx - i + 12) % 12;
       const label = months[idx];
       const val = monthMap.get(label) || 0;
       this.revenueMonths.push({
          label: label,
          value: val,
          display: val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val.toString()
       });
    }

    // 5. Popular Routes
    const routeMap = new Map<string, number>();
    trips.forEach(t => {
      const key = `${t.departureCity || '---'} -> ${t.arrivalCity || '---'}`;
      routeMap.set(key, (routeMap.get(key) || 0) + 1);
    });

    this.popularRoutes = Array.from(routeMap.entries())
      .map(([route, count]) => {
        const [origin, destination] = route.split(' -> ');
        return { origin, destination, count, trend: 0 };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 6. Occupancy Rate
    if (completedTrips.length > 0) {
      const totalSeats = completedTrips.reduce((sum, t) => sum + (t.totalSeats || 15), 0);
      const totalPassengers = completedTrips.reduce((sum, t) => sum + (t.passengerCount || 0), 0);
      this.occupancyRate = Math.round((totalPassengers / totalSeats) * 100);
    } else {
      this.occupancyRate = 0;
    }
    this.gaugeSegments = this.buildGauge();

    // 7. Funnel Data
    const confirmedCount = trips.filter(t => ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].includes(t.status)).length;
    this.funnelData = [
      { label: 'Solicitadas', count: trips.length, color: 'bg-dark' },
      { label: 'Confirmadas', count: confirmedCount, color: 'bg-secondary' },
      { label: 'Realizadas', count: completedTrips.length, color: 'bg-tetiary' },
    ];
  }

  private processDrivers(drivers: any[]) {
    this.driverCounts = {
      ativos: drivers.filter(d => d.registrationStatus === 'APPROVED').length,
      aguardando: drivers.filter(d => d.registrationStatus === 'PENDING').length,
      rejeitados: drivers.filter(d => d.registrationStatus === 'REJECTED').length,
    };
    this.kpis.drivers = { value: this.driverCounts.ativos.toString(), change: 0 };
  }

  private processClients(clients: any[]) {
    this.kpis.clients = { value: clients.length.toString(), change: 0 };
  }

  private mapToRecentTrip(dto: TripHistoryDTO): RecentTrip {
    return TripMapper.toRecentTrip(dto);
  }
}
