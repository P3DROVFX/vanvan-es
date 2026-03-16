import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener, OnInit, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { TripService, TripHistoryDTO } from '../../services/trip.service';

@Component({
  selector: 'app-buscar-viagem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-trips.html',
  styleUrls: ['./search-trips.css']
})
export class SearchTripsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cardsContainer') cardsContainer!: ElementRef<HTMLElement>;

  private tripService = inject(TripService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  viagens$!: Observable<any[]>;
  
  canScrollLeft = false;
  canScrollRight = true;

  private scrollListener!: () => void;

  ngAfterViewInit() {
    const el = this.cardsContainer.nativeElement;
    this.scrollListener = () => this.updateScrollState();
    el.addEventListener('scroll', this.scrollListener);
    // check initial state after render
    setTimeout(() => this.updateScrollState(), 50);
  }

  ngOnDestroy() {
    const el = this.cardsContainer?.nativeElement;
    if (el && this.scrollListener) {
      el.removeEventListener('scroll', this.scrollListener);
    }
  }

  constructor() {
    afterNextRender(() => {
      this.initSearch();
    });
  }

  ngOnInit() {
  }

  private initSearch() {
    this.viagens$ = this.route.queryParams.pipe(
      tap(() => {
        this.isLoading = true;
        this.cdr.detectChanges();
      }),
      switchMap(params => {
        const date = params['date'];
        const departureCity = params['departureCity'];
        const arrivalCity = params['arrivalCity'];
        const passengerCount = params['passengerCount'] ? parseInt(params['passengerCount'], 10) : undefined;
        return this.tripService.searchTrips(date, departureCity, arrivalCity, passengerCount).pipe(
          switchMap(page => {
            if (!page.content || page.content.length === 0) return of([]);
            const detailsObservables = page.content.map(trip => 
              this.tripService.getTripDetails(trip.id).pipe(
                map(details => {
                  (trip as any).perKmRate = (details as any).perKmRate;
                  
                  // Use price per seat (unit price) if available, otherwise fallback to totalAmount (which might be 0 if no passengers)
                  // The backend calculateTripTotalAmount uses: max(minFare, perKmRate * dist) * count
                  // We want to show the UNIT PRICE to the passenger searching for a seat.
                  const distance = details.distanceKm || 1;
                  const unitPrice = Math.max(10, (details.perKmRate || 0.7) * distance);
                  (trip as any).pricePerSeat = unitPrice;
                  
                  // Fix driver details missing from history but present in details
                  (trip as any).driverRating = 5.0; // fallback if backend rating isn't there
                  (trip as any).vehicleModel = (details as any).vehicleModel;
                  (trip as any).vehiclePlate = (details as any).vehiclePlate;
                  
                  return this.mapToViagemUi(trip);
                }),
                catchError(() => of(this.mapToViagemUi(trip)))
              )
            );
            return forkJoin(detailsObservables);
          }),
          tap(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
            setTimeout(() => this.updateScrollState(), 50);
          }),
          catchError(err => {
            console.error('Failed to search trips', err);
            this.isLoading = false;
            this.cdr.detectChanges();
            return of([]);
          })
        );
      })
    );
  }

  private mapToViagemUi(dto: any): any {
    const [year, month, day] = dto.date ? dto.date.split("-") : ['2025', '01', '01']; 
    const monthIndex = parseInt(month, 10) - 1;
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const monthStr = months[monthIndex];
    const dayStr = day;

    const routeStr = dto.route || '';
    let depName = dto.departureCity || dto.departureStreet;
    let arrName = dto.arrivalCity || dto.arrivalStreet;
    if (routeStr.includes('->')) {
        const parts = routeStr.split('->');
        depName = parts[0].trim();
        arrName = parts[1].trim();
    }

    return {
      id: dto.id,
      origem: depName,
      destino: arrName,
      route: `${depName} -> ${arrName}`,
      mes: monthStr,
      dia: dayStr,
      horario: dto.time ? dto.time.substring(0,5) : '08:00', 
      vagas: dto.availableSeats ?? (dto.totalSeats ? dto.totalSeats - (dto.passengerCount || 0) : 4),
      preco: dto.pricePerSeat || dto.totalAmount || 0,
      distancia: dto.distanceKm ? dto.distanceKm : 0,
      localPartida: dto.departureStreet || dto.departureCity || 'Centro',
      pontoReferencia: dto.departureReference || '-',
      veiculoModelo: dto.vehicleModel || 'Carro', 
      veiculoPlaca: dto.vehiclePlate || 'XXXX',
      motoristaNome: dto.driverName || 'Motorista',
      motoristaNota: dto.driverRating || '5.0',
      imagemVeiculo: 'https://placehold.co/225x118'
    };
  }

  updateScrollState() {
    const el = this.cardsContainer.nativeElement;
    this.canScrollLeft = el.scrollLeft > 8;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 8;
  }

  // removed mock data

  // ==========================================
  // CONTROLE DOS MODAIS E PAGAMENTO
  // ==========================================

  showConfirmModal = false;
  showPaymentModal = false;
  isBooking = false;

  viagemSelecionada: any = {};

  // Código PIX falso para demonstração
  codigoPix = 'pix-de-exemplo-123456789';

  // ==========================================
  // FUNÇÕES DOS MODAIS
  // ==========================================

  selecionarViagem(viagem: any) {
    this.viagemSelecionada = viagem;
    this.showConfirmModal = true;
    this.cdr.detectChanges();
  }

  fecharModalConfirmacao() {
    this.showConfirmModal = false;
    this.cdr.detectChanges();
  }

  fazerPagamento() {
    if (this.isBooking) return;
    this.isBooking = true;
    this.cdr.detectChanges();
    this.tripService.bookTrip(this.viagemSelecionada.id).subscribe({
      next: () => {
        this.isBooking = false;
        this.showConfirmModal = false;
        this.showPaymentModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isBooking = false;
        console.error('Failed to book trip', err);
        alert('Erro ao reservar viagem. Verifique as vagas.');
        this.cdr.detectChanges();
      }
    });
  }


  fecharModalPagamento() {
    this.showPaymentModal = false;
    this.viagemSelecionada = {};
    // Pós pagamento ele viaja pro histórico dele
    this.router.navigate(['/viagens']);
  }

  scrollCardsLeft() {
    if (this.cardsContainer) {
      this.cardsContainer.nativeElement.scrollBy({ left: -504, behavior: 'smooth' });
      this.canScrollLeft = this.cardsContainer.nativeElement.scrollLeft - 504 > 8;
      this.canScrollRight = true;
    }
  }

  scrollCardsRight() {
    if (this.cardsContainer) {
      this.cardsContainer.nativeElement.scrollBy({ left: 504, behavior: 'smooth' });
      this.canScrollLeft = true;
      const el = this.cardsContainer.nativeElement;
      this.canScrollRight = el.scrollLeft + 504 + el.clientWidth < el.scrollWidth - 8;
    }
  }
}
