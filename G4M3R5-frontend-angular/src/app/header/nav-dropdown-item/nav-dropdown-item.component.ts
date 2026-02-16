import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-dropdown-item.component.html',
  styleUrl: './nav-dropdown-item.component.scss'
})
export class NavDropdownItemComponent {
  @Input() icon?: string;
  @Input() label!: string;
  @Output() itemClick = new EventEmitter<void>();

  onClick(): void {
    this.itemClick.emit();
  }
}
