export declare enum NotificationType {
    Information = 1,
    Warning = 2,
    Error = 3
}
export interface NotificationModel {
    id?: string;
    type: NotificationType;
    text: string;
    miscButtonText?: string;
    autoDisappear?: boolean;
}
export interface NotificationViewModel extends NotificationModel {
    isError?: boolean;
}
