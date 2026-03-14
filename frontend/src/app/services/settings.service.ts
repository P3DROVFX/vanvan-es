import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Journey {
  id?: number;
  name: string;
  origin: string;
  destination: string;
}

/**
 * Espelha PricingUpdateDTO.java e a entidade Pricing.java
 * Endpoint: GET/PUT /api/admin/settings/pricing
 */
export interface PricingConfig {
  minimumFare: number;
  perKmRate: number;
  cancellationFee: number;
  commissionRate: number;
}

/**
 * Espelha DriverAdminResponseDTO — campos usados no select de motoristas.
 * Endpoint: GET /api/admin/drivers
 */
export interface DriverOption {
  id: string;   // UUID
  name: string;
}

/** Resposta paginada do Spring (Page<T>) */
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly API_URL = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  // --- Trechos ---
  listarTrechos(): Observable<Journey[]> {
    return this.http.get<Journey[]>(`${this.API_URL}/routes`);
  }

  adicionarTrecho(trecho: Journey): Observable<Journey> {
    return this.http.post<Journey>(`${this.API_URL}/routes`, trecho);
  }

  editarTrecho(id: number, trecho: Journey): Observable<Journey> {
    return this.http.put<Journey>(`${this.API_URL}/routes/${id}`, trecho);
  }

  excluirTrecho(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/routes/${id}`);
  }

  // --- Motoristas ---
  // GET /api/admin/drivers?size=100
  listarMotoristas(page = 0, size = 100): Observable<SpringPage<DriverOption>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<SpringPage<DriverOption>>(`${this.API_URL}/drivers`, { params });
  }

  // --- Tarifa ---
  // GET /api/admin/settings/pricing
  obterTarifaAtual(): Observable<PricingConfig> {
    return this.http.get<PricingConfig>(`${this.API_URL}/settings/pricing`);
  }

  // PUT /api/admin/settings/pricing
  atualizarTarifa(tarifa: PricingConfig): Observable<PricingConfig> {
    return this.http.put<PricingConfig>(`${this.API_URL}/settings/pricing`, tarifa);
  }
}