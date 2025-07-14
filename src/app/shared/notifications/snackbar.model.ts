export enum NotificationType {
    Information = 1,
    Warning = 2,
    Error = 3
}
export interface NotificationModel {
    id: number;
    type: NotificationType;
    text: string;
    autoDisappear?: boolean;
}
