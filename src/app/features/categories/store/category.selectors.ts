import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from './category.reducer';

export const selectCategoryFeature = createFeatureSelector<CategoryState>('categories');

export const selectAllCategories = createSelector(
  selectCategoryFeature,
  (state) => state.categories
);

export const selectCategoryLoading = createSelector(
  selectCategoryFeature,
  (state) => state.loading
);

export const selectCategoryError = createSelector(
  selectCategoryFeature,
  (state) => state.error
);

export const selectLastDeletedCategoryId = createSelector(
  selectCategoryFeature,
  (state) => state.lastDeletedCategoryId
);

export const selectLastCreatedCategoryId = createSelector(
  selectCategoryFeature,
  (state) => state.lastCreatedCategory
);
