import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'shrink-0 ' + (customClass || '')"
         [style.-webkit-mask]="'url(assets/icons/' + name + '.svg) no-repeat center / contain'"
         [style.mask]="'url(assets/icons/' + name + '.svg) no-repeat center / contain'">
    </div>
  `
})
export class IconComponent {
  @Input({ required: true }) name!: string;
  @Input() customClass: string = 'size-5'; // Default size
}
