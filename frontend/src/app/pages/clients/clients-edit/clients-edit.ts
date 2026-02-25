import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-edit.html',
})
export class ClienteEditComponent implements OnInit {

  @Input() cliente: any; // Recebe o cliente clicado na tabela
  @Output() aoFechar = new EventEmitter<boolean>();

  clienteEditado: any = {}; // Cópia local para edição
  mostrarSenha = false;
  carregando = false;

  constructor() {}

  ngOnInit(): void {
    if (this.cliente) {
      this.clienteEditado = { ...this.cliente };
    }
  }

  fechar() {
    this.aoFechar.emit(false); // Emite 'false' indicando que apenas fechou/cancelou
  }

  salvar() {
    if (!this.clienteEditado.id) return;

    this.carregando = true;
    console.log('Editando cliente:', this.clienteEditado);

    // SIMULAÇÃO (Substitua pelo serviço real)
    setTimeout(() => {
      this.carregando = false;
      this.aoFechar.emit(true); // Emite 'true' indicando que salvou com sucesso
    }, 1000);
  }
}