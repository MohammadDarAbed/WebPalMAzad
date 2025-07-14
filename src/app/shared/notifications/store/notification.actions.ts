import { createAction, props } from '@ngrx/store';
import { NotificationModel } from '../snackbar.model';

export const showNotification = createAction(
  '[Notifications] Show Notification',
  props<{ notification: NotificationModel }>()
);

export const removeNotification = createAction(
  '[Notifications] Remove Notification',
  props<{ id: number }>()
);

