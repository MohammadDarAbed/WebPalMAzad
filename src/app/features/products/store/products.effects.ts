import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ProductActions from './products.actions';
import { ProductsService } from '../services/products.service';
import * as NotificationActions from '../../../shared/notifications/store/notification.actions';
import { NotificationModel, NotificationType } from '../../../shared/notifications/snackbar.model';
import { Product } from '../models/product.model';
import { ErrorsModel } from '../../../shared/models/errors.model';

@Injectable()
export class ProductsEffects {
  loadProducts$;
  loadProductById$;
  createProduct$;
  updateProduct$;
  deleteProduct$;
  createProductSuccess$;
  createProductFailure$;
  updateProductSuccess$;
  deleteProductSuccess$;
  deleteProductFailure$;
  updateProductFailure$;

  constructor(
    private readonly actions$: Actions,
    private readonly productsService: ProductsService
  ) {
    this.loadProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.loadProducts),
        mergeMap(() =>
          this.productsService.getProducts().pipe(
            tap(products => console.log('[Effect] Products loaded:', products)),
            map(products => ProductActions.loadProductsSuccess({ products })),
            catchError((error: ErrorsModel<Product>) =>
              of(ProductActions.loadProductsFailure({ error }))
            )
          )
        )
      )
    );

    this.loadProductById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.loadProductById),
        mergeMap(({ id }) =>
          this.productsService.getProductById(id).pipe(
            tap(product => console.log('[Effect] Product loaded:', product)),
            map(product => ProductActions.loadProductByIdSuccess({ product })),
            catchError(error =>
              of(ProductActions.loadProductByIdFailure({ error }))
            )
          )
        )
      )
    );

    this.createProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.createProduct),
        mergeMap((action) =>
          this.productsService.createProduct(action.product).pipe(
            tap(product => console.log('[Effect] Product created:', product)),
            map(product => ProductActions.createProductSuccess({ product })),
            catchError((error: ErrorsModel<Product>) =>
              of(ProductActions.createProductFailure({ error }))
            )
          )
        )
      )
    );

    this.createProductFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.createProductFailure),
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

    this.createProductSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.createProductSuccess),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Product created successfully: ${action.product.name}`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.updateProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.updateProduct),
        mergeMap((action) =>
          this.productsService.updateProduct(action.product).pipe(
            tap(product => console.log('[Effect] Product updated:', product)),
            map(product => ProductActions.updateProductSuccess({ product })),
            catchError((error: ErrorsModel<Product>) =>
              of(ProductActions.updateProductFailure({ error }))
            )
          )
        )
      )
    );

    this.updateProductSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.updateProductSuccess),
        mergeMap((action) => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Product updated successfully: ${action.product.name}`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.updateProductFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.updateProductFailure),
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

    this.deleteProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.deleteProduct),
        mergeMap((action) =>
          this.productsService.deleteProduct(action.id).pipe(
            tap(id => console.log('[Effect] Product deleted:', id)),
            map(id => ProductActions.deleteProductSuccess({ id })),
            catchError(error =>
              of(ProductActions.deleteProductFailure({ error }))
            )
          )
        )
      )
    );

    this.deleteProductSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.deleteProductSuccess),
        mergeMap(() => {
          const notification: NotificationModel = {
            id: Date.now(),
            text: `Product deleted successfully!`,
            type: NotificationType.Information,
            autoDisappear: true,
          };
          return [NotificationActions.showNotification({ notification })];
        })
      )
    );

    this.deleteProductFailure$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.deleteProductFailure),
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
