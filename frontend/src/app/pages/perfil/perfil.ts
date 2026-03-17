import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../services/auth.service';
import { ToastService } from '../../components/toast/toast.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html'
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  user: UserProfile | null = null;
  isDarkTheme = false;

  isEditing = false;
  editData = { name: '', email: '', phone: '' };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showLogoutConfirm = false;

  constructor() {
    effect(() => {
      const u = this.authService.currentUser();
      if (u) {
        this.user = u;
      }
    });

    // Fetch if not available from signal
    if (!this.user) {
      this.authService.getMe().subscribe({
        next: (profile) => this.user = profile,
        error: () => this.toastService.error('Erro ao buscar perfil.')
      });
    }
  }

  ngOnInit() {
    this.isDarkTheme = document.documentElement.classList.contains('dark') || 
                       document.body.classList.contains('dark');
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  startEditing(): void {
    if (!this.user) return;
    this.editData = {
      name: this.user.name || '',
      email: this.user.email || '',
      phone: ''
    };
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  saveProfile(): void {
    // Profile update endpoint would go here
    this.toastService.success('Perfil atualizado com sucesso!');
    if (this.user) {
      this.user.name = this.editData.name;
      this.user.email = this.editData.email;
    }
    this.isEditing = false;
  }

  updatePassword(): void {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.toastService.error('Por favor, preencha todos os campos de senha.');
      return;
    }
    if (this.passwordData.newPassword.length < 6) {
      this.toastService.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastService.error('A nova senha e a confirmação não coincidem.');
      return;
    }

    // API call to change password would go here
    this.toastService.success('Senha alterada com sucesso!');
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }

  openLogoutConfirm(): void {
    this.showLogoutConfirm = true;
  }

  closeLogoutConfirm(): void {
    this.showLogoutConfirm = false;
  }

  confirmLogout(): void {
    this.showLogoutConfirm = false;
    this.authService.logout();
  }

  logout(): void {
    this.openLogoutConfirm();
  }
}
