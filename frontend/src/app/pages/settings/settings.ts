import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, PricingConfig } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html'
})
export class SettingsComponent implements OnInit {

  pricing: PricingConfig = {
    minimumFare: 0,
    perKmRate: 0,
    cancellationFee: 0,
    commissionRate: 0
  };

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.settingsService.obterTarifaAtual().subscribe({
      next: (config) => { this.pricing = config; },
      error: (err: unknown) => console.error('Erro ao carregar tarifa', err)
    });
  }

  saveRate(): void {
    if (
      this.pricing.perKmRate <= 0 ||
      this.pricing.minimumFare <= 0 ||
      this.pricing.cancellationFee <= 0 ||
      this.pricing.commissionRate < 0 ||
      this.pricing.commissionRate > 100
    ) {
      alert('Preencha todos os campos de tarifa com valores válidos. A comissão deve ser entre 0 e 100.');
      return;
    }
    this.settingsService.atualizarTarifa(this.pricing).subscribe({
      next: (saved) => {
        this.pricing = saved;
        alert('Tarifas salvas com sucesso!');
      },
      error: (err: unknown) => {
        console.error('Erro ao salvar tarifa', err);
        alert('Erro ao salvar as tarifas no servidor.');
      }
    });
  }
}