import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CityService, IBGEMunicipio } from './city.service';

describe('CityService', () => {
  let service: CityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CityService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and map cities correctly', () => {
    const mockResponse: IBGEMunicipio[] = [
      {
        id: 1,
        nome: 'São Paulo',
        microrregiao: {
          mesorregiao: {
            UF: {
              sigla: 'SP',
              nome: 'São Paulo'
            }
          }
        }
      },
      {
        id: 2,
        nome: 'Rio de Janeiro',
        microrregiao: {
          mesorregiao: {
            UF: {
              sigla: 'RJ',
              nome: 'Rio de Janeiro'
            }
          }
        }
      }
    ];

    service.getAllCities().subscribe(cities => {
      expect(cities.length).toBe(2);
      expect(cities[0].name).toBe('São Paulo');
      expect(cities[0].state).toBe('SP');
      expect(cities[0].label).toBe('São Paulo - SP');
      expect(cities[1].label).toBe('Rio de Janeiro - RJ');
    });

    const req = httpMock.expectOne('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle API error gracefully (returns empty array)', () => {
    service.getAllCities().subscribe(cities => {
      expect(cities).toEqual([]);
    });

    const req = httpMock.expectOne('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });
});
