import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-motorista-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './motorista-edit.component.html',
  styleUrl: './motorista-edit.component.css' // Se houver CSS
})
export class MotoristaEditComponent {
  // Recebe os dados do pai
  @Input() motorista: any; 

  mostrarSenha = false;
  // Emite eventos para o pai
  @Output() aoFechar = new EventEmitter<void>();
  @Output() aoSalvar = new EventEmitter<any>();

  fechar() {
    this.aoFechar.emit();
  }

  salvar() {
    // Emite o objeto motorista modificado de volta para o pai
    this.aoSalvar.emit(this.motorista);
  }
}