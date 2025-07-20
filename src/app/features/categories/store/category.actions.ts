import { createAction, props } from '@ngrx/store';
import { Category } from '../Models/category.model';


export const enum CategoriesActionNames {
  LOAD_CATEGORIES = '[Categories] Load Categories',
  LOAD_CATEGORIES_SUCCESS = '[Categories] Load Categories Success',
  LOAD_CATEGORIES_FAILURE = '[Categories] Load Categories Failure',

  LOAD_CATEGORY_BYID = '[Categories] Load Category By Id',
  LOAD_CATEGORY_BYID_SUCCESS = '[Categories] Load Category By Id Success',
  LOAD_CATEGORY_BYID_FAILURE = '[Categories] Load Category By Id Failure',

  CREATE_CATEGORY = '[Categories] Create Category',
  CREATE_CATEGORY_SUCCESS = '[Categories] Create Category Success',
  CREATE_CATEGORY_FAILURE = '[Categories] Create Category Failure',

  UPDATE_CATEGORY = '[Categories] Update Category',
  UPDATE_CATEGORY_SUCCESS = '[Categories] Update Category Success',
  UPDATE_CATEGORY_FAILURE = '[Categories] Update Category Failure',

  DELETE_CATEGORY = '[Categories] Delete Category',
  DELETE_CATEGORY_SUCCESS = '[Categories] Delete Category Success',
  DELETE_CATEGORY_FAILURE = '[Categories] Delete Category Failure',
}

export const loadCategories = createAction(CategoriesActionNames.LOAD_CATEGORIES);

export const loadCategoriesSuccess = createAction(
  CategoriesActionNames.LOAD_CATEGORIES_SUCCESS,
  props<{ categories: Category[] }>()
);

export const loadCategoriesFailure = createAction(
  CategoriesActionNames.LOAD_CATEGORIES_FAILURE,
  props<{ error: any }>()
);

export const loadCategoryById = createAction(
  CategoriesActionNames.LOAD_CATEGORY_BYID,
  props<{ id: number }>());

export const loadCategoryByIdSuccess = createAction(
  CategoriesActionNames.LOAD_CATEGORY_BYID_SUCCESS,
  props<{ category: Category }>()
);

export const loadCategoryByIdFailure = createAction(
  CategoriesActionNames.LOAD_CATEGORY_BYID_FAILURE,
  props<{ error: any }>()
);

export const createCategory = createAction(
  CategoriesActionNames.CREATE_CATEGORY,
  props<{ category: Category }>());

export const createCategorySuccess = createAction(
  CategoriesActionNames.CREATE_CATEGORY_SUCCESS,
  props<{ category: Category }>()
);

export const createCategoryFailure = createAction(
  CategoriesActionNames.CREATE_CATEGORY_FAILURE,
  props<{ error: any }>()
);

export const updateCategory = createAction(
  CategoriesActionNames.UPDATE_CATEGORY,
  props<{ category: Category }>()
);

export const updateCategorySuccess = createAction(
  CategoriesActionNames.UPDATE_CATEGORY_SUCCESS,
  props<{ category: Category }>()
);

export const updateCategoryFailure = createAction(
  CategoriesActionNames.UPDATE_CATEGORY_FAILURE,
  props<{ error: any }>()
);

export const deleteCategory = createAction(
  CategoriesActionNames.DELETE_CATEGORY,
  props<{ id: number }>()
);

export const deleteCategorySuccess = createAction(
  CategoriesActionNames.DELETE_CATEGORY_SUCCESS,
  props<{ id: number }>()
);

export const deleteCategoryFailure = createAction(
  CategoriesActionNames.DELETE_CATEGORY_FAILURE,
  props<{ error: any }>()
);