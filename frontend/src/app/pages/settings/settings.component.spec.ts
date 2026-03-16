import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { of } from 'rxjs';
import { SettingsComponent } from './settings';
import { SettingsService, PricingConfig } from '../../services/settings.service';

const mockPricing: PricingConfig = {
  minimumFare: 10,
  perKmRate: 1.5,
  cancellationFee: 2.5,
  commissionRate: 15
};

// Tipagem explícita para que vi.fn() exponha mockReturnValue sem ambiguidade
interface SettingsServiceMock {
  obterTarifaAtual: ReturnType<typeof vi.fn>;
  atualizarTarifa: ReturnType<typeof vi.fn>;
}

function makeSettingsServiceMock(): SettingsServiceMock {
  return {
    obterTarifaAtual: vi.fn().mockReturnValue(of(mockPricing)),
    atualizarTarifa: vi.fn().mockReturnValue(of(mockPricing))
  };
}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let settingsServiceMock: SettingsServiceMock;

  beforeEach(() => {
    settingsServiceMock = makeSettingsServiceMock();
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, SettingsComponent],
      providers: [
        { provide: SettingsService, useValue: settingsServiceMock }
      ]
    });
    component = TestBed.createComponent(SettingsComponent).componentInstance;
  });

  afterEach(() => vi.clearAllMocks());

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // ─── Inicialização ────────────────────────────────────────────────────────

  describe('ngOnInit', () => {
    it('should load pricing on init', () => {
      component.ngOnInit();
      expect(settingsServiceMock.obterTarifaAtual).toHaveBeenCalled();
      expect(component.pricing).toEqual(mockPricing);
    });
  });

  // ─── saveRate ─────────────────────────────────────────────────────────────

  describe('saveRate', () => {
    beforeEach(() => {
      component.pricing = { ...mockPricing };
    });

    it('should call atualizarTarifa with full pricing object', () => {
      component.saveRate();
      expect(settingsServiceMock.atualizarTarifa).toHaveBeenCalledWith(mockPricing);
    });

    it('should update pricing with saved result', () => {
      const saved: PricingConfig = { minimumFare: 20, perKmRate: 3, cancellationFee: 5, commissionRate: 20 };
      settingsServiceMock.atualizarTarifa.mockReturnValue(of(saved));
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      component.saveRate();
      expect(component.pricing).toEqual(saved);
    });

    it('should alert when perKmRate is 0', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      component.pricing.perKmRate = 0;
      component.saveRate();
      expect(alertSpy).toHaveBeenCalled();
      expect(settingsServiceMock.atualizarTarifa).not.toHaveBeenCalled();
    });

    it('should alert when minimumFare is 0', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      component.pricing.minimumFare = 0;
      component.saveRate();
      expect(alertSpy).toHaveBeenCalled();
      expect(settingsServiceMock.atualizarTarifa).not.toHaveBeenCalled();
    });
  });
});