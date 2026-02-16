import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();
  private nextId = 1;
  
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = this.nextId++;
    const notification: Notification = { message, type, id };
    
    const currentNotifications = [...this.notifications.value, notification];
    this.notifications.next(currentNotifications);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.removeNotification(id);
    }, 3000);
    
    return id;
  }
  
  removeNotification(id: number) {
    const currentNotifications = this.notifications.value.filter(n => n.id !== id);
    this.notifications.next(currentNotifications);
  }
}