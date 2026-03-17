import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center w-full h-full min-h-[300px] animate-fade-in">
      <div class="w-24 h-24 bg-subtle-text/20 rounded-full flex items-center justify-center mb-6">
        <div class="w-12 h-12 bg-subtle-text"
             [style.-webkit-mask]="'url(assets/icons/' + icon + '.svg) no-repeat center / contain'"
             [style.mask]="'url(assets/icons/' + icon + '.svg) no-repeat center / contain'"></div>
      </div>
      <h3 class="text-xl font-bold text-text mb-2">{{ title }}</h3>
      <p class="text-base text-subtle-text max-w-md mb-6">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon: string = 'search-normal';
  @Input() title: string = 'Nenhum resultado encontrado';
  @Input() description: string = 'Não há nada para mostrar aqui no momento.';
}
