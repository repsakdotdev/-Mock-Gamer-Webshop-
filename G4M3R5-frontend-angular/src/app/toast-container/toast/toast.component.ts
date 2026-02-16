import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Toast } from '../../models/toast.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() toast!: Toast;
  @Output() closeToast = new EventEmitter<number>();

  close(): void {
    this.closeToast.emit(this.toast.id);
  }

  getImagePath(): string {
    const basePath = 'assets/images/';
    switch (this.toast.type) {
      case 'success':
        return `${basePath}success.png`;
      case 'error':
        return `${basePath}error.png`;
      case 'warning':
        return `${basePath}warning.png`;
      case 'info':
        return `${basePath}info.png`;
      default:
        return `${basePath}info.png`;
    }
  }
}
