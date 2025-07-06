import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './products.actions';
import { Product } from './products.models';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: any;
  totalResults: number;

}

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  totalResults: 0

};

export const productsReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    loading: false,
    products,
    totalResults: products.length
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
