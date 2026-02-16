import { Component, OnInit, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Toast } from '../models/toast.model';
import { ToastComponent } from './toast/toast.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];
  private toastService = inject(ToastService);

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}
