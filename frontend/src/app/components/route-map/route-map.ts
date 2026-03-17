import { Component, Input, OnChanges, SimpleChanges, ViewChild, PLATFORM_ID, Inject, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface RoutePoint {
  lat: number;
  lng: number;
  label?: string;
}

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="route-map-container rounded-[16px] overflow-hidden shadow-sm" [style.height]="height">
      <!-- Fallback se Leaflet não puder ser carregado -->
      <div *ngIf="!mapsAvailable" class="w-full h-full bg-light flex flex-col items-center justify-center gap-3">
        <div class="size-12 bg-subtle-text/50"
          style="-webkit-mask: url(assets/icons/location.svg) no-repeat center / contain; mask: url(assets/icons/location.svg) no-repeat center / contain;">
        </div>
        <span class="text-small text-subtle-text">Mapa não disponível</span>
      </div>

      <!-- Leaflet Map Container -->
      <div *ngIf="mapsAvailable" #mapContainer class="w-full h-full z-10"></div>
    </div>
  `,
  styles: [`
    .route-map-container {
      width: 100%;
      position: relative;
    }
  `]
})
export class RouteMap implements OnChanges, AfterViewInit, OnDestroy {
  @Input() origin: RoutePoint | null = null;
  @Input() destination: RoutePoint | null = null;
  @Input() originLabel: string = 'Origem';
  @Input() destinationLabel: string = 'Destino';
  @Input() height: string = '300px';
  @Input() showRoute: boolean = true;

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  mapsAvailable = false;
  private isBrowser = false;
  
  // Leaflet instances
  private map: any;
  private routingControl: any;
  private originMarker: any;
  private destinationMarker: any;

  distanceText: string = '';
  durationText: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.mapsAvailable = this.isBrowser;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initMap();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser && this.map) {
      if (changes['origin'] || changes['destination']) {
        this.updateMapPoints();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.map) {
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
      }
      this.map.remove();
    }
  }

  private initMap(): void {
    if (!this.mapContainer) return;
    
    // Dynamically import Leaflet to avoid SSR issues
    Promise.all([
      import('leaflet'),
      import('leaflet-routing-machine')
    ]).then(([L]) => {
      
      // Fix leaflet default icon paths
      const iconRetinaUrl = 'assets/marker-icon-2x.png';
      const iconUrl = 'assets/marker-icon.png';
      const shadowUrl = 'assets/marker-shadow.png';
      
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Default center (Pernambuco)
      const centerLat = this.origin?.lat || -8.89;
      const centerLng = this.origin?.lng || -36.49;

      this.map = L.map(this.mapContainer.nativeElement).setView([centerLat, centerLng], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(this.map);

      this.updateMapPoints(L);
    });
  }

  private updateMapPoints(LModule?: any): void {
    if (!this.map) return;
    
    // Retrieve L dynamically or from arg if called during init
    const L = LModule || (window as any).L;
    if (!L) return;

    // Reset previous layers
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }
    if (this.originMarker) { this.map.removeLayer(this.originMarker); this.originMarker = null; }
    if (this.destinationMarker) { this.map.removeLayer(this.destinationMarker); this.destinationMarker = null; }

    const hasOrigin = this.origin && this.origin.lat != null && this.origin.lng != null;
    const hasDest = this.destination && this.destination.lat != null && this.destination.lng != null;

    if (hasOrigin && hasDest && this.showRoute) {
      // Draw Route via OSRM
      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(this.origin!.lat, this.origin!.lng),
          L.latLng(this.destination!.lat, this.destination!.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        show: false, // Don't show the step-by-step instructions box
        lineOptions: {
          styles: [
            { color: '#F66B0E', opacity: 0.8, weight: 6 } // Main brand color
          ]
        },
        createMarker: (i: number, wp: any) => {
          const color = i === 0 ? '#1E88E5' : '#F66B0E';
          return L.circleMarker(wp.latLng, {
            radius: 8,
            fillColor: color,
            fillOpacity: 1,
            color: '#FFFFFF',
            weight: 3
          }).bindPopup(i === 0 ? this.originLabel : this.destinationLabel);
        }
      }).addTo(this.map);

      this.routingControl.on('routesfound', (e: any) => {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          const summary = routes[0].summary;
          // distance in meters to km
          this.distanceText = (summary.totalDistance / 1000).toFixed(1) + ' km';
          // time in seconds to minutes
          const minutes = Math.round(summary.totalTime / 60);
          if (minutes > 60) {
            this.durationText = Math.floor(minutes / 60) + 'h ' + (minutes % 60) + 'm';
          } else {
            this.durationText = minutes + ' min';
          }
        }
      });

    } else if (hasOrigin) {
      // Only Origin
      this.originMarker = L.circleMarker([this.origin!.lat, this.origin!.lng], {
        radius: 10, fillColor: '#1E88E5', fillOpacity: 1, color: '#fff', weight: 3
      }).addTo(this.map).bindPopup(this.originLabel);
      this.map.setView([this.origin!.lat, this.origin!.lng], 14);

    } else if (hasDest) {
      // Only Destination
      this.destinationMarker = L.circleMarker([this.destination!.lat, this.destination!.lng], {
        radius: 10, fillColor: '#F66B0E', fillOpacity: 1, color: '#fff', weight: 3
      }).addTo(this.map).bindPopup(this.destinationLabel);
      this.map.setView([this.destination!.lat, this.destination!.lng], 14);
    }
  }

  getDistance(): string {
    return this.distanceText;
  }

  getDuration(): string {
    return this.durationText;
  }
}

