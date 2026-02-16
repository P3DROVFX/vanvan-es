import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Buttons } from '../../components/buttons/buttons';
import { Toggle } from '../../components/toggle/toggle';
import { Textfield } from '../../components/textfield/textfield';
import { Tag } from '../../components/tags/tags';
import { Checkbox } from '../../components/checkbox/checkbox';
import { Toast } from '../../components/toast/toast';
import { ToastService } from '../../components/toast/toast.service';
import { CityService, City } from '../../services/city.service';

@Component({
  selector: 'app-button-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, Buttons, Toggle, Textfield, Tag, Checkbox, Toast],
  templateUrl: './button-showcase.html',
  styleUrl: './button-showcase.css'
})
export class ButtonShowcase implements OnInit {
  toggleState1 = false;
  toggleState2 = true;
  toggleState3 = false;

  // Debug city search
  private cityService = inject(CityService);
  debugCityQuery = '';
  debugCitySuggestions: City[] = [];
  debugStatus = 'Aguardando digitação...';

  ngOnInit(): void {
    this.cityService.getAllCities().subscribe(cities => {
      this.debugStatus = `API carregada: ${cities.length} cidades`;
    });
  }

  onDebugCityInput(): void {
    this.debugStatus = `Buscando "${this.debugCityQuery}"...`;
    this.cityService.searchCities(this.debugCityQuery).subscribe(cities => {
      this.debugCitySuggestions = cities;
      this.debugStatus = `Encontradas: ${cities.length} cidades para "${this.debugCityQuery}"`;
    });
  }

  constructor(private toastService: ToastService) {}

  showSuccessToast() {
    this.toastService.success('Ação concluída com sucesso');
  }

  showErrorToast() {
    this.toastService.error('Erro na ação');
  }
}