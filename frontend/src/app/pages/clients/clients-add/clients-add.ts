import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/client.service';
@Component({
  selector: 'app-cliente-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-add.html',
})
export class ClienteAddComponent {

  @Output() aoFechar = new EventEmitter<boolean>();

  // Objeto que armazena os dados do formulário
  novoCliente = {
    nome: '',
    identidade: '',
    telefone: '',
    email: '',
    senha: ''
  };

  mostrarSenha = false;
  carregando = false;

  constructor(private service: ClienteService) {} // <-- DESCOMENTADO!

  fechar() {
    this.aoFechar.emit(false); // Fecha sem atualizar
  }

  salvar() {
    // Validação simples
    if (!this.novoCliente.nome || !this.novoCliente.email || !this.novoCliente.identidade) {
      alert('Preencha os campos obrigatórios (Nome, Email e Identidade/CPF)!');
      return;
    }

    this.carregando = true;

    // TRADUÇÃO: Pegamos os dados do HTML e montamos o formato que o Spring Boot exige
    const clienteParaBackend = {
      name: this.novoCliente.nome,
      cpf: this.novoCliente.identidade,
      phone: this.novoCliente.telefone,
      email: this.novoCliente.email,
      password: this.novoCliente.senha,
      role: 'PASSENGER', // Define automaticamente como cliente
      birthDate: '1990-01-01' // <-- ATENÇÃO: Coloquei uma data fixa porque seu Java exige esse campo e não tem no seu HTML!
    };

    console.log('Enviando para API:', clienteParaBackend);

    this.service.adicionar(clienteParaBackend).subscribe({
      next: () => {
        this.carregando = false;
        this.aoFechar.emit(true); // Fecha e avisa para atualizar a lista
        // Limpa o formulário
        this.novoCliente = { nome: '', identidade: '', telefone: '', email: '', senha: '' };
      },
      error: (err: any) => {
        console.error('Erro retornado pelo backend:', err);
        this.carregando = false;
        alert('Erro ao salvar cliente. Verifique a aba Network (Rede) no F12!');
      }
    });
  }
}