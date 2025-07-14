import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { NotificationModel, NotificationType } from './snackbar.model';
import { NotificationState } from './store/notification.reducer';
import { map } from 'rxjs/operators';
import { MaterialModule } from "../material.module";
import { MatIconModule } from '@angular/material/icon';
import * as NotificationActions from './store/notification.actions';

@Component({
  selector: 'app-notification-snackbar',
  standalone: true,
  imports: [CommonModule,
    MaterialModule,
    MatIconModule],
  templateUrl: './notification-snackbar.component.html',
  styleUrls: ['./notification-snackbar.component.scss']
})
export class NotificationSnackbarComponent implements OnInit, OnDestroy {
  notifications$: Observable<NotificationModel[]>;
  private subscriptions: Subscription[] = [];

  constructor(private store: Store<{ notificationState: NotificationState }>) {
    this.notifications$ = this.store.pipe(
      select('notificationState'),
      map(state => state.notifications)
    );
  }

  ngOnInit(): void {
    this.notifications$.subscribe(notifications => {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = [];
      notifications.forEach(notification => {
        if (notification.autoDisappear) {
          const sub = timer(2000).subscribe(() => {
            this.removeNotification(notification.id!);
            sub.unsubscribe();
          });
          this.subscriptions.push(sub);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  trackById(index: number, item: NotificationModel) {
    return item.id;
  }

  notificationTypeClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.Information:
        return 'Information';
      case NotificationType.Warning:
        return 'Warning';
      case NotificationType.Error:
        return 'Error';
      default:
        return '';
    }
  }

  removeNotification(id: number) {
    this.store.dispatch(NotificationActions.removeNotification({ id: id }));
  }
}
