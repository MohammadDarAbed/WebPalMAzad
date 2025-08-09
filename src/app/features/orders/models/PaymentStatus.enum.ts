export enum PaymentStatus {
    Unpaid = 1,
    Paid = 2,
    Failed = 3,
    Refunded = 4
}

export interface UpdatePaymentStatusModel {
    status: PaymentStatus;
}