import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './products.actions';
import { Product } from '../models/product.model';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: any;
  totalResults: number;
  lastDeletedProductId: number | null;
  lastCreatedProduct: Product | null;
  lastUpdatedProduct: Product | null;
}

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  totalResults: 0,
  lastDeletedProductId: null,
  lastCreatedProduct: null,
  lastUpdatedProduct: null
};

export const productsReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts,
    ProductActions.loadProductById, (state) => ({
      ...state,
      loading: true,
    })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    loading: false,
    products,
    totalResults: products.length
  })),
  on(ProductActions.loadProductsFailure,
    ProductActions.loadProductByIdFailure,
    ProductActions.createProductFailure,
    ProductActions.updateProductFailure,
    ProductActions.deleteProductFailure,
    (state, action) => ({
      ...state,
      loading: false,
      error: action.error,
      lastDeletedProductId: null,
      lastCreatedProduct: null,
      lastUpdatedProduct: null
    })),
  on(ProductActions.loadProductByIdSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    product,
    totalResults: 1,
    error: null
  })),
  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: [...state.products, product],
    totalResults: state.totalResults + 1,
    error: null,
    lastCreatedProduct: product
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: state.products.map(p => p.id === product.id ? product : p),
    lastUpdatedProduct: product,
    error: null
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    products: state.products.filter(p => p.id !== id), // remove the product
    totalResults: state.totalResults - 1,
    error: null,
    lastDeletedProductId: id
  })),
);
