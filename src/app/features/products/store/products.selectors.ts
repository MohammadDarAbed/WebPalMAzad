import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './products.reducer';

export const selectProductFeature = createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductFeature,
  (state) => state.products
);

export const selectProductLoading = createSelector(
  selectProductFeature,
  (state) => state.loading
);

export const selectProductError = createSelector(
  selectProductFeature,
  (state) => state.error
);

export const selectLastDeletedProductId = createSelector(
  selectProductFeature,
  (state) => state.lastDeletedProductId
);

export const selectLastCreatedProductId = createSelector(
  selectProductFeature,
  (state) => state.lastCreatedProduct
);