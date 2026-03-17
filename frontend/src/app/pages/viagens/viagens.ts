import { Component, OnDestroy, ChangeDetectorRef, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Tag, TagVariant } from '../../components/tags/tags';
import { Buttons } from '../../components/buttons/buttons';
import { Skeleton } from '../../components/skeleton/skeleton';
import { ToastService } from '../../components/toast/toast.service';
import QRCode from 'qrcode';
import { TripService, TripHistoryDTO } from '../../services/trip.service';
import { Router } from '@angular/router';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-viagens',
  standalone: true,
  imports: [CommonModule, RouterModule, Tag, Buttons, Skeleton],
  templateUrl: './viagens.html',
  styleUrls: ['./viagens.css']
})
export class Viagens implements OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private tripService = inject(TripService);
  private router = inject(Router);
  private ratingService = inject(RatingService);

  isLoading = true;

  // Countdown timer
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  private countdownInterval: any = null;

  // QR Code
  qrCodeDataUrl: string = '';

  constructor() {
    afterNextRender(() => {
      this.startCountdown();
      this.fetchTrips();
    });
  }

  private fetchTrips(): void {
    this.tripService.getTripHistory(undefined, undefined, undefined, undefined, undefined, undefined, 0, 50)
      .subscribe({
        next: (page) => {
          const allTrips = page.content.map(trip => this.mapToUiTrip(trip));
          
          const pendingAndActive = allTrips.filter(t => ['SCHEDULED', 'IN_PROGRESS'].includes(t.originalStatus));
          const completedAndCancelled = allTrips.filter(t => ['COMPLETED', 'CANCELLED'].includes(t.originalStatus));

          if (pendingAndActive.length > 0) {
            this.nextTrip = pendingAndActive[0];
            this.scheduledTrips = pendingAndActive.slice(1);
            
            // Unmock vehicle info for next active trip
            this.tripService.getTripDetails(this.nextTrip.id).subscribe({
              next: (details) => {
                this.nextTrip.vehicle = (details as any).vehicleModel || 'Carro';
                this.nextTrip.plate = (details as any).vehiclePlate || 'XXXX';
                this.nextTrip.driverRating = (details as any).driverRating || '5.0';
                this.nextTrip.pickupPoint = details.departureReferencePoint || details.departureStreet || this.nextTrip.pickupPoint;
                this.cdr.detectChanges();
              }
            });

            if (this.nextTrip.originalStatus === 'SCHEDULED' && this.nextTrip.originalDate && this.nextTrip.time) {
               this.startCustomCountdown(new Date(this.nextTrip.originalDate + 'T' + this.nextTrip.time));
            } else {
               this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }
          } else {
             this.nextTrip = null;
             this.scheduledTrips = [];
          }

          this.pastTrips = completedAndCancelled;
          this.checkLoadingState();
        },
        error: (err) => {
          console.error('Failed to load trips', err);
          this.checkLoadingState();
        }
      });
  }

  private checkLoadingState() {
     this.isLoading = false;
     this.cdr.detectChanges();
  }

  private mapToUiTrip(dto: TripHistoryDTO): any {
    const [year, month, day] = dto.date ? dto.date.split("-") : ['2025', '01', '01'];
    const monthIndex = parseInt(month, 10) - 1;
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const monthStr = months[monthIndex];
    const dayStr = day;

    let variant: TagVariant = 'warning';
    let statusLabel = 'Aguardando';

    switch (dto.status) {
      case 'SCHEDULED':
        variant = 'success';
        statusLabel = 'Confirmado';
        break;
      case 'COMPLETED':
        variant = 'success';
        statusLabel = 'Finalizado';
        break;
      case 'CANCELLED':
        variant = 'error';
        statusLabel = 'Cancelado';
        break;
      case 'IN_PROGRESS':
        variant = 'warning';
        statusLabel = 'Em Viagem';
        break;
    }

    return {
      id: dto.id,
      month: monthStr,
      day: dayStr,
      time: dto.time,
      origin: (() => {
        let name = dto.departureCity || dto.departureStreet;
        if (!name && dto.route && dto.route.includes('->')) return dto.route.split('->')[0].trim();
        return name || 'Origem';
      })(),
      destination: (() => {
        let name = dto.arrivalCity || dto.arrivalStreet;
        if (!name && dto.route && dto.route.includes('->')) return dto.route.split('->')[1].trim();
        return name || 'Destino';
      })(),
      price: `R$${dto.totalAmount.toFixed(2).replace('.', ',')}`,
      vehicle: 'Van',
        plate: 'XXXX',
        route: dto.route,
      pickupPoint: dto.departureStreet || dto.departureCity || 'Centro',
      driverName: dto.driverName,
      driverContact: 'Contato via chat',
      driverRating: (dto as any).driverRating || '5.0',
      variant: variant,
      statusLabel: statusLabel,
      originalDate: dto.date,
      originalStatus: dto.status
    };
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(): void {
      // Avoid arbitrary countdown if handled directly 
  }

  private startCustomCountdown(targetDate: Date): void {
     this.updateCountdown(targetDate);
     this.countdownInterval = setInterval(() => {
        this.updateCountdown(targetDate);
     }, 1000);
  }

  private updateCountdown(targetDate: Date): void {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance > 0) {
      this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    } else {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  // Carousel state for scheduled trips
  scheduledScrollIndex = 0;

  // Cancel trip popup state
  showCancelPopup = false;
  cancelTripRef: any = null;

  // Ticket popup state
  showTicketPopup = false;
  ticketTripRef: any = null;
  ticketCode = 'ABC123';

  async openTicketPopup(trip: any): Promise<void> {
    this.ticketTripRef = trip;
    this.showTicketPopup = true; this.cdr.detectChanges();

    // Gerar QR Code
    const ticketData = JSON.stringify({
      code: this.ticketCode,
      trip: `${trip.origin} → ${trip.destination}`,
      date: `${trip.day}/${trip.month}`,
      time: trip.time,
      passenger: 'Passageiro VanVan',
      vehicle: trip.vehicle
    });

    try {
      this.qrCodeDataUrl = await QRCode.toDataURL(ticketData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1B1B1F',
          light: '#FFFFFF'
        }
      });
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  }

  closeTicketPopup(): void {
    this.showTicketPopup = false;
    this.ticketTripRef = null; this.cdr.detectChanges();
  }

  openCancelPopup(trip: any): void {
    this.cancelTripRef = trip;
    this.showCancelPopup = true; this.cdr.detectChanges();
  }

  closeCancelPopup(): void {
    this.showCancelPopup = false;
    this.cancelTripRef = null; this.cdr.detectChanges();
  }

  confirmCancelTrip(): void {
    if(!this.cancelTripRef || !this.cancelTripRef.id) return;
    this.tripService.cancelBooking(this.cancelTripRef.id).subscribe({
      next: () => {
        this.toastService.success('Viagem cancelada com sucesso!');
        this.fetchTrips();
        this.closeCancelPopup();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erro ao cancelar a viagem.');
        this.closeCancelPopup();
      }
    });
  }

  rebookTrip(trip: any): void {
     const queryParams: any = {
        departureCity: trip.origin,
        arrivalCity: trip.destination,
        passengerCount: 1
     };

     // The user can re-choose the date on the search page manually
     this.router.navigate(['/buscar-viagens'], { queryParams });
  }

  // Avaliação popup state
  showEvaluatePopup = false;
  evaluateTripRef: any = null;
  currentRating = 0;
  currentComment = '';

  openEvaluatePopup(trip: any): void {
    this.evaluateTripRef = trip;
    this.showEvaluatePopup = true; this.cdr.detectChanges();
    this.currentRating = 0; // reset
    this.currentComment = ''; // reset
  }

  closeEvaluatePopup(): void {
    this.showEvaluatePopup = false;
    this.evaluateTripRef = null; this.cdr.detectChanges();
  }

  setRating(stars: number): void {
    this.currentRating = stars;
  }

  updateComment(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    if (target) {
      this.currentComment = target.value;
    }
  }

  submitEvaluation(): void {
    if (!this.evaluateTripRef || !this.evaluateTripRef.id || this.currentRating < 1) {
       this.toastService.error('Selecione uma nota válida.');
       return;
    }

    this.ratingService.enviarAvaliacao({
       tripId: this.evaluateTripRef.id,
       score: this.currentRating,
       comment: this.currentComment
    }).subscribe({
       next: () => {
         this.toastService.success('Avaliação enviada com sucesso!');
         this.closeEvaluatePopup();
       },
       error: (err) => {
         console.error('Falha ao enviar avaliação', err);
         this.toastService.error('Não foi possível enviar a avaliação.');
       }
    });

  }

  nextTrip: any = null;
  scheduledTrips: any[] = [];
  pastTrips: any[] = [];

  get currentScheduledTrip() {
    return this.scheduledTrips[this.scheduledScrollIndex] ?? this.scheduledTrips[0];
  }

  prevScheduled(): void {
    if (this.scheduledScrollIndex > 0) {
      this.scheduledScrollIndex--;
    }
  }

  nextScheduled(): void {
    if (this.scheduledScrollIndex < this.scheduledTrips.length - 1) {
      this.scheduledScrollIndex++;
    }
  }

  // Share trip via Web Share API
  async shareTrip(trip: any): Promise<void> {
    const shareData = {
      title: 'Minha Viagem VanVan',
      text: `Viagem de ${trip.origin} para ${trip.destination} no dia ${trip.day}/${trip.month} às ${trip.time}. Preço: ${trip.price}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${shareData.text}\n${shareData.url}`;
      await navigator.clipboard.writeText(text);
      this.toastService.success('Link copiado para a área de transferência!');
    }
  }
}
