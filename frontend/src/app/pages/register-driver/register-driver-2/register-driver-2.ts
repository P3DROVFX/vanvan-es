import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-driver-2',
  standalone: true,
  imports: [FormsModule, RouterLink], // RouterLink permite usar routerLink no HTML
  templateUrl: './register-driver-2.html',
})
export class RegisterDriverTwo {
  // Campos do formulário (Step 2)
  chavePix = '';
  vehicle = '';
  licensePlate = '';
  
  // Variável para feedback de erro
  errorMessage = '';

  // Dados vindos da Etapa 1 (exemplo)
  private dadosEtapa1: any = {};

    constructor(
        private router: Router,
    ) {
    
        const nav = this.router.getCurrentNavigation();
        if (nav?.extras.state) {
        this.dadosEtapa1 = nav.extras.state['driver'];
        } else { 
            this.router.navigate(['/register-driver-1']);
        }
    }

    // Método chamado pelo botão "Finalizar" ou "Cadastrar"
    finalizarCadastro() {
        // 1. Validação simples
        if (!this.vehicle || !this.licensePlate || !this.chavePix) {
        this.errorMessage = 'Preencha todos os campos do veículo.';
        return;
        }

        // 2. Montar o objeto final (Juntando Step 1 + Step 2)
        const motoristaCompleto = {
        ...this.dadosEtapa1, 
        veiculo: this.vehicle,
        placa: this.licensePlate,
        chavePix: this.chavePix,
        role: 'DRIVER' 
        };

        console.log('Enviando para API:', motoristaCompleto);
    }
}