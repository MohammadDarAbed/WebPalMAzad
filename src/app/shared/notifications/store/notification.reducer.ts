import { NotificationModel } from '../snackbar.model';
import * as NotificationActions from './notification.actions';

export interface NotificationState {
  notifications: NotificationModel[];
}

export const initialNotificationState: NotificationState = {
  notifications: [],
};

export function notificationReducer(
  state = initialNotificationState,
  action: any
): NotificationState {
  switch (action.type) {
    case NotificationActions.showNotification.type:
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case NotificationActions.removeNotification.type:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      };
    default:
      return state;
  }
}
