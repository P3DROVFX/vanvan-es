import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize =  'medium';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buttons.html',
  styleUrl: './buttons.css',
})
export class Buttons {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() customClass: string = '';
  @Input() loading: boolean = false;

  get buttonClasses(): string {
    const baseClasses = 'font-google-sans-flex font-bold uppercase rounded-lg transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95';

    // Size classes
    const sizeClasses = {
      medium: 'min-w-[3rem] px-10 py-4 text-button-text',
    };

    // Variant classes
    const variantClasses = {
      primary: (this.disabled || this.loading)
        ? 'bg-light text-subtle-text cursor-not-allowed opacity-40'
        : 'bg-primary text-light hover:bg-primary/80 active:bg-primary',
      secondary: (this.disabled || this.loading)
        ? 'bg-light text-subtle-text cursor-not-allowed opacity-40'
        : 'bg-light text-secondary hover:bg-secondary/10 active:bg-light',
      tertiary: (this.disabled || this.loading)
        ? 'bg-light text-subtle-text cursor-not-allowed opacity-40'
        : 'bg-light text-tetiary hover:bg-tetiary/10 active:bg-light'
    };

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${widthClass} ${this.customClass}`;
  }
}
