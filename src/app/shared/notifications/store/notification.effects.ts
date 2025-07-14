import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as NotificationActions from './notification.actions';

@Injectable()
export class NotificationEffects {
  showNotification$;

  constructor(private actions$: Actions) {
    this.showNotification$ = createEffect(() =>
      this.actions$.pipe(
        ofType(NotificationActions.showNotification),
        tap(action => {
          // Here you can add side effects like logging or triggering UI notifications
          console.log('Notification:', action.notification);
        })
      ),
      { dispatch: false }
    );

  }


}
