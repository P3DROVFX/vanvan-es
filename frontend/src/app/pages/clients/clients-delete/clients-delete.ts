import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-delete.html',
})
export class ClienteDeleteComponent {

  @Input() cliente: any;
  @Output() aoFechar = new EventEmitter<boolean>();

  carregando = false;

  constructor() {}

  fechar() {
    this.aoFechar.emit(false);
  }

  excluir() {
    if (!this.cliente || !this.cliente.id) return;

    this.carregando = true;
    console.log('Excluindo ID:', this.cliente.id);

    // SIMULAÇÃO
    setTimeout(() => {
      this.carregando = false;
      this.aoFechar.emit(true);
    }, 1000);

    /* CÓDIGO REAL:
    this.service.excluir(this.cliente.id).subscribe({
      next: () => {
        this.carregando = false;
        this.aoFechar.emit(true);
      },
      error: (err) => {
        this.carregando = false;
        alert('Erro ao excluir');
      }
    });
    */
  }
}