import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ProductActions from './products.actions';
import { ProductsService } from '../services/products.service';

@Injectable()
export class ProductsEffects {
  loadProducts$;
  loadProductById$;
  createProduct$;
  updateProduct$;
  deleteProduct$;

  constructor(
    private readonly actions$: Actions,
    private readonly productsService: ProductsService
  ) {
    this.loadProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.loadProducts),
        switchMap(() =>
          this.productsService.getProducts().pipe(
            tap(products => console.log('[Effect] Products loaded:', products)),
            map(products => ProductActions.loadProductsSuccess({ products })),
            catchError(error =>
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
            catchError(error =>
              of(ProductActions.createProductFailure({ error }))
            )
          )
        )
      )
    );

    this.updateProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.updateProduct),
        mergeMap((action) =>
          this.productsService.updateProduct(action.product).pipe(
            tap(product => console.log('[Effect] Product updated:', product)),
            map(product => ProductActions.updateProductSuccess({ product })),
            catchError(error =>
              of(ProductActions.updateProductFailure({ error }))
            )
          )
        )
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


  }
}
