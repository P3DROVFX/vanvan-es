import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService, TripHistoryDTO } from '../../services/trip.service';
import { AdminService } from '../../services/admin.service';
import { Tag } from '../../components/tags/tags';
import { Skeleton } from '../../components/skeleton/skeleton';
import { ToastService } from '../../components/toast/toast.service';
import { TripMapper } from '../../utils/trip-mapper';
import { RecentTrip } from '../../models/trip-ui.model';

@Component({
  selector: 'app-admin-viagens',
  standalone: true,
  imports: [CommonModule, FormsModule, Tag, Skeleton],
  templateUrl: './admin-viagens.html',
  styleUrls: ['./admin-viagens.css']
})
export class AdminViagens implements OnInit {
  private tripService = inject(TripService);
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  trips: RecentTrip[] = [];
  allTrips: TripHistoryDTO[] = [];

  // Filters
  filterStatus = '';
  filterDriver = '';
  filterDepartureCity = '';
  filterArrivalCity = '';
  filterStartDate = '';
  filterEndDate = '';

  // Drivers for filter dropdown
  drivers: { id: string; name: string }[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Sort
  sortColumn: 'date' | 'status' | 'driver' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Export
  isExporting = false;

  ngOnInit(): void {
    this.fetchTrips();
    this.fetchDrivers();
  }

  private fetchDrivers(): void {
    this.adminService.listDrivers('APPROVED', 0, 200).subscribe({
      next: (page) => {
        this.drivers = page.content.map(d => ({ id: d.id, name: d.name }));
      }
    });
  }

  fetchTrips(): void {
    this.isLoading = true;

    const status = this.filterStatus || undefined;
    const driverId = this.filterDriver || undefined;
    const departureCity = this.filterDepartureCity || undefined;
    const arrivalCity = this.filterArrivalCity || undefined;
    const startDate = this.filterStartDate || undefined;
    const endDate = this.filterEndDate || undefined;

    this.tripService.getTripHistory(
      startDate, endDate, driverId, departureCity, arrivalCity, status,
      this.currentPage, this.pageSize
    ).subscribe({
      next: (page) => {
        this.allTrips = page.content;
        this.trips = page.content.map(t => TripMapper.toRecentTrip(t));
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.error('Erro ao buscar viagens.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.fetchTrips();
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterDriver = '';
    this.filterDepartureCity = '';
    this.filterArrivalCity = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.currentPage = 0;
    this.fetchTrips();
  }

  toggleSort(column: 'date' | 'status' | 'driver') {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get sortedTrips(): RecentTrip[] {
    const list = [...this.trips];
    if (!this.sortColumn) return list;

    list.sort((a, b) => {
      let comp = 0;
      if (this.sortColumn === 'date') {
        comp = a.date.localeCompare(b.date);
      } else if (this.sortColumn === 'status') {
        comp = a.status.localeCompare(b.status);
      } else if (this.sortColumn === 'driver') {
        comp = a.driver.localeCompare(b.driver);
      }
      return this.sortDirection === 'asc' ? comp : -comp;
    });
    return list;
  }

  cancelTrip(index: number): void {
    const trip = this.allTrips[index];
    if (!trip || trip.status === 'CANCELLED' || trip.status === 'COMPLETED') return;

    this.tripService.updateTripStatus(trip.id, 'CANCELLED').subscribe({
      next: () => {
        this.toastService.success('Viagem cancelada com sucesso!');
        this.fetchTrips();
      },
      error: () => this.toastService.error('Erro ao cancelar viagem.')
    });
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchTrips();
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // Export to CSV
  exportCSV(): void {
    this.isExporting = true;

    // Fetch all records for export
    this.tripService.getTripHistory(
      this.filterStartDate || undefined,
      this.filterEndDate || undefined,
      this.filterDriver || undefined,
      this.filterDepartureCity || undefined,
      this.filterArrivalCity || undefined,
      this.filterStatus || undefined,
      0, 10000
    ).subscribe({
      next: (page) => {
        const headers = ['Data', 'Origem', 'Destino', 'Motorista', 'Status', 'Passageiros', 'Valor'];
        const rows = page.content.map(t => {
          const mapped = TripMapper.toRecentTrip(t);
          return [mapped.date, mapped.origin, mapped.destination, mapped.driver, mapped.status, mapped.passengers, mapped.price].join(',');
        });

        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `viagens_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        this.toastService.success('Exportação concluída!');
        this.isExporting = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.error('Erro ao exportar dados.');
        this.isExporting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
