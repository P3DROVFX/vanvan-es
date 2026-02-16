import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, shareReplay, tap } from 'rxjs';

export interface IBGEMunicipio {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
        nome: string;
      };
    };
  };
}

export interface City {
  name: string;
  state: string;
  label: string; // "Cidade - UF"
}

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private readonly API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome';
  private cities$: Observable<City[]> | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  /** Loads all cities once and caches the result */
  getAllCities(): Observable<City[]> {
    // Skip on server to avoid caching empty results
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }

    if (!this.cities$) {
      this.cities$ = this.http.get<IBGEMunicipio[]>(this.API_URL).pipe(
        tap(data => console.log(`[CityService] Loaded ${data.length} cities from IBGE API`)),
        map(municipios =>
          municipios
            .filter(m => m.microrregiao?.mesorregiao?.UF?.sigla)
            .map(m => ({
              name: m.nome,
              state: m.microrregiao.mesorregiao.UF.sigla,
              label: `${m.nome} - ${m.microrregiao.mesorregiao.UF.sigla}`,
            }))
        ),
        catchError(err => {
          console.error('[CityService] Error loading cities:', err);
          this.cities$ = null; // Reset cache so it retries
          return of([]);
        }),
        shareReplay(1)
      );
    }
    return this.cities$;
  }

  /** Filters cities by partial name match, returning up to `limit` results */
  searchCities(query: string, limit = 8): Observable<City[]> {
    if (!query || query.trim().length < 2) return of([]);

    const normalizedQuery = this.normalize(query);

    return this.getAllCities().pipe(
      map(cities =>
        cities
          .filter(c => this.normalize(c.name).includes(normalizedQuery))
          .slice(0, limit)
      )
    );
  }

  /** Removes accents and lowercases for better matching */
  private normalize(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
