import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ProductActions from './products.actions';
import { ProductsService } from '../services/products.service';


@Injectable()
export class ProductsEffects {
  loadProducts$;

  constructor(
    private actions$: Actions,
    private productsService: ProductsService
  ) {
    this.loadProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductActions.loadProducts),
        mergeMap(() =>
          this.productsService.getProducts().pipe(
            tap(products => console.log('Products loaded from API:', products)),
            map(products => ProductActions.loadProductsSuccess({ products })),
            catchError(error => {
              console.error('Error loading products:', error);
              return of(ProductActions.loadProductsFailure({ error }));
            })
          )
        )
      )
    );
  }
}

