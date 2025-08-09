import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as OrderActions from './order.actions';
import * as NotificationActions from '../../../shared/notifications/store/notification.actions';
import { NotificationModel, NotificationType } from '../../../shared/notifications/snackbar.model';
import { ErrorsModel } from '../../../shared/models/errors.model';
import { OrderService } from '../Services/order.service';
import { Order } from '../models/order.mdel';

@Injectable()
export class OrderEffects {
  loadOrders$;
  loadOrderById$;
  createOrder$;
  updateOrder$;
  deleteOrder$;
  createOrderSuccess$;
  createOrderFailure$;
  updateOrderSuccess$;
  deleteOrderSuccess$;
  deleteOrderFailure$;
  updateOrderFailure$;

  constructor(
    private readonly actions$: Actions,
    private readonly orderService: OrderService
  ) {
    this.loadOrders$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.loadOrders),
        mergeMap(() =>
          this.orderService.getOrders().pipe(
            map(orders => OrderActions.loadOrdersSuccess({ orders })),
            catchError((error: ErrorsModel<Order>) =>
              of(OrderActions.loadOrdersFailure({ error }))
            )
          )
        )
      )
    );

    this.loadOrderById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.loadOrderById),
        mergeMap(({ id }) =>
          this.orderService.getOrderById(id).pipe(
            map(order => OrderActions.loadOrderByIdSuccess({ order })),
            catchError(error =>
              of(OrderActions.loadOrdersFailure({ error }))
            )
          )
        )
      )
    );

    this.createOrder$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.createOrder),
        mergeMap((action) =>
          this.orderService.createOrder(action.order).pipe(
            map(() => OrderActions.createOrderSuccess({ order: action.order })),
            catchError((error: ErrorsModel<Order>) =>
              of(OrderActions.createOrderFailure({ error }))
            )
          )
        )
      )
    );

    this.createOrderFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.createOrderFailure),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            // text: action.error,
            text: 'Error!',
            type: NotificationType.Error,
            autoDisappear: false,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.createOrderSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.createOrderSuccess),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Order created successfully: ${action.order.id}`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.updateOrder$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.updateOrder),
        mergeMap((action) =>
          this.orderService.updateOrder(action.order).pipe(
            map(order => OrderActions.updateOrderSuccess({ order })),
            catchError((error: ErrorsModel<Order>) =>
              of(OrderActions.updateOrderFailure({ error }))
            )
          )
        )
      )
    );

    this.updateOrderSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.updateOrderSuccess),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Order updated successfully: ${action.order.id}`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.updateOrderFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.updateOrderFailure),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            // text: action.error?.error?.message,
            text: 'Error!',
            type: NotificationType.Error,
            autoDisappear: false,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.deleteOrder$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.deleteOrder),
        mergeMap((action) =>
          this.orderService.deleteOrder(action.id).pipe(
            map(() => OrderActions.deleteOrderSuccess({ id: action.id })),
            catchError(error =>
              of(OrderActions.deleteOrderFailure({ error }))
            )
          )
        )
      )
    );

    this.deleteOrderSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.deleteOrderSuccess),
        mergeMap(() => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Order deleted successfully!`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.deleteOrderFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(OrderActions.deleteOrderFailure),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            // text: action.error,
            text: 'Error!',
            type: NotificationType.Error,
            autoDisappear: false,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );
  }
}
