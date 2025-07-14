import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationModel, NotificationType } from './snackbar.model';
import * as NotificationActions from './store/notification.actions';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private store: Store) {}

  showNotification(text: string, type: NotificationType = NotificationType.Information, autoDisappear: boolean = true, miscButtonText?: string) {
    const notification: NotificationModel = {
      id: this.generateUniqueId(),
      text,
      type,
      autoDisappear,
      miscButtonText,
    };
    this.store.dispatch(NotificationActions.showNotification({ notification }));
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
