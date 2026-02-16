import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '../models/toast.model';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private nextId = 1;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000): number {
    const id = this.nextId++;
    const toast: Toast = {
      id,
      message,
      type,
      autoClose: true,
      duration
    };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (toast.autoClose) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  showSuccess(message: string, duration = 3000): number {
    return this.show(message, 'success', duration);
  }

  showError(message: string, duration = 3000): number {
    return this.show(message, 'error', duration);
  }

  showInfo(message: string, duration = 3000): number {
    return this.show(message, 'info', duration);
  }

  remove(id: number): void {
    this.toastsSubject.next(
      this.toastsSubject.value.filter(toast => toast.id !== id)
    );
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}
