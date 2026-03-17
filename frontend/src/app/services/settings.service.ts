import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../models/pagination.model';

export interface Journey {
  id?: number;
  name: string;
  origin: string;
  destination: string;
}

export interface PricingConfig {
  minimumFare: number;
  perKmRate: number;
  cancellationFee: number;
  commissionRate: number;
}

export interface DriverOption {
  id: string;   // UUID
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly API_URL = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  listarMotoristas(page = 0, size = 100): Observable<PageResponse<DriverOption>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponse<DriverOption>>(`${this.API_URL}/drivers`, { params });
  }

  obterTarifaAtual(): Observable<PricingConfig> {
    return this.http.get<PricingConfig>(`${this.API_URL}/settings/pricing`);
  }

  atualizarTarifa(tarifa: PricingConfig): Observable<PricingConfig> {
    return this.http.put<PricingConfig>(`${this.API_URL}/settings/pricing`, tarifa);
  }
}