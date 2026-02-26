import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Journey {
  id: number;
  name: string;
  origin: string;
  destination: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html'
})
export class SettingsComponent {
  searchQuery = '';
  newOrigin = '';
  newDestination = '';
  newRateValue: number = 0;

  currentRate = 0.75;
  distance = 63; 

  private _journeys = signal<Journey[]>([
    { id: 1, name: 'Garanhuns-Recife', origin: 'Garanhuns', destination: 'Recife' },
    { id: 2, name: 'Caruaru-Maceió', origin: 'Caruaru', destination: 'Maceió' },
  ]);

  journeys = computed(() => {
    const query = this.searchQuery.toLowerCase();
    return this._journeys().filter(j => 
      j.name.toLowerCase().includes(query) || 
      j.origin.toLowerCase().includes(query) || 
      j.destination.toLowerCase().includes(query)
    );
  });

  // --- Cálculo do Valor Estimado ---
  get estimatedValue(): number {
    return this.distance * this.currentRate;
  }

  // --- Métodos de Ação ---

  addJourney() {
    if (!this.newOrigin || !this.newDestination) {
      alert('Preencha origem e destino!');
      return;
    }

    const newRow: Journey = {
      id: Date.now(), // ID temporário
      name: `${this.newOrigin}-${this.newDestination}`,
      origin: this.newOrigin,
      destination: this.newDestination
    };

    this._journeys.update(list => [...list, newRow]);
    
    // Limpa os campos após adicionar
    this.newOrigin = '';
    this.newDestination = '';
  }

  deleteJourney(id: number) {
    if (confirm('Tem certeza que deseja excluir este trecho?')) {
      this._journeys.update(list => list.filter(j => j.id !== id));
    }
  }

  editJourney(journey: Journey) {
    this.newOrigin = journey.origin;
    this.newDestination = journey.destination;
    // Aqui você poderia abrir um modal ou focar no input de edição
    console.log('Editando:', journey);
  }

  saveRate() {
    if (this.newRateValue > 0) {
      this.currentRate = this.newRateValue;
      alert(`Nova tarifa de R$${this.currentRate.toFixed(2)} salva com sucesso!`);
      this.newRateValue = 0;
    } else {
      alert('Insira um valor válido para a tarifa.');
    }
  }

  // Adicione estas variáveis dentro da classe SettingsComponent
showEditModal = false;
showDeleteModal = false;
selectedJourney: any = null; // Armazena a jornada que está sendo editada/excluída

// Funções para abrir os modais
openEditModal(journey: any) {
  this.selectedJourney = { ...journey }; // Cria uma cópia para não alterar a tabela antes de salvar
  this.showEditModal = true;
}

openDeleteModal(journey: any) {
  this.selectedJourney = journey;
  this.showDeleteModal = true;
}

closeModals() {
  this.showEditModal = false;
  this.showDeleteModal = false;
  this.selectedJourney = null;
}

confirmDelete() {
  // Sua lógica de excluir aqui
  this._journeys.update(list => list.filter(j => j.id !== this.selectedJourney.id));
  this.closeModals();
}

confirmSaveEdit() {
   // Sua lógica de salvar edição aqui
   this._journeys.update(list => list.map(j => j.id === this.selectedJourney.id ? this.selectedJourney : j));
   this.closeModals();
}
}