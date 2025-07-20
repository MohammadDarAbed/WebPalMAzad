import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from './category.actions';
import { Category } from '../Models/category.model';

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: any;
  totalResults: number;

}

export const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  totalResults: 0

};

export const CategoryReducer = createReducer(
  initialState,
  on(CategoryActions.loadCategories, 
    CategoryActions.loadCategoryById, (state) => ({
    ...state,
    loading: true,
  })),
  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    categories,
    totalResults: categories.length
  })),
  on(CategoryActions.loadCategoriesFailure,
    CategoryActions.loadCategoryByIdFailure,
    CategoryActions.createCategoryFailure,
    CategoryActions.updateCategoryFailure,
    CategoryActions.deleteCategoryFailure,
    (state,  action ) => ({
      ...state,
      loading: false,
      error: action.error,

    })),
  on(CategoryActions.loadCategoryByIdSuccess, (state, { category }) => ({
    ...state,
    loading: false,
    category,
    totalResults: 1,
    error: null
  })),
  on(CategoryActions.createCategorySuccess, (state, { category }) => ({
    ...state,
    loading: false,
    categories: [...state.categories, category],
    totalResults: state.totalResults + 1,
    error: null
  })),
on(CategoryActions.updateCategorySuccess, (state, { category }) => ({
  ...state,
  loading: false,
  categories: state.categories.map(p => p.id === category.id ? category : p),
  error: null
})),
on(CategoryActions.deleteCategorySuccess, (state, { id }) => ({
  ...state,
  loading: false,
  categories: state.categories.filter(p => p.id !== id), // remove the category
  totalResults: state.totalResults - 1,
  error: null
})),
);
